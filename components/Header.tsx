import React from 'react';
import { Download, Menu, Sparkles, Video, Wand2 } from 'lucide-react';

interface HeaderProps {
  activeTab: 'download' | 'generate';
  onTabChange: (tab: 'download' | 'generate') => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onTabChange('download')}>
          <div className="bg-brand-600 p-2 rounded-lg text-white">
            <Video size={24} strokeWidth={3} />
          </div>
          <span className="text-2xl font-bold text-slate-800 tracking-tight">
            MediaGen<span className="text-brand-600">.AI</span>
          </span>
        </div>
        
        <nav className="hidden md:flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => onTabChange('download')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'download' 
                ? 'bg-white text-brand-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Download size={16} /> Video Downloader
          </button>
          <button
            onClick={() => onTabChange('generate')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'generate' 
                ? 'bg-white text-purple-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Wand2 size={16} /> AI Video Generator
          </button>
        </nav>

        <div className="flex items-center gap-4">
           <a href="#" className="hidden md:flex hover:text-brand-600 transition-colors text-slate-600 text-sm font-medium">
             Supported Sites
           </a>
           <button className="md:hidden text-slate-600">
             <Menu size={28} />
           </button>
        </div>
      </div>
    </header>
  );
};

export default Header;