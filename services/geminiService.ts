import { GoogleGenAI, Type } from "@google/genai";
import { AiAnalysisResult } from "../types";

const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey });

export const analyzeVideoContent = async (url: string): Promise<AiAnalysisResult> => {
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  try {
    const prompt = `
      I have a video URL: ${url}.
      Please use Google Search to find information about this specific video (title, content, context).
      
      Based on what you find, generate a JSON response with the following fields:
      1. "summary": A concise 2-sentence summary of what the video is likely about.
      2. "hashtags": An array of 5 relevant hashtags for social media sharing.
      3. "suggestedFileName": A clean, SEO-friendly filename for the video (e.g., "funny-cat-jump.mp4").
      4. "category": The general category of the video (e.g., Music, Education, Entertainment).
      5. "sentiment": The overall sentiment of the content (Positive, Neutral, or Negative).

      If you cannot find specific info, infer strictly based on the structure or common patterns, but try to search first.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedFileName: { type: Type.STRING },
            category: { type: Type.STRING },
            sentiment: { type: Type.STRING, enum: ["Positive", "Neutral", "Negative"] },
          },
          required: ["summary", "hashtags", "suggestedFileName", "category", "sentiment"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AiAnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    // Fallback mock data if AI fails or key is invalid
    return {
      summary: "Could not analyze specific video details. This appears to be a media link.",
      hashtags: ["#video", "#download", "#mediagen", "#media", "#viral"],
      suggestedFileName: "video_download.mp4",
      category: "General",
      sentiment: "Neutral"
    };
  }
};

export const generateAiVideo = async (prompt: string, aspectRatio: '16:9' | '9:16' = '16:9'): Promise<string> => {
  // IMPORTANT: Re-initialize AI with the selected key from environment or dialog context
  // This handles the race condition mentioned in docs by creating a fresh instance
  const currentKey = process.env.API_KEY;
  const freshAi = new GoogleGenAI({ apiKey: currentKey });

  let operation = await freshAi.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: '1080p',
      aspectRatio: aspectRatio
    }
  });

  // Poll for completion
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Check every 5 seconds
    operation = await freshAi.operations.getVideosOperation({operation: operation});
  }

  const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!videoUri) throw new Error("Video generation failed");

  // Append key for playback
  return `${videoUri}&key=${currentKey}`;
};