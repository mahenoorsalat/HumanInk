// supabase/functions/razorpay-webhook/index.ts
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crypto } from "https://deno.land/std@0.177.0/crypto/mod.ts";

const RAZORPAY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET')!;

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    // 1. Verify Webhook Signature (Security)
    const signature = req.headers.get('x-razorpay-signature');
    const body = await req.text();

    const encoder = new TextEncoder();
    const keyData = encoder.encode(RAZORPAY_SECRET);
    const bodyData = encoder.encode(body);
    
    const key = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const signatureBuffer = await crypto.subtle.sign("HMAC", key, bodyData);
    
    // Convert buffer to hex string to compare
    const signatureArray = Array.from(new Uint8Array(signatureBuffer));
    const generatedSignature = signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');

    if (generatedSignature !== signature) {
      return new Response('Invalid signature', { status: 400 });
    }

    // 2. Process the Event
    const json = JSON.parse(body);
    const event = json.event;

    if (event === 'payment.captured' || event === 'order.paid') {
      const payment = json.payload.payment.entity;
      const notes = payment.notes; // We attached user_id here in Step 2
      const userId = notes.user_id;

      if (userId) {
        const supabaseAdmin = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        // UPDATE YOUR DATABASE HERE
        // Example: Set user as 'pro' or add credits
        const { error } = await supabaseAdmin
          .from('profiles')
          .update({ is_pro: true }) // Adjust this to match your table column
          .eq('id', userId);
          
        if (error) console.error('DB Update Error:', error);
      }
    }

    return new Response(JSON.stringify({ received: true }), { 
      headers: { 'Content-Type': 'application/json' },
      status: 200 
    });

  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
});