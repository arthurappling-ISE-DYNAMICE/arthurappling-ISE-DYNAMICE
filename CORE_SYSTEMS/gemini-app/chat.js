import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import { execSync } from "node:child_process";

const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("ERROR: Missing GOOGLE_API_KEY.");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

// --- TTS Function ---
function chunkText(t, size = 350) {
  const out = [];
  let i = 0;
  while (i < t.length) {
    out.push(t.slice(i, i + size));
    i += size;
  }
  return out;
}

async function speak(text, voice = "Microsoft Zira Desktop") {
  const chunks = chunkText(String(text).trim());
  for (const chunk of chunks) {
    const psCmd = [
      "Add-Type -AssemblyName System.Speech;",
      "$s = New-Object System.Speech.Synthesis.SpeechSynthesizer;",
      `try { $s.SelectVoice('${voice}') } catch { }`,
      "$text = [Console]::In.ReadToEnd();",
      "$s.Speak($text);"
    ].join(" ");

    execSync(`powershell -NoProfile -Command "${psCmd}"`, {
      input: chunk,
      stdio: ["pipe", "ignore", "ignore"],
    });
  }
}

// --- Gemini Request ---
async function main() {
  let model = "gemini-2.5-pro"; // fallback available
  const prompt = "Reply with: GEMINI_OK and then say one short motivational line for Arthur.";

  try {
    const res = await ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = res.text;
    console.log("MODEL TEXT:\n", text);

    await speak(text); // 🔊 speak out loud

  } catch (err) {
    const msg = err?.response?.data ?? err?.message ?? err;
    console.error("GENAI ERROR:", msg);

    const lower = String(msg).toLowerCase();
    if (lower.includes("not found") || lower.includes("retire") || lower.includes("permission")) {
      console.log("Switching to fallback model: gemini-2.5-flash");
      const res2 = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });
      const text2 = res2.text;
      console.log("MODEL TEXT (FALLBACK):\n", text2);
      await speak(text2);
    } else {
      process.exit(1);
    }
  }
}

main();
