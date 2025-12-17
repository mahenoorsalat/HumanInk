// supabase/functions/detect-ai/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    const API_KEY = Deno.env.get('GEMINI_API_KEY');

    if (!API_KEY) throw new Error('GEMINI_API_KEY is not set');
    if (!text) throw new Error('Text is required');

    const prompt = `Analyze this text for AI generation patterns.
    Text: "${text.substring(0, 1000)}"
    
    Determine the likelihood it is AI-written (0-100).
    Respond with this JSON structure only:
    {
      "score": <number>,
      "analysis": "<short explanation>",
      "indicators": ["<point 1>", "<point 2>"]
    }`;

    // 3. Call Google Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" } // Force JSON
        })
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || "AI Error");
    }

    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const result = JSON.parse(rawText);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    // Fallback if AI fails
    return new Response(
      JSON.stringify({ 
        score: 0, 
        analysis: "Could not analyze text. " + error.message, 
        indicators: [] 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});