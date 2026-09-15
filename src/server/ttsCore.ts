import { GoogleGenAI, Modality } from "@google/genai";

// Convert raw 16-bit PCM buffer to a valid RIFF WAV
export function pcmToWav(
  pcmBuffer: Buffer,
  sampleRate = 24000,
  numChannels = 1,
  bitsPerSample = 16
): Buffer {
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = pcmBuffer.length;
  const header = Buffer.alloc(44);

  header.write("RIFF", 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write("data", 36);
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, pcmBuffer]);
}

let aiClient: GoogleGenAI | null = null;
export function getAi(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing. In Vercel, please set GEMINI_API_KEY in Project Settings -> Environment Variables.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

export interface TTSRequestPayload {
  text: string;
  voice?: string;
  stylePrompt?: string;
  language?: string;
}

export async function generateSpeechTTS({
  text,
  voice = "Puck",
  stylePrompt,
  language,
}: TTSRequestPayload) {
  if (!text || typeof text !== "string" || !text.trim()) {
    throw new Error("Please provide valid text to convert to speech.");
  }

  const ai = getAi();

  let fullPrompt = text.trim();
  if (stylePrompt && typeof stylePrompt === "string" && stylePrompt.trim()) {
    fullPrompt = `${stylePrompt.trim()}:\n${fullPrompt}`;
  }

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-tts-preview",
    contents: [{ parts: [{ text: fullPrompt }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: {
            voiceName: voice || "Puck",
          },
        },
      },
    },
  });

  const audioPart = response.candidates?.[0]?.content?.parts?.find(
    (p) => p.inlineData?.data
  );

  if (!audioPart || !audioPart.inlineData?.data) {
    throw new Error("No audio stream returned from Gemini TTS model.");
  }

  const rawBase64 = audioPart.inlineData.data;
  const incomingMimeType = audioPart.inlineData.mimeType || "audio/pcm;rate=24000";

  let finalAudioBase64 = rawBase64;
  let finalMimeType = "audio/wav";

  const rawBuffer = Buffer.from(rawBase64, "base64");
  const isAlreadyWav = rawBuffer.length >= 4 && rawBuffer.toString("ascii", 0, 4) === "RIFF";

  if (isAlreadyWav) {
    finalAudioBase64 = rawBase64;
    finalMimeType = incomingMimeType.includes("wav") ? incomingMimeType : "audio/wav";
  } else {
    const wavBuffer = pcmToWav(rawBuffer, 24000, 1, 16);
    finalAudioBase64 = wavBuffer.toString("base64");
    finalMimeType = "audio/wav";
  }

  const durationSeconds = +(rawBuffer.length / 48000).toFixed(2);

  return {
    audioUrl: `data:${finalMimeType};base64,${finalAudioBase64}`,
    audioBase64: finalAudioBase64,
    mimeType: finalMimeType,
    durationSeconds,
    voice,
  };
}
