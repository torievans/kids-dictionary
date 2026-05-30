export async function POST(request) {
  const { word } = await request.json();
  const cleanWord = word?.trim().toLowerCase();

  const prompt = `You are a friendly dictionary for children aged 8-12. The child has looked up the word: "${cleanWord}". Respond with a JSON object: { "word": "...", "partOfSpeech": "...", "definition": "...", "examples": ["...", "..."], "funFact": "..." }. Use simple language. Respond with ONLY the JSON object.`;

  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) return Response.json({ error: "No API key configured" }, { status: 500 });

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      return Response.json({ error: "Gemini API error: " + res.status + " " + errText.slice(0, 200) }, { status: 500 });
    }

    const json = await res.json();
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!text) return Response.json({ error: "Empty response from Gemini" }, { status: 500 });

    const jsonStr = text.replace(/^```json\n?/, "").replace(/\n?```$/, "");
    const data = JSON.parse(jsonStr);
    return Response.json(data);
  } catch (err) {
    return Response.json({ error: "Exception: " + err.message }, { status: 500 });
  }
}
