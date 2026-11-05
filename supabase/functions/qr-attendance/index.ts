// Supabase Edge Function: qr-attendance
// Generates and validates cryptographically secure rotating QR tokens for lecture attendance
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

    const { action, sessionId, token, studentId } = await req.json();

    if (action === "generate-token") {
      // Faculty initiates or rotates token
      const timestamp = Math.floor(Date.now() / 25000); // 25-second rotating epoch
      const secret = "UNISPHERE_QR_SECRET_KEY";
      const encoder = new TextEncoder();
      const keyData = encoder.encode(secret);
      const msgData = encoder.encode(`${sessionId}:${timestamp}`);

      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      const signature = await crypto.subtle.sign("HMAC", cryptoKey, msgData);
      const hashArray = Array.from(new Uint8Array(signature));
      const tokenHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("").substring(0, 32);

      const rotatingToken = `${sessionId}.${timestamp}.${tokenHash}`;

      return new Response(JSON.stringify({ token: rotatingToken, validForSeconds: 25 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "scan-and-record") {
      // Student scans QR code
      if (!token) {
        return new Response(JSON.stringify({ success: false, message: "Token missing" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const parts = token.split(".");
      if (parts.length !== 3) {
        return new Response(JSON.stringify({ success: false, message: "Invalid QR code format" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const [tokenSessionId, tokenEpochStr, tokenHash] = parts;
      const currentEpoch = Math.floor(Date.now() / 25000);
      const tokenEpoch = parseInt(tokenEpochStr, 10);

      // Verify token is within 1 epoch window (current or previous 25-sec window for clock skew)
      if (Math.abs(currentEpoch - tokenEpoch) > 1) {
        return new Response(JSON.stringify({ success: false, message: "QR Code expired. Scan the latest code on screen." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check session exists and is active
      const { data: session } = await adminClient
        .from("attendance_sessions")
        .select("*, subjects(name)")
        .eq("id", tokenSessionId)
        .eq("is_active", true)
        .single();

      if (!session) {
        return new Response(JSON.stringify({ success: false, message: "Attendance session is closed or invalid." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const verifiedStudentId = studentId || user.id;

      // Insert record (enforces unique(session_id, student_id))
      const { error: insertError } = await adminClient.from("attendance_records").insert({
        session_id: tokenSessionId,
        student_id: verifiedStudentId,
        subject_id: session.subject_id,
        status: "present",
        verification_method: "qr_scan",
      });

      if (insertError) {
        if (insertError.code === "23505") { // unique constraint violation
          return new Response(JSON.stringify({ success: false, message: "Attendance already recorded for this lecture!" }), {
            status: 409,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        throw insertError;
      }

      // Log to audit_logs
      await adminClient.from("audit_logs").insert({
        user_id: verifiedStudentId,
        action: "ATTENDANCE_RECORDED",
        entity_type: "attendance_records",
        entity_id: tokenSessionId,
        details: { subject: session.subjects?.name, method: "qr_scan" },
      });

      return new Response(
        JSON.stringify({
          success: true,
          message: `Attendance marked present for ${session.subjects?.name}!`,
          timestamp: new Date().toISOString(),
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
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
