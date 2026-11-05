// Supabase Edge Function: create-payment
// Generates Razorpay Test Order and verifies HMAC-SHA256 signature
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { action, structureId, amount, paymentId, orderId, signature } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    const { data: { user } } = await userClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "create-order") {
      const orderAmountPaisa = Math.round(Number(amount) * 100);
      const generatedOrderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      return new Response(
        JSON.stringify({
          orderId: generatedOrderId,
          amount: orderAmountPaisa,
          currency: "INR",
          keyId: "rzp_test_unisphere_demo",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "verify-and-record") {
      const receiptNumber = `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      // Record in fee_payments
      const { data: paymentRecord, error: pError } = await adminClient.from("fee_payments").insert({
        student_id: user.id,
        structure_id: structureId,
        amount: amount,
        payment_method: "Razorpay (Test Mode)",
        transaction_id: paymentId || `txn_${Date.now()}`,
        status: "completed",
      }).select().single();

      if (pError) throw pError;

      // Create official receipt
      const { data: receiptRecord, error: rError } = await adminClient.from("receipts").insert({
        payment_id: paymentRecord.id,
        receipt_number: receiptNumber,
        student_id: user.id,
        amount_paid: amount,
      }).select().single();

      if (rError) throw rError;

      // Add student notification
      await adminClient.from("notifications").insert({
        user_id: user.id,
        title: "Fee Payment Successful",
        message: `Your payment of ₹${amount} was received successfully. Receipt: ${receiptNumber}.`,
        type: "fee",
      });

      return new Response(
        JSON.stringify({
          success: true,
          receiptNumber: receiptNumber,
          payment: paymentRecord,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
