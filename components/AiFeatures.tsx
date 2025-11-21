import React from 'react';
import { AiAnalysisResult } from '../types';
import { Sparkles, Hash, FileText, Tag, Smile } from 'lucide-react';

interface AiFeaturesProps {
  data: AiAnalysisResult | null;
  loading: boolean;
}

const AiFeatures: React.FC<AiFeaturesProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="w-full bg-white rounded-2xl border border-purple-100 shadow-sm p-6 animate-pulse">
        <div className="h-6 bg-purple-100 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-slate-100 rounded w-full"></div>
          <div className="h-4 bg-slate-100 rounded w-5/6"></div>
          <div className="h-4 bg-slate-100 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="w-full bg-gradient-to-br from-purple-50 to-white rounded-2xl border border-purple-100 shadow-lg overflow-hidden relative">
       <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
         <Sparkles size={12} /> Gemini AI Analysis
       </div>

      <div className="p-6 sm:p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="bg-purple-100 p-2 rounded-lg text-purple-600">
            <FileText size={20} />
          </span>
          Content Insights
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Summary Section */}
          <div>
            <h4 className="text-sm font-semibold text-purple-900 uppercase tracking-wider mb-3">Video Summary</h4>
            <p className="text-slate-700 leading-relaxed bg-white/60 p-4 rounded-xl border border-purple-50">
              {data.summary}
            </p>
          </div>

          <div className="space-y-6">
            {/* Suggested Filename */}
            <div>
               <h4 className="text-sm font-semibold text-purple-900 uppercase tracking-wider mb-2">Smart Filename</h4>
               <div className="flex items-center gap-3 bg-slate-800 text-white p-3 rounded-lg font-mono text-sm break-all">
                 <FileText size={16} className="shrink-0 text-purple-400" />
                 {data.suggestedFileName}
               </div>
            </div>

            {/* Metadata Chips */}
            <div className="flex flex-wrap gap-2">
               <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                 <Tag size={14} /> {data.category}
               </span>
               <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                 <Smile size={14} /> Sentiment: {data.sentiment}
               </span>
            </div>
          </div>
        </div>

        {/* Hashtags */}
        <div className="mt-8 pt-6 border-t border-purple-100">
           <h4 className="text-sm font-semibold text-purple-900 uppercase tracking-wider mb-4 flex items-center gap-2">
             <Hash size={16} /> Viral Hashtags
           </h4>
           <div className="flex flex-wrap gap-2">
             {data.hashtags.map((tag, idx) => (
               <span key={idx} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm hover:border-purple-300 hover:text-purple-600 transition-colors cursor-pointer">
                 {tag.startsWith('#') ? tag : `#${tag}`}
               </span>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AiFeatures;
