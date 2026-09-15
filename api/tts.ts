import { generateSpeechTTS } from "../src/server/ttsCore.js";

export default async function handler(req: any, res: any) {
  // Enable CORS for personal cross-origin requests if deployed as API
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { text, voice, stylePrompt, language } = req.body || {};
    const result = await generateSpeechTTS({ text, voice, stylePrompt, language });
    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Vercel Serverless TTS Error:", error);
    return res.status(500).json({
      error: error?.message || "Internal server error during speech generation",
    });
  }
}
