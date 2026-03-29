import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.error("ERROR: Missing GOOGLE_API_KEY in .env file");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function main() {
  // Default to Pro, fallback to Flash if Pro is not available
  let model = "gemini-2.5-pro"; 
  const prompt = "Write a short motivational sentence for Arthur.";

  try {
    const res = await ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    console.log(res.text);
  } catch (err) {
    const msg = err?.response?.data ?? err?.message ?? err;
    console.error("GENAI ERROR:", msg);

    // Fallback logic if Pro is not available
    console.log("Switching to fallback model: gemini-2.5-flash");
    const res2 = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    console.log(res2.text);
  }
}

main();
