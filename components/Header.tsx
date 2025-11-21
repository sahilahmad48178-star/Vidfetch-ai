import React from 'react';
import { Download, Menu, Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-brand-500 p-2 rounded-lg text-white">
            <Download size={24} strokeWidth={3} />
          </div>
          <span className="text-2xl font-bold text-slate-800 tracking-tight">
            SaveFrom<span className="text-brand-500">.AI</span>
          </span>
        </div>
        
        <nav className="hidden md:flex space-x-8 text-slate-600 font-medium">
          <a href="#" className="hover:text-brand-500 transition-colors">How to Download</a>
          <a href="#" className="hover:text-brand-500 transition-colors flex items-center gap-1">
            <Sparkles size={16} className="text-purple-500" /> AI Features
          </a>
          <a href="#" className="hover:text-brand-500 transition-colors">Supported Sites</a>
        </nav>

        <button className="md:hidden text-slate-600">
          <Menu size={28} />
        </button>
      </div>
    </header>
  );
};

export default Header;
