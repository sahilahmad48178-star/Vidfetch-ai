import { GoogleGenAI } from "@google/genai";
import { AiAnalysisResult } from "../types";

const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey });

export const analyzeVideoContent = async (url: string): Promise<AiAnalysisResult> => {
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  try {
    // Note: When using tools like googleSearch, we cannot use responseMimeType: "application/json"
    // So we ask the model to output JSON text and parse it manually.
    const prompt = `
      I have a video URL: ${url}.
      Please use Google Search to find information about this specific video (title, content, context).
      
      After searching, generate a valid JSON object (without markdown formatting) with the following fields:
      {
        "summary": "A concise 2-sentence summary of the video content.",
        "hashtags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
        "suggestedFileName": "clean-filename-slug.mp4",
        "category": "The video category (e.g. Music, Sports, Comedy)",
        "sentiment": "Positive, Neutral, or Negative"
      }
      
      Return ONLY the JSON string. Do not include any markdown formatting like \`\`\`json.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // responseMimeType and responseSchema are NOT supported when using tools
      },
    });

    let text = response.text || "{}";
    
    // Cleanup markdown code blocks if present
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // Extract JSON if there's extra text around it
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      text = text.substring(firstBrace, lastBrace + 1);
    }
    
    return JSON.parse(text) as AiAnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    // Fallback mock data if AI fails or key is invalid
    return {
      summary: "Could not analyze specific video details via AI. Basic media info loaded.",
      hashtags: ["#video", "#viral", "#social", "#trending", "#download"],
      suggestedFileName: "video_download.mp4",
      category: "General",
      sentiment: "Neutral"
    };
  }
};

export const generateAiVideo = async (prompt: string, aspectRatio: '16:9' | '9:16' = '16:9'): Promise<string> => {
  // IMPORTANT: Re-initialize AI with the selected key from environment or dialog context
  const currentKey = process.env.API_KEY;
  const freshAi = new GoogleGenAI({ apiKey: currentKey });

  let operation = await freshAi.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: '1080p', // 1080p is supported for this model
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
