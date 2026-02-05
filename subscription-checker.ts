import { createClient } from '@/lib/supabase/server'

export async function checkSubscriptionAccess() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { hasAccess: false, subscription: null, usage: null }
  }

  // Get current subscription
  const { data: subscription } = await supabase
    .from('shop_subscriptions')
    .select('*, subscription_plans(*)')
    .eq('shop_id', user.id)
    .eq('status', 'active')
    .single()

  if (!subscription) {
    return { hasAccess: false, subscription: null, usage: null }
  }

  // Get current usage
  const { data: usage } = await supabase
    .from('usage_tracking')
    .select('*')
    .eq('shop_id', user.id)
    .order('period_start', { ascending: false })
    .limit(1)
    .single()

  // Check if within limits
  const plan = subscription.subscription_plans
  const hasAccess =
    subscription.status === 'active' &&
    new Date(subscription.current_period_end) > new Date()

  return {
    hasAccess,
    subscription,
    usage,
    plan,
  }
}

export async function incrementDiagnosticsUsage(shopId: string) {
  const supabase = await createClient()

  // Get or create current period usage record
  const now = new Date()
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  const { data: existing } = await supabase
    .from('usage_tracking')
    .select('*')
    .eq('shop_id', shopId)
    .gte('period_start', periodStart.toISOString())
    .single()

  if (existing) {
    await supabase
      .from('usage_tracking')
      .update({
        diagnostics_used: existing.diagnostics_used + 1,
      })
      .eq('id', existing.id)
  } else {
    await supabase.from('usage_tracking').insert({
      shop_id: shopId,
      period_start: periodStart.toISOString(),
      period_end: periodEnd.toISOString(),
      diagnostics_used: 1,
      storage_used_gb: 0,
    })
  }
}

export async function checkDiagnosticsLimit(shopId: string): Promise<boolean> {
  const supabase = await createClient()

  const { data: subscription } = await supabase
    .from('shop_subscriptions')
    .select('*, subscription_plans(*)')
    .eq('shop_id', shopId)
    .eq('status', 'active')
    .single()

  if (!subscription) return false

  const plan = subscription.subscription_plans
  if (plan.diagnostics_limit === -1) return true // Unlimited

  const { data: usage } = await supabase
    .from('usage_tracking')
    .select('*')
    .eq('shop_id', shopId)
    .order('period_start', { ascending: false })
    .limit(1)
    .single()

  if (!usage) return true // No usage yet

  return usage.diagnostics_used < plan.diagnostics_limit
}
