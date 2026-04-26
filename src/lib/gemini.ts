import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function explainText(text: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: text,
      config: {
        systemInstruction: "You are a concise AI assistant. Explain the following text simply and clearly. Use markdown for better formatting if needed (bolding key terms). Keep it under 3 sentences unless complex.",
      },
    });
    return response.text || "I couldn't generate an explanation for that.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error: Unable to reach the AI agent. Please check your connection.";
  }
}
