
import React, { useState } from 'react';
import { DownloadFormat } from '../types';
import { Download, Video, Music, VolumeX, Copy, Check, Link, Loader2 } from 'lucide-react';
import { downloadMedia } from '../services/downloadService';

interface DownloadTableProps {
  videoUrl?: string;
  videoTitle?: string;
}

const MOCK_FORMATS: DownloadFormat[] = [
  { quality: '1080p', format: 'MP4', size: '145 MB', isAudio: false, color: 'bg-brand-500' },
  { quality: '720p', format: 'MP4', size: '85 MB', isAudio: false, color: 'bg-brand-500' },
  { quality: '360p', format: 'MP4', size: '24 MB', isAudio: false, color: 'bg-slate-500' },
  { quality: 'Audio', format: 'MP3', size: '4.2 MB', isAudio: true, color: 'bg-blue-500' },
  { quality: 'Muted', format: 'WEBM', size: '112 MB', isAudio: false, color: 'bg-orange-500' },
];

const DownloadTable: React.FC<DownloadTableProps> = ({ videoUrl, videoTitle = 'video' }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null);

  const handleCopy = (index: number, quality: string, format: string) => {
    const mockUrl = `https://dl.mediagen.ai/get?id=${Date.now()}&q=${quality}&f=${format}`;
    navigator.clipboard.writeText(mockUrl).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  const handleDownload = async (index: number, item: DownloadFormat) => {
    setDownloadingIndex(index);
    
    try {
      // Sanitize filename
      const safeTitle = videoTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 30);
      const filename = `${safeTitle}_${item.quality}.${item.format.toLowerCase()}`;
      
      // Call the backend service to handle the download
      // This ensures the file is fetched, processed, and saved automatically
      await downloadMedia(videoUrl, filename, item.isAudio ? 'audio/mpeg' : 'video/mp4');

    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed. Please try again.");
    } finally {
      setDownloadingIndex(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <Link size={16} className="text-brand-600"/>
           <h3 className="font-bold text-slate-700">Download Options</h3>
        </div>
        <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded">Ready to download</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
            <tr>
              <th className="px-6 py-3">Quality</th>
              <th className="px-6 py-3">Format</th>
              <th className="px-6 py-3">Size</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_FORMATS.map((item, index) => (
              <tr key={index} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4 font-medium text-slate-800 flex items-center gap-2">
                  {item.isAudio ? <Music size={18} className="text-blue-500" /> : 
                   item.quality === 'Muted' ? <VolumeX size={18} className="text-orange-500" /> :
                   <Video size={18} className="text-green-500" />}
                  {item.quality}
                  {index === 0 && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded ml-2 font-bold">HD</span>}
                </td>
                <td className="px-6 py-4 text-slate-600">{item.format}</td>
                <td className="px-6 py-4 text-slate-600">{item.size}</td>
                <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                  {/* Copy Link Button */}
                  <button
                    onClick={() => handleCopy(index, item.quality, item.format)}
                    className={`p-2 rounded-lg transition-all flex items-center gap-1 border ${
                      copiedIndex === index 
                      ? 'bg-green-50 border-green-200 text-green-600' 
                      : 'bg-white border-slate-200 text-slate-400 hover:text-brand-500 hover:border-brand-200'
                    }`}
                    title="Copy Direct Link"
                  >
                    {copiedIndex === index ? (
                      <Check size={18} />
                    ) : (
                      <Copy size={18} />
                    )}
                  </button>

                  {/* Download Button */}
                  <button 
                    onClick={() => handleDownload(index, item)}
                    disabled={downloadingIndex !== null}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 text-white text-sm font-semibold rounded-lg transition-transform active:scale-95 hover:shadow-md ${item.color} hover:brightness-110 disabled:opacity-70 disabled:cursor-wait`}
                  >
                    {downloadingIndex === index ? (
                      <>
                         <Loader2 size={16} className="animate-spin" />
                         <span className="hidden sm:inline">Saving...</span>
                      </>
                    ) : (
                      <>
                        <Download size={16} /> 
                        <span className="hidden sm:inline">Download</span>
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DownloadTable;
