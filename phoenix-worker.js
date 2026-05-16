/**

- PHOENIX WORKER — BJ Beyond
- Cloudflare Worker: proxy sicuro verso Anthropic API
- Deploy su: https://dash.cloudflare.com → Workers & Pages → Create Worker
- Aggiungi secret: ANTHROPIC_API_KEY → Settings → Variables → Secret
  */

const ALLOWED_ORIGIN = “https://bjbeyond.it”;
const MODEL = “claude-sonnet-4-20250514”;

const SYSTEM_PROMPT = `You are the Phoenix Algorithm Analyzer for BJ Beyond (bjbeyond.it).
You analyze X (Twitter) posts and simulate how the Phoenix ranking algorithm would score them.

Phoenix is X’s open-source recommendation model (xai-org/x-algorithm, May 2026 update).
It predicts engagement probability across: likes, replies, reposts, dwell time, out-of-network reach.

Analyze the post and return ONLY a valid JSON object with this exact structure:
{
“finalScore”: <integer 0-100>,
“verdict”: <“HIGH RANKING POTENTIAL” | “MODERATE SIGNAL” | “LOW REACH PREDICTED”>,
“verdictColor”: <”#00e5ff” | “#ffaa00” | “#ff4d4d”>,
“scores”: {
“favorite”: <integer 0-100>,
“reply”: <integer 0-100>,
“repost”: <integer 0-100>,
“dwell”: <integer 0-100>,
“oon”: <integer 0-100>,
“spam”: <integer 0-100>
},
“signals”: [
{ “text”: “<signal description>”, “positive”: <true|false> }
],
“insight”: “<2-3 sentence qualitative analysis of why this post would or wouldn’t perform well in the For You feed. Be specific about content strategy.>”,
“hookScore”: <integer 1-5>,
“wordCount”: <integer>,
“charCount”: <integer>
}

Scoring rules:

- finalScore: weighted combination of all engagement signals minus spam/block risk
- favorite: probability of likes (hook quality, credibility signals, numbers)
- reply: probability of replies (questions, controversy, conversation triggers)
- repost: probability of reposts (data, insight, list format)
- dwell: time spent reading (length, structure, formatting)
- oon: out-of-network reach (hashtags, viral angle, broad appeal)
- spam: spam/block risk score (LOW is good — under 10 is ideal)
- hookScore: quality of first 8 words (1=weak, 5=exceptional)
- signals: list 3-6 specific positive and negative signals found in the post

Be analytical, precise, and genuinely helpful. No generic advice.`;

export default {
async fetch(request, env) {
// CORS preflight
if (request.method === “OPTIONS”) {
return new Response(null, {
headers: {
“Access-Control-Allow-Origin”: ALLOWED_ORIGIN,
“Access-Control-Allow-Methods”: “POST, OPTIONS”,
“Access-Control-Allow-Headers”: “Content-Type”,
“Access-Control-Max-Age”: “86400”,
},
});
}

```
// Only POST allowed
if (request.method !== "POST") {
  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
    headers: corsHeaders(ALLOWED_ORIGIN),
  });
}

// Parse body
let body;
try {
  body = await request.json();
} catch {
  return new Response(JSON.stringify({ error: "Invalid JSON" }), {
    status: 400,
    headers: corsHeaders(ALLOWED_ORIGIN),
  });
}

const { postText } = body;
if (!postText || postText.trim().length < 5) {
  return new Response(JSON.stringify({ error: "Post text required" }), {
    status: 400,
    headers: corsHeaders(ALLOWED_ORIGIN),
  });
}

// Call Anthropic API
let anthropicResponse;
try {
  anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 800,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Analyze this X post and return the JSON score:\n\n"${postText.trim()}"`,
        },
      ],
    }),
  });
} catch (err) {
  return new Response(JSON.stringify({ error: "Anthropic API unreachable" }), {
    status: 502,
    headers: corsHeaders(ALLOWED_ORIGIN),
  });
}

if (!anthropicResponse.ok) {
  const errText = await anthropicResponse.text();
  return new Response(JSON.stringify({ error: "Anthropic API error", detail: errText }), {
    status: 502,
    headers: corsHeaders(ALLOWED_ORIGIN),
  });
}

const data = await anthropicResponse.json();
const raw = data?.content?.[0]?.text || "";

// Parse JSON from response
let result;
try {
  const clean = raw.replace(/```json|```/g, "").trim();
  result = JSON.parse(clean);
} catch {
  return new Response(JSON.stringify({ error: "Failed to parse AI response", raw }), {
    status: 500,
    headers: corsHeaders(ALLOWED_ORIGIN),
  });
}

return new Response(JSON.stringify(result), {
  status: 200,
  headers: {
    "Content-Type": "application/json",
    ...corsHeaders(ALLOWED_ORIGIN),
  },
});
```

},
};

function corsHeaders(origin) {
return {
“Access-Control-Allow-Origin”: origin,
“Access-Control-Allow-Methods”: “POST, OPTIONS”,
“Access-Control-Allow-Headers”: “Content-Type”,
};
}