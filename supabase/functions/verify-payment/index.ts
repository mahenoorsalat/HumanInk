// supabase/functions/verify-payment/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// 1. Setup Server
Deno.serve(async (req) => {
  // 2. Handle CORS Preflight (Browser Check)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 3. Initialize Supabase Admin Client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '' // Use SERVICE_ROLE to ensure we can update users
    );

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, priceId, user_id } = await req.json();

    // 4. Verify Signature (Using Native Web Crypto - No Imports)
    const secret = Deno.env.get('RAZORPAY_KEY_SECRET')!;
    const generated_signature = await hmacSha256(secret, razorpay_order_id + "|" + razorpay_payment_id);

    if (generated_signature !== razorpay_signature) {
      throw new Error("Invalid payment signature");
    }

    // 5. Determine Plan Limits
    let plan = 'pro';
    let word_limit = 50000; // Pro Limit
    
    if (priceId && priceId.includes('business')) {
      plan = 'business';
      word_limit = 1000000; // Unlimited
    }

    // 6. Update User Profile
    // We use the passed 'user_id' or get it from the header if you prefer security context
    const { error: updateError } = await supabaseClient
      .from('profiles')
      .update({
        is_pro: true,
        subscription_tier: plan,
        // Make sure your database has a column for limits if you want to track it dynamically, 
        // otherwise the frontend logic handles the static limit display.
      })
      .eq('id', user_id); // Ensure you pass user_id from frontend

    if (updateError) throw updateError;

    // 7. Success Response
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    // 8. Error Response (Must include CORS headers!)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Helper: Native HMAC SHA256 (No external libraries)
async function hmacSha256(secret: string, data: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(data)
  );
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}