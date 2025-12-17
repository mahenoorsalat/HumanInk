import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Razorpay from "npm:razorpay@2.9.2";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Initialize Supabase Client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // 2. Get the User
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // 3. Get Data from Frontend
    const { priceId, amount } = await req.json();

    // 4. Initialize Razorpay with Secrets
    const razorpay = new Razorpay({
      key_id: Deno.env.get('RAZORPAY_KEY_ID'),
      key_secret: Deno.env.get('RAZORPAY_KEY_SECRET'),
    });

    // 5. Create Order
    // Razorpay expects amount in paise (1 INR = 100 paise)
    const options = {
      amount: amount * 100, 
      currency: "INR",
      receipt: `receipt_${user.id.substring(0, 10)}_${Date.now()}`,
      notes: {
        user_id: user.id, // Store user ID to identify payment later
        plan: priceId 
      }
    };

    const order = await razorpay.orders.create(options);

    // 6. Return Order ID to Frontend
    return new Response(
      JSON.stringify({ 
        orderId: order.id, 
        amount: order.amount, 
        currency: order.currency,
        keyId: Deno.env.get('RAZORPAY_KEY_ID') // Frontend needs Key ID to open modal
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error("Backend Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});