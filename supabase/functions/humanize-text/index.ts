// supabase/functions/humanize-text/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const tonePrompts: Record<string, string> = {
  professional: "Rewrite this text in a professional, business-appropriate tone. Use clear, confident language.",
  friendly: "Rewrite this in a warm, friendly tone. Make it feel like a conversation with a friend.",
  emotional: "Rewrite with emotional depth. Add warmth and empathy.",
  comedic: "Rewrite with humor and wit. Add light jokes while keeping the meaning.",
  academic: "Rewrite in a scholarly, academic tone. Use formal language.",
  casual: "Rewrite in a relaxed, casual tone. Make it sound natural.",
  genz: "Rewrite in Gen-Z style. Use trendy expressions and slang.",
  formal: "Rewrite in a highly formal and dignified tone.",
  persuasive: "Rewrite to be persuasive and compelling.",
  storytelling: "Rewrite in a narrative storytelling style.",
};

Deno.serve(async (req) => {
  // 1. Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { text, tone } = await req.json();
    const API_KEY = Deno.env.get('GEMINI_API_KEY');

    if (!API_KEY) throw new Error('GEMINI_API_KEY is not set');
    if (!text) throw new Error('Text is required');

    // 2. Prepare Prompt
    const toneInstruction = tonePrompts[tone] || tonePrompts.professional;
    const prompt = `You are a humanizing AI. Your task is to rewrite AI-generated text to sound authentically human.
    
    Goals:
    1. Remove robotic patterns and repetition.
    2. Add natural variations and subtle imperfections.
    3. Maintain original meaning.
    
    Tone: ${toneInstruction}
    
    Text to rewrite:
    "${text}"
    
    IMPORTANT: Return ONLY the rewritten text. No quotes, no intro.`;

    // 3. Call Google Gemini API
  const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini Error:", data);
      throw new Error(data.error?.message || "Failed to process text");
    }

    const humanizedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Could not generate text.";

    return new Response(
      JSON.stringify({ humanizedText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});