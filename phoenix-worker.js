/**
 * PHOENIX WORKER — BJ Beyond
 * Groq API + X post URL fetch via nitter
 * Secret: GROQ_API_KEY
 */

const ALLOWED_ORIGIN = "https://bjbeyond.it";
const MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `You are the Phoenix Algorithm Analyzer for BJ Beyond (bjbeyond.it).
You analyze X (Twitter) posts and simulate how the Phoenix ranking algorithm would score them.

Phoenix is X's open-source recommendation model (xai-org/x-algorithm, May 2026 update).
It predicts engagement probability across: likes, replies, reposts, dwell time, out-of-network reach.

Analyze the post and return ONLY a valid JSON object, no other text, no markdown, no backticks:
{
  "finalScore": <integer 0-100>,
  "verdict": <"HIGH RANKING POTENTIAL" | "MODERATE SIGNAL" | "LOW REACH PREDICTED">,
  "verdictColor": <"#00e5ff" | "#ffaa00" | "#ff4d4d">,
  "scores": {
    "favorite": <integer 0-100>,
    "reply": <integer 0-100>,
    "repost": <integer 0-100>,
    "dwell": <integer 0-100>,
    "oon": <integer 0-100>,
    "spam": <integer 0-100>
  },
  "signals": [
    { "text": "<signal description>", "positive": <true|false> }
  ],
  "insight": "<2-3 sentence qualitative analysis of why this post would or would not perform well>",
  "hookScore": <integer 1-5>,
  "wordCount": <integer>,
  "charCount": <integer>
}
Return ONLY the JSON object, nothing else.`;

async function fetchPostText(url) {
  // Convert x.com or twitter.com URL to nitter
  const nitterUrl = url
    .replace("https://x.com", "https://nitter.net")
    .replace("https://twitter.com", "https://nitter.net")
    .split("?")[0];

  try {
    const res = await fetch(nitterUrl, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });
    if (!res.ok) throw new Error("Nitter fetch failed");
    const html = await res.text();

    // Extract tweet text from nitter HTML
    const match = html.match(/<div class="tweet-content[^"]*"[^>]*>([\s\S]*?)<\/div>/);
    if (!match) throw new Error("Could not extract tweet text");

    // Strip HTML tags
    const text = match[1].replace(/<[^>]+>/g, "").trim();
    if (!text || text.length < 3) throw new Error("Empty tweet text");
    return text;
  } catch (e) {
    // Try alternative nitter instances
    const instances = ["https://nitter.privacydev.net", "https://nitter.poast.org"];
    for (const instance of instances) {
      try {
        const altUrl = url
          .replace("https://x.com", instance)
          .replace("https://twitter.com", instance)
          .split("?")[0];
        const res = await fetch(altUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
        if (!res.ok) continue;
        const html = await res.text();
        const match = html.match(/<div class="tweet-content[^"]*"[^>]*>([\s\S]*?)<\/div>/);
        if (!match) continue;
        const text = match[1].replace(/<[^>]+>/g, "").trim();
        if (text && text.length > 3) return text;
      } catch {}
    }
    throw new Error("Could not fetch post from X. Please paste the text manually.");
  }
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405, headers: { "Content-Type": "application/json", ...corsHeaders() }
      });
    }

    let body;
    try { body = await request.json(); }
    catch { return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders() } }); }

    let { postText, postUrl } = body;

    // If URL provided, fetch text from nitter
    if (postUrl && (!postText || postText.trim().length < 5)) {
      try {
        postText = await fetchPostText(postUrl);
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
          status: 422, headers: { "Content-Type": "application/json", ...corsHeaders() }
        });
      }
    }

    if (!postText || postText.trim().length < 5) {
      return new Response(JSON.stringify({ error: "Post text required" }), {
        status: 400, headers: { "Content-Type": "application/json", ...corsHeaders() }
      });
    }

    let groqResponse;
    try {
      groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + env.GROQ_API_KEY,
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 800,
          temperature: 0.3,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: 'Analyze this X post:\n\n"' + postText.trim() + '"' }
          ]
        }),
      });
    } catch {
      return new Response(JSON.stringify({ error: "Groq API unreachable" }), {
        status: 502, headers: { "Content-Type": "application/json", ...corsHeaders() }
      });
    }

    if (!groqResponse.ok) {
      const errText = await groqResponse.text();
      return new Response(JSON.stringify({ error: "Groq API error", detail: errText }), {
        status: 502, headers: { "Content-Type": "application/json", ...corsHeaders() }
      });
    }

    const data = await groqResponse.json();
    const raw = data?.choices?.[0]?.message?.content || "";

    let result;
    try {
      const clean = raw.replace(/```json|```/g, "").trim();
      result = JSON.parse(clean);
    } catch {
      return new Response(JSON.stringify({ error: "Failed to parse AI response", raw }), {
        status: 500, headers: { "Content-Type": "application/json", ...corsHeaders() }
      });
    }

    // Include extracted text in response
    result.extractedText = postText.trim();

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders() }
    });
  },
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "https://bjbeyond.it",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}
