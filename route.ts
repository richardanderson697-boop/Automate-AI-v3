import { createClient } from '@/lib/supabase/server'
import { generateDiagnosisWithRAG } from '@/lib/ragsvc'
import { findEducationalVideos } from '@/lib/video-search'
import { incrementDiagnosticsUsage, checkDiagnosticsLimit } from '@/lib/usage-tracking'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = await createClient()

  try {
    // 1. Authenticate the Shop/User
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // 2. Check Usage Limits (Don't run expensive AI if they're over limit)
    const canRun = await checkDiagnosticsLimit(user.id)
    if (!canRun) return NextResponse.json({ error: 'Monthly limit reached' }, { status: 403 })

    // 3. Parse Request Data
    const { description, symptoms, vehicleInfo, imageMetadata } = await req.json()

    // 4. Perform RAG Search (Search Supabase for similar past cases)
    // We generate an embedding for the user's current problem
    const { data: knowledgeMatches } = await supabase.rpc('match_repair_knowledge', {
      query_embedding: await generateEmbedding(description), // Helper to call Gemini Embedding API
      match_threshold: 0.5,
      match_count: 3,
    })

    const context = knowledgeMatches?.map((k: any) => k.content).join('\n---\n') || ''

    // 5. Generate AI Diagnosis via Gemini
    const aiResult = await generateDiagnosisWithRAG(description, context)

    // 6. Fetch Educational Videos (Parallel to save time)
    const educationalVideos = await findEducationalVideos(
      aiResult.diagnosis,
      symptoms || [description],
      vehicleInfo
    )

    // 7. Save to Database
    const { data: record, error: saveError } = await supabase
      .from('ai_diagnostics')
      .insert({
        user_id: user.id,
        input_data: description,
        diagnosis: aiResult.diagnosis,
        recommended_parts: aiResult.recommendedParts,
        estimated_cost: aiResult.estimatedCost,
        confidence_score: aiResult.confidence,
        educational_videos: educationalVideos,
      })
      .select()
      .single()

    if (saveError) throw saveError

    // 8. Increment Usage Count
    await incrementDiagnosticsUsage(user.id)

    return NextResponse.json({ success: true, data: record })

  } catch (error: any) {
    console.error('Diagnostic Pipeline Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Helper to call Gemini Embedding API (Required for the RPC search)
async function generateEmbedding(text: string) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${process.env.GEMINI_API_KEY}`, {
    method: 'POST',
    body: JSON.stringify({ content: { parts: [{ text }] } })
  })
  const json = await response.json()
  return json.embedding.values
}
