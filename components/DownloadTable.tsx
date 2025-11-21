import React, { useState } from 'react';
import { DownloadFormat } from '../types';
import { Download, Video, Music, VolumeX, Copy, Check } from 'lucide-react';

const MOCK_FORMATS: DownloadFormat[] = [
  { quality: '1080p', format: 'MP4', size: '145 MB', isAudio: false, color: 'bg-brand-500' },
  { quality: '720p', format: 'MP4', size: '85 MB', isAudio: false, color: 'bg-brand-500' },
  { quality: '360p', format: 'MP4', size: '24 MB', isAudio: false, color: 'bg-slate-500' },
  { quality: 'Audio', format: 'MP3', size: '4.2 MB', isAudio: true, color: 'bg-blue-500' },
  { quality: 'Muted', format: 'WEBM', size: '112 MB', isAudio: false, color: 'bg-orange-500' },
];

const DownloadTable: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (index: number, quality: string, format: string) => {
    // Mocking a direct download link
    const mockUrl = `https://dl.mediagen.ai/get?id=12345&q=${quality}&f=${format}`;
    navigator.clipboard.writeText(mockUrl).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
        <h3 className="font-bold text-slate-700">Download Links</h3>
        <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded">Ready</span>
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
                  <button
                    onClick={() => handleCopy(index, item.quality, item.format)}
                    className="p-2 text-slate-400 hover:text-brand-500 hover:bg-brand-50 rounded-lg transition-colors"
                    title="Copy Link"
                  >
                    {copiedIndex === index ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                  </button>
                  <button 
                    className={`inline-flex items-center gap-1.5 px-4 py-2 text-white text-sm font-semibold rounded-lg transition-transform active:scale-95 hover:shadow-md ${item.color} hover:brightness-110`}
                  >
                    <Download size={16} /> Download
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