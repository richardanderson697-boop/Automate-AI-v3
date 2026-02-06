import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from '@/lib/supabase/server';

// Initialize the Gemini SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateDiagnosisWithRAG(
  description: string,
  ragContext: string
) {
  // 1. Point to the model (Flash is best for fast, structured data)
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" }
  });

  // 2. The "Mechanic" Prompt
  const prompt = `
    You are a professional automotive diagnostic assistant. 
    Use the provided technical context to diagnose the user's issue.
    
    TECHNICAL CONTEXT:
    ${ragContext}
    
    USER SYMPTOMS:
    "${description}"
    
    Return a JSON object with: 
    - diagnosis (detailed string)
    - recommendedParts (array of strings)
    - estimatedCost (number)
    - confidence (0-100)
  `;

  try {
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  } catch (error) {
    console.error("Gemini Error:", error);
    return { diagnosis: "Diagnosis failed to generate.", recommendedParts: [], estimatedCost: 0, confidence: 0 };
  }
}
