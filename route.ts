import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// This route handles Stripe webhooks
export async function POST(request: NextRequest) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!stripeSecretKey || !webhookSecret) {
    console.log('[v0] Stripe webhook - keys not configured')
    return NextResponse.json({ received: true })
  }

  try {
    const stripe = require('stripe')(stripeSecretKey)
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    // Initialize Supabase admin client for webhook operations
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    console.log('[v0] Stripe webhook event:', event.type)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const shopId = session.metadata?.shop_id
        const planId = session.metadata?.plan_id

        if (!shopId || !planId) break

        // Create subscription record
        await supabase.from('shop_subscriptions').insert({
          shop_id: shopId,
          plan_id: planId,
          status: 'active',
          stripe_subscription_id: session.subscription,
          stripe_customer_id: session.customer,
          current_period_start: new Date(session.created * 1000).toISOString(),
          current_period_end: new Date(
            (session.created + 30 * 24 * 60 * 60) * 1000
          ).toISOString(),
        })

        console.log('[v0] Subscription created for shop:', shopId)
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object

        await supabase
          .from('shop_subscriptions')
          .update({
            status: subscription.status,
            current_period_start: new Date(
              subscription.current_period_start * 1000
            ).toISOString(),
            current_period_end: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id)

        console.log('[v0] Subscription updated:', subscription.id)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object

        await supabase
          .from('shop_subscriptions')
          .update({
            status: 'canceled',
            canceled_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id)

        console.log('[v0] Subscription canceled:', subscription.id)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object

        // Track usage for the billing period
        await supabase.from('usage_tracking').insert({
          shop_id: invoice.metadata?.shop_id,
          period_start: new Date(invoice.period_start * 1000).toISOString(),
          period_end: new Date(invoice.period_end * 1000).toISOString(),
          diagnostics_used: 0,
          storage_used_gb: 0,
        })

        console.log('[v0] Payment succeeded for invoice:', invoice.id)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object

        await supabase
          .from('shop_subscriptions')
          .update({
            status: 'past_due',
          })
          .eq('stripe_customer_id', invoice.customer)

        console.log('[v0] Payment failed for customer:', invoice.customer)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[v0] Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    )
  }
}
