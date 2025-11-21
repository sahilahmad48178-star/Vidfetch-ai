import React, { useState } from 'react';
import { ArrowRight, Link2, Loader2, Globe } from 'lucide-react';

interface InputSectionProps {
  onAnalyze: (url: string) => void;
  isProcessing: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isProcessing }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url);
    }
  };

  return (
    <div className="bg-gradient-to-b from-brand-50 to-white py-16 sm:py-24 px-4 text-center border-b border-slate-100">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-sm font-medium mb-6">
        <Globe size={14} /> 
        Supports All Platforms: YouTube, TikTok, Instagram, FB
      </div>
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
        Universal Video Downloader <br/>
        <span className="text-brand-600 text-3xl sm:text-4xl md:text-5xl block mt-2 font-bold">
          Paste Link. Click Download.
        </span>
      </h1>
      <p className="text-slate-600 max-w-2xl mx-auto text-lg mb-10">
        Free video downloader for <strong>YouTube, TikTok, Instagram, Facebook, Twitter (X)</strong> and many more. 
        High quality MP4 and MP3 supported.
      </p>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-500 transition-colors">
          <Link2 size={24} />
        </div>
        <input
          type="url"
          placeholder="Paste your video link here (e.g. youtube.com/watch?v=...)"
          className="w-full pl-12 pr-36 py-5 rounded-xl border-2 border-slate-200 shadow-lg text-lg focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100 transition-all"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={isProcessing}
          className="absolute right-2 top-2 bottom-2 bg-brand-500 hover:bg-brand-600 text-white font-bold px-6 rounded-lg flex items-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
        >
          {isProcessing ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Processing
            </>
          ) : (
            <>
              Download <ArrowRight size={20} />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 flex justify-center gap-6 text-sm text-slate-400 font-medium flex-wrap">
        <span className="flex items-center gap-1 hover:text-brand-500 transition-colors">✓ TikTok No Watermark</span>
        <span className="flex items-center gap-1 hover:text-brand-500 transition-colors">✓ Instagram Reels</span>
        <span className="flex items-center gap-1 hover:text-brand-500 transition-colors">✓ YouTube 4K/Shorts</span>
        <span className="flex items-center gap-1 hover:text-brand-500 transition-colors">✓ Facebook HD</span>
      </div>
    </div>
  );
};

export default InputSection;
