
import React, { useState, useRef, useEffect } from 'react';
import { STYLE_PACKS } from '../constants';
import { StylePack } from '../types';

interface ControlsPanelProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  selectedStyle: StylePack;
  setSelectedStyle: (style: StylePack) => void;
  enhanceResolution: boolean;
  setEnhanceResolution: (value: boolean) => void;
  resolution: '1:1' | '9:16' | '16:9';
  setResolution: (value: '1:1' | '9:16' | '16:9') => void;
  handleGenerate: () => void;
  loading: boolean;
  error: string | null;
}

const SquareIcon = () => <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>;
const TikTokIcon = () => <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="2" width="12" height="20" rx="2" ry="2"></rect></svg>;
const YouTubeIcon = () => <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2" ry="2"></rect></svg>;


export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  prompt,
  setPrompt,
  selectedStyle,
  setSelectedStyle,
  enhanceResolution,
  setEnhanceResolution,
  resolution,
  setResolution,
  handleGenerate,
  loading,
  error,
}) => {
  const resolutionOptions = [
    { id: '1:1', name: 'Square', resolutionText: '1080x1080', icon: <SquareIcon /> },
    { id: '9:16', name: 'TikTok', resolutionText: '1080x1920', icon: <TikTokIcon /> },
    { id: '16:9', name: 'YouTube', resolutionText: '1920x1080', icon: <YouTubeIcon /> },
  ] as const;
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);
  
  const currentIcon = resolutionOptions.find(opt => opt.id === resolution)?.icon;

  return (
    <div className="glass-pane p-6 flex flex-col h-full">
      <div className="flex-grow overflow-y-auto pr-2 -mr-2">
        <h2 className="text-xl font-bold mb-4 text-gray-100">1. Style</h2>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {STYLE_PACKS.map(pack => (
            <button
              key={pack.id}
              onClick={() => setSelectedStyle(pack)}
              className={`glow-on-hover p-4 rounded-xl border-2 transition-all duration-300 text-left focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-violet-500/50
                          ${selectedStyle.id === pack.id ? 'border-violet-500 bg-violet-900/50 active' : 'border-gray-700 bg-gray-800/80 hover:border-violet-600'}`}
            >
              <p className="font-bold text-sm text-white">{pack.name}</p>
              <p className="text-xs text-gray-400 mt-1">{pack.description}</p>
            </button>
          ))}
        </div>

        <h2 className="text-xl font-bold mb-4 text-gray-100">2. Prompt</h2>
        <div className="relative">
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A majestic lion wearing a crown, sitting on a throne..."
            className="w-full h-40 p-4 pr-12 bg-gray-900/70 border-2 border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors text-base resize-none"
            rows={5}
          />
           <div ref={dropdownRef} className="absolute top-2 right-2 z-10">
              <button
                  onClick={() => setIsDropdownOpen(prev => !prev)}
                  className="h-7 w-7 flex items-center justify-center bg-gray-900/80 hover:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-md border border-gray-700 text-gray-300 transition-colors"
                  aria-haspopup="true"
                  aria-expanded={isDropdownOpen}
                  title={`Current aspect ratio: ${resolution}`}
                  aria-label="Select aspect ratio"
              >
                  {currentIcon}
              </button>
              {isDropdownOpen && (
                  <div 
                    className="absolute top-full right-0 mt-2 w-52 glass-pane !bg-gray-800/95 p-2 rounded-lg shadow-lg animate-slide-in-up origin-top-right"
                    style={{ animationDuration: '200ms' }}
                  >
                      <p className="text-xs text-gray-400 font-semibold px-2 pb-1">Aspect Ratio</p>
                      {resolutionOptions.map(opt => (
                          <button
                              key={opt.id}
                              onClick={() => {
                                  setResolution(opt.id);
                                  setIsDropdownOpen(false);
                              }}
                              className={`w-full flex items-center space-x-3 text-left p-2 rounded-md transition-colors text-sm ${
                                  resolution === opt.id ? 'bg-violet-600 text-white' : 'text-gray-200 hover:bg-violet-900/50'
                              }`}
                          >
                              {opt.icon}
                              <div>
                                <span className="font-semibold">{opt.name}</span>
                                <span className="block text-xs opacity-70">{opt.resolutionText}</span>
                              </div>
                          </button>
                      ))}
                  </div>
              )}
          </div>
        </div>

      </div>

      <div className="mt-6 pt-6 border-t border-gray-700/50 sticky bottom-0 bg-gray-900/10 backdrop-blur-sm -mx-6 px-6 -mb-6 pb-6">
        <h2 className="text-xl font-bold mb-4 text-gray-100">3. Options</h2>
        <div className="flex items-center justify-between glass-pane p-4 !rounded-lg">
          <div className="flex items-center space-x-4">
            <svg xmlns="http://www.w.org/2000/svg" className="h-7 w-7 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
            <div>
              <p className="font-semibold">High-Resolution Mode</p>
              <p className="text-xs text-gray-400">AI upscale to 4K for maximum detail and clarity.</p>
            </div>
          </div>
          <button onClick={() => setEnhanceResolution(!enhanceResolution)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-violet-500 ${enhanceResolution ? 'bg-violet-600' : 'bg-gray-700'}`}>
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enhanceResolution ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      
        <div className="mt-6">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold py-4 px-4 rounded-xl text-lg
                      hover:from-violet-500 hover:to-indigo-500 transition-all duration-300 transform hover:scale-105 
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                      focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-violet-500/50
                      flex items-center justify-center space-x-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>
            <span>{loading ? 'Generating...' : 'Generate'}</span>
          </button>
          {error && <p className="text-red-400 text-center bg-red-900/50 p-3 rounded-md text-sm mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
};
