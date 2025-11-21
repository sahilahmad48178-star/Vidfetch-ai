export interface VideoMetadata {
  id: string;
  originalUrl: string;
  thumbnailUrl: string;
  title?: string;
  duration?: string;
}

export interface AiAnalysisResult {
  summary: string;
  hashtags: string[];
  suggestedFileName: string;
  category: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
}

export interface DownloadFormat {
  quality: string;
  format: string;
  size: string;
  isAudio?: boolean;
  color?: string;
}
