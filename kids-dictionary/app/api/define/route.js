import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function POST(request) {
  const { word } = await request.json();

  if (!word || typeof word !== "string" || word.trim().length === 0) {
    return Response.json({ error: "Please provide a word." }, { status: 400 });
  }

  const cleanWord = word.trim().toLowerCase();

  if (cleanWord.length > 50) {
    return Response.json({ error: "Word is too long." }, { status: 400 });
  }

  const prompt = `You are a friendly dictionary for children aged 8–12. The child has looked up the word: "${cleanWord}".

Your job is to respond with a JSON object in exactly this format:
{
  "word": "the word exactly as given",
  "partOfSpeech": "noun | verb | adjective | adverb | etc.",
  "definition": "A clear, simple definition using easy words that an 8–12 year old can understand. Keep it to 1–2 sentences.",
  "examples": [
    "A fun, relatable example sentence using the word in context.",
    "A second fun, relatable example sentence using the word in context."
  ],
  "funFact": "One short, interesting or surprising fact related to the word — optional but encouraged."
}

Rules:
- Use simple, friendly language a child will understand.
- Avoid jargon or complex vocabulary.
- Make the examples feel fun and relevant to a child's life (school, friends, hobbies, animals, food, etc.).
- If the word doesn't exist or is nonsensical, set "definition" to "Hmm, we couldn't find that word! Try checking the spelling." and leave examples and funFact as empty strings.
- Never include inappropriate content.
- Respond with ONLY the JSON object, no extra text.`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    const jsonStr = text.replace(/^```json\n?/, "").replace(/\n?```$/, "");
    const data = JSON.parse(jsonStr);

    return Response.json(data);
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "Something went wrong. Please try again!" },
      { status: 500 }
    );
  }
}
