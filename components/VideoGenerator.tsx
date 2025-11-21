
import React, { useState } from 'react';
import { Wand2, Loader2, Play, AlertCircle, Download } from 'lucide-react';
import { generateAiVideo } from '../services/geminiService';
import { downloadMedia } from '../services/downloadService';

const VideoGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState(true); 

  const checkKeyAndGenerate = async () => {
    setError(null);
    
    if ((window as any).aistudio) {
       const hasSelectedKey = await (window as any).aistudio.hasSelectedApiKey();
       if (!hasSelectedKey) {
         setHasKey(false);
         try {
           const success = await (window as any).aistudio.openSelectKey();
           if (success) {
             setHasKey(true);
           } else {
             return; 
           }
         } catch (e) {
           console.error(e);
           return;
         }
       }
    }

    if (!prompt.trim()) {
      setError("Please enter a description for your video.");
      return;
    }

    setIsGenerating(true);
    setVideoUrl(null);

    try {
      const url = await generateAiVideo(prompt, aspectRatio);
      setVideoUrl(url);
    } catch (err: any) {
      console.error("Generation failed", err);
      if (err.message?.includes("Requested entity was not found")) {
         setHasKey(false);
         setError("Authorization failed. Please select a valid paid API key.");
      } else {
        setError("Failed to generate video. Please try a different prompt.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!videoUrl) return;
    setIsDownloading(true);

    try {
      const filename = `gemini-veo-${Date.now()}.mp4`;
      await downloadMedia(videoUrl, filename);
    } catch (error) {
      console.error("Download failed", error);
      setError("Could not download automatically. Please right-click the video and select 'Save Video As'.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-purple-100 text-purple-600 rounded-xl mb-4">
          <Wand2 size={32} />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">AI Video Generator</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Create stunning videos from text descriptions using Google's advanced <strong>Veo</strong> model.
        </p>
      </div>

      {!hasKey && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-8 text-center">
          <AlertCircle className="w-8 h-8 text-orange-500 mx-auto mb-2" />
          <h3 className="font-bold text-orange-800 mb-2">Paid API Key Required</h3>
          <p className="text-orange-700 mb-4 text-sm">
            Veo video generation requires a paid Google Cloud Project API key.
          </p>
          <button 
            onClick={checkKeyAndGenerate}
            className="bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors"
          >
            Select API Key
          </button>
          <div className="mt-4 text-xs text-orange-600">
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline">View billing documentation</a>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-100">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Video Description</label>
              <textarea 
                className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all min-h-[120px] text-lg"
                placeholder="A cinematic drone shot of a futuristic city at sunset..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1">
                <label className="block text-sm font-bold text-slate-700 mb-2">Aspect Ratio</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setAspectRatio('16:9')}
                    className={`p-3 rounded-lg border-2 font-medium transition-all ${aspectRatio === '16:9' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
                  >
                    16:9 Landscape
                  </button>
                  <button 
                    onClick={() => setAspectRatio('9:16')}
                    className={`p-3 rounded-lg border-2 font-medium transition-all ${aspectRatio === '9:16' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
                  >
                    9:16 Portrait
                  </button>
                </div>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={checkKeyAndGenerate}
                  disabled={isGenerating}
                  className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70 shadow-lg shadow-purple-200"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 size={20} /> Generate Video
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Output Area */}
        <div className="bg-slate-50 p-6 md:p-8 min-h-[300px] flex items-center justify-center">
          {isGenerating ? (
             <div className="text-center">
               <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
               <h3 className="text-lg font-bold text-slate-700">Creating your video...</h3>
               <p className="text-slate-500 text-sm mt-2">This typically takes 1-2 minutes. Please wait.</p>
             </div>
          ) : error ? (
            <div className="text-center text-red-500 bg-red-50 p-6 rounded-xl max-w-md">
              <AlertCircle className="w-10 h-10 mx-auto mb-2" />
              <p>{error}</p>
            </div>
          ) : videoUrl ? (
            <div className="w-full max-w-2xl">
              <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                <span className="bg-green-100 text-green-700 p-1 rounded"><Play size={14} fill="currentColor" /></span>
                Generated Result
              </h3>
              <div className="rounded-xl overflow-hidden shadow-2xl bg-black">
                <video 
                  src={videoUrl} 
                  controls 
                  autoPlay 
                  loop 
                  crossOrigin="anonymous"
                  className="w-full h-auto"
                />
              </div>
              <div className="mt-6 flex justify-end">
                 <button 
                   onClick={handleDownload}
                   disabled={isDownloading}
                   className="text-white bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-bold text-base flex items-center gap-2 transition-colors shadow-md disabled:opacity-70"
                 >
                   {isDownloading ? (
                     <Loader2 size={18} className="animate-spin" />
                   ) : (
                     <Download size={18} />
                   )}
                   {isDownloading ? 'Saving...' : 'Download Video'}
                 </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-400">
              <Wand2 size={48} className="mx-auto mb-3 opacity-20" />
              <p>Your generated video will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoGenerator;
