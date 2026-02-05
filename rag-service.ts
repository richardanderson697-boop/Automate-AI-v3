import { createClient } from '@/lib/supabase/server'

// Embedding generation using Google's text embedding model
export async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.GEMINI_API_KEY
  
  if (!apiKey) {
    console.log('[v0] No GEMINI_API_KEY found, using mock embedding')
    // Return mock embedding for development
    return Array.from({ length: 768 }, () => Math.random())
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'models/text-embedding-004',
          content: { parts: [{ text }] },
        }),
      }
    )

    const data = await response.json()
    return data.embedding.values
  } catch (error) {
    console.error('[v0] Embedding generation error:', error)
    // Fallback to mock embedding
    return Array.from({ length: 768 }, () => Math.random())
  }
}

// Search knowledge base using vector similarity
export async function searchKnowledgeBase(
  query: string,
  limit = 5
): Promise<Array<{
  id: string
  title: string
  content: string
  category: string
  similarity: number
}>> {
  const supabase = await createClient()
  
  // Generate embedding for the query
  const queryEmbedding = await generateEmbedding(query)
  
  // Search using the match_repair_knowledge function
  const { data, error } = await supabase.rpc('match_repair_knowledge', {
    query_embedding: queryEmbedding,
    match_threshold: 0.7,
    match_count: limit,
  })

  if (error) {
    console.error('[v0] Knowledge base search error:', error)
    return []
  }

  return data || []
}

// Add new knowledge to the knowledge base
export async function addKnowledge(
  title: string,
  content: string,
  category: string,
  tags: string[] = []
): Promise<{ id: string } | null> {
  const supabase = await createClient()
  
  // Generate embedding for the content
  const embedding = await generateEmbedding(`${title} ${content}`)
  
  const { data, error } = await supabase
    .from('repair_knowledge')
    .insert({
      title,
      content,
      category,
      tags,
      embedding,
    })
    .select('id')
    .single()

  if (error) {
    console.error('[v0] Error adding knowledge:', error)
    return null
  }

  return data
}

// Build enhanced context for AI diagnosis
export async function buildDiagnosticContext(
  userInput: string
): Promise<string> {
  const relevantKnowledge = await searchKnowledgeBase(userInput, 3)
  
  if (relevantKnowledge.length === 0) {
    return 'No relevant repair knowledge found in the database.'
  }

  const context = relevantKnowledge
    .map((item, index) => {
      return `
Reference ${index + 1}: ${item.title} (${item.category})
Similarity: ${(item.similarity * 100).toFixed(1)}%
Content: ${item.content}
---`
    })
    .join('\n')

  return `RELEVANT REPAIR KNOWLEDGE FROM DATABASE:\n${context}`
}

// Save diagnosis result to history
export async function saveDiagnosisHistory(
  userId: string,
  inputType: 'text' | 'image' | 'audio',
  inputData: string,
  diagnosis: string,
  recommendedParts: string[],
  estimatedCost: number,
  confidence: number
): Promise<void> {
  const supabase = await createClient()
  
  const { error } = await supabase.from('ai_diagnostics').insert({
    user_id: userId,
    input_type: inputType,
    input_data: inputData,
    diagnosis,
    recommended_parts: recommendedParts,
    estimated_cost: estimatedCost,
    confidence_score: confidence,
  })

  if (error) {
    console.error('[v0] Error saving diagnosis:', error)
  }
}

// Get diagnosis history for a user
export async function getDiagnosisHistory(
  userId: string,
  limit = 10
): Promise<Array<{
  id: string
  input_type: string
  diagnosis: string
  recommended_parts: string[]
  estimated_cost: number
  confidence_score: number
  created_at: string
}>> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('ai_diagnostics')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('[v0] Error fetching diagnosis history:', error)
    return []
  }

  return data || []
}
