import React from 'react';
import { VideoMetadata } from '../types';
import { PlayCircle } from 'lucide-react';

interface VideoCardProps {
  metadata: VideoMetadata;
}

const VideoCard: React.FC<VideoCardProps> = ({ metadata }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden flex flex-col h-full">
      <div className="relative aspect-video bg-slate-900 group overflow-hidden">
        <img 
          src={metadata.thumbnailUrl} 
          alt="Video thumbnail" 
          className="w-full h-full object-cover opacity-90 group-hover:opacity-75 transition-opacity duration-300"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <PlayCircle className="text-white w-16 h-16 opacity-80 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" />
        </div>
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded">
          12:34
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h2 className="text-lg font-bold text-slate-800 line-clamp-2 mb-2">
          {metadata.title}
        </h2>
        <p className="text-slate-500 text-sm mb-4 truncate">
          {metadata.originalUrl}
        </p>
        <div className="mt-auto pt-4 border-t border-slate-100">
          <div className="text-xs text-slate-400 uppercase tracking-wide font-semibold">
            Video Found
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
