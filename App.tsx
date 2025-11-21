import React, { useState, useRef } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import VideoCard from './components/VideoCard';
import DownloadTable from './components/DownloadTable';
import AiFeatures from './components/AiFeatures';
import { getVideoMetadata } from './utils/videoUtils';
import { analyzeVideoContent } from './services/geminiService';
import { VideoMetadata, AiAnalysisResult } from './types';

const App: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [videoData, setVideoData] = useState<VideoMetadata | null>(null);
  const [aiData, setAiData] = useState<AiAnalysisResult | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = async (url: string) => {
    setIsProcessing(true);
    setVideoData(null);
    setAiData(null);

    // 1. Simulate "Searching" for the video (Mock)
    // In a real app, a backend would validate the URL and get metadata.
    setTimeout(async () => {
      const metadata = getVideoMetadata(url);
      
      if (metadata) {
        setVideoData(metadata);
        setIsProcessing(false);
        
        // Scroll to results
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);

        // 2. Trigger AI Analysis (Real)
        setIsAiLoading(true);
        try {
          // Wait a moment to simulate the "Smart" thinking separation
          await new Promise(r => setTimeout(r, 800));
          const analysis = await analyzeVideoContent(url);
          setAiData(analysis);
        } catch (e) {
          console.error(e);
        } finally {
          setIsAiLoading(false);
        }
      } else {
        setIsProcessing(false);
        alert("Could not find video. Please check the URL.");
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-grow">
        <InputSection onAnalyze={handleAnalyze} isProcessing={isProcessing} />

        {/* Results Section */}
        <div ref={resultsRef} className={`transition-all duration-500 ${videoData ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none hidden'}`}>
          {videoData && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Video Info & AI */}
                <div className="lg:col-span-2 space-y-8">
                   {/* 1. AI Features (Highlight) */}
                   <AiFeatures data={aiData} loading={isAiLoading} />
                   
                   {/* 2. Download Table */}
                   <DownloadTable />
                </div>

                {/* Right Column: Thumbnail/Card */}
                <div className="lg:col-span-1">
                  <div className="sticky top-24">
                    <VideoCard metadata={videoData} />
                    
                    <div className="mt-6 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                      <h4 className="font-bold text-slate-800 mb-2">Why use SaveFrom.AI?</h4>
                      <ul className="text-sm text-slate-600 space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 font-bold">✓</span> 
                          AI generates better filenames for SEO
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 font-bold">✓</span> 
                          Instant video summaries
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 font-bold">✓</span> 
                          Suggests viral hashtags
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* Placeholder/SEO Content (visible when no result) */}
        {!videoData && (
          <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-12">
            <h2 className="text-3xl font-bold text-slate-800">Supported Platforms</h2>
            <div className="flex flex-wrap justify-center gap-8 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              {['YouTube', 'Facebook', 'Instagram', 'TikTok', 'Vimeo', 'Twitter'].map(site => (
                <span key={site} className="text-xl font-bold text-slate-400 hover:text-brand-500 cursor-default">
                  {site}
                </span>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-16 text-left">
              <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center text-brand-600 mb-4 font-bold text-xl">1</div>
                <h3 className="font-bold text-slate-800 mb-2">Paste URL</h3>
                <p className="text-slate-600 text-sm">Copy the video URL from any major social platform and paste it into the input box above.</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-4 font-bold text-xl">2</div>
                <h3 className="font-bold text-slate-800 mb-2">AI Analysis</h3>
                <p className="text-slate-600 text-sm">Our Gemini-powered engine analyzes the content to provide summaries, tags, and format suggestions.</p>
              </div>
              <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4 font-bold text-xl">3</div>
                <h3 className="font-bold text-slate-800 mb-2">Download</h3>
                <p className="text-slate-600 text-sm">Choose your preferred quality (1080p, 4K, MP3) and save the file to your device instantly.</p>
              </div>
            </div>
          </div>
        )}

      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4 text-white font-bold text-xl">
             SaveFrom.AI
          </div>
          <p className="mb-8 max-w-md mx-auto text-sm">
            The world's first AI-enhanced media downloader. We respect copyright laws. 
            Please do not download copyrighted material without permission.
          </p>
          <div className="text-xs text-slate-600">
            &copy; 2024 SaveFrom.AI Clone Demo. Built with React & Gemini.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
