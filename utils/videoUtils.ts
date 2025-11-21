import { VideoMetadata } from '../types';

export const extractVideoId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export const getVideoMetadata = (url: string): VideoMetadata | null => {
  const id = extractVideoId(url);
  if (id) {
    return {
      id,
      originalUrl: url,
      thumbnailUrl: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
      title: "Video Title Placeholder", // In a real app, we'd fetch this
    };
  }
  // Fallback for non-YT urls (mock)
  if (url.length > 5) {
    return {
      id: 'generic',
      originalUrl: url,
      thumbnailUrl: 'https://picsum.photos/800/450',
      title: "Generic Video Link",
    };
  }
  return null;
};

export const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};
