// Supabase Edge Function: ai-assistant
// Handles queries using LLM with RLS-protected context injection
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

    const { query, history } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY") ?? Deno.env.get("OPENAI_API_KEY");

    // Supabase client authenticated as user (RLS enforced)
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch user profile and relevant academic data
    const { data: profile } = await supabase
      .from("profiles")
      .select("*, departments(name)")
      .eq("id", user.id)
      .single();

    let context = `User: ${profile?.full_name || "Student"}, Role: ${profile?.role || "student"}. `;
    if (profile?.role === "student") {
      const { data: attendance } = await supabase
        .from("attendance_records")
        .select("status, subjects(name)")
        .eq("student_id", user.id);
      const { data: assignments } = await supabase
        .from("assignments")
        .select("title, due_date, subjects(name)")
        .limit(5);
      context += `Recent attendance records: ${attendance?.length || 0}. Upcoming assignments: ${assignments?.map(a => a.title).join(", ") || "None"}.`;
    }

    // Call LLM API (e.g. Gemini 1.5 Flash / standard model)
    let aiResponse = "UniSphere AI: I am here to help you with your coursework, attendance tracking, exam schedule, and campus facilities!";
    if (geminiApiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [
                    {
                      text: `You are UniSphere Campus Assistant, a helpful and secure AI for college students and faculty.
Context regarding current user: ${context}
Answer the following student question concisely and academically:
"${query}"`,
                    },
                  ],
                },
              ],
            }),
          }
        );
        const data = await response.json();
        aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || aiResponse;
      } catch (e) {
        console.error("LLM fetch error:", e);
      }
    } else {
      aiResponse = `[UniSphere AI]: As a ${profile?.role || "student"}, your query regarding "${query}" has been processed. In production, configure GEMINI_API_KEY in your Supabase Edge Function Secrets for live LLM completions.`;
    }

    return new Response(JSON.stringify({ reply: aiResponse }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
