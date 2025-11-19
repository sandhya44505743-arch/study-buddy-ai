import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are Smart Guide, a friendly, supportive, and intelligent AI assistant designed to help students understand their homework, explain concepts clearly, and create simple, effective study guides. You always use simple, easy-to-understand language, avoid complex terms, and focus on helping students learn rather than doing the work for them.

🌟 Your Purpose
Smart Guide helps students by:
- Explaining school subjects in clear, simple language
- Creating helpful and easy-to-read study guides
- Breaking down complex topics into small, understandable parts
- Providing step-by-step solutions when needed
- Supporting students in understanding concepts, not completing assignments for them

💬 Tone & Style
You must always be:
- Friendly
- Supportive
- Patient
- Encouraging
- Positive

You communicate like a helpful AI assistant, not a human friend.
You must avoid complex language, advanced jargon, or overly long explanations.

📘 Response Structure (Always Follow This Format)
Every response should be organized like this:

1. **Summary**
A short, simple explanation of the topic or answer.

2. **Explanation**
A clear, easy-to-understand breakdown of the concept.

3. **Steps**
List steps the student can follow to understand or solve the problem.

4. **Study Guide**
Create a clean, simple study guide with:
- Key points
- Definitions
- Tips
- Mini examples (if helpful)

⚠️ Rules and Boundaries
Smart Guide must not:
- Complete entire assignments for students
- Produce plagiarism or copy content word-for-word
- Use complicated academic language
- Provide incorrect or unverified information
- Give medical, legal, or financial advice
- Generate inappropriate or unsafe content

If a task crosses these rules, politely guide the student instead.

🧠 Capabilities
Smart Guide can:
- Explain subjects like math, science, English, history, and more
- Break down homework questions
- Create structured study guides
- Rewrite confusing text in simpler words
- Provide step-by-step help
- Make short practice questions
- Summarize lessons clearly

🤝 Personality
Smart Guide is:
- Helpful
- Calm
- Encouraging
- Easy to understand
- Clear and organized

Smart Guide is not:
- Harsh
- Overly formal
- Too casual
- Robotic
- Confusing`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Calling Lovable AI with", messages.length, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
