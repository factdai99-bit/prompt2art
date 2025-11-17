
import React from 'react';
import { GenerationResult } from '../types';

interface ResultDisplayProps {
  result: GenerationResult;
  onRegenerate: () => void;
  onEditPrompt: () => void;
  onExtend: () => void;
  isLoading: boolean;
}

const ExtendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 20 20" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 8V4m0 0h4M4 4l5 5m-5 8v-4m0 0h4m-4 0l5-5m10-5h-4m0 0v4m0-4l-5 5m5 8h-4m0 0v-4m0 4l-5-5" /></svg>;


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onRegenerate, onEditPrompt, onExtend, isLoading }) => {
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = result.imageUrl;
    link.download = `${result.originalPrompt.substring(0, 20).replace(/\s/g, '_')}_${result.isEnhanced ? '4K' : 'base'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="glass-pane p-6 rounded-2xl w-full max-w-4xl animate-slide-in-up flex flex-col items-center gap-6">
        <div className="w-full bg-gray-900 rounded-lg overflow-hidden relative group border border-gray-700 flex justify-center items-center">
            <img src={result.imageUrl} alt={result.originalPrompt} className="w-auto h-auto max-w-full max-h-[70vh] object-contain" />
            {result.isEnhanced && (
            <div className="absolute top-3 right-3 bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                4K Enhanced
            </div>
            )}
        </div>
        
        <div className="flex flex-col space-y-4 w-full">
             <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">✨ AI Boosted Prompt</h3>
              <p className="glass-pane !bg-gray-900/80 p-3 rounded-md text-gray-300 text-sm h-24 overflow-y-auto">{result.boostedPrompt}</p>
            </div>
             <div className="pt-2 grid grid-cols-3 gap-4">
                 <button 
                    onClick={handleDownload} 
                    className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-500 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
                 >
                    <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                    <span>Download</span>
                </button>
                 <button 
                    onClick={onExtend} 
                    disabled={isLoading}
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-500"
                    aria-label="Extend Image"
                 >
                    <ExtendIcon />
                    <span>Extend</span>
                </button>
                <button 
                  onClick={onRegenerate} 
                  disabled={isLoading}
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" /></svg>
                    <span>Regenerate</span>
                </button>
            </div>
            <button 
                onClick={onEditPrompt}
                className="w-full bg-transparent border border-gray-600 text-gray-300 px-4 py-2 rounded-lg font-semibold hover:bg-gray-700/50 hover:text-white transition-colors flex items-center justify-center space-x-2 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                <span>Use this Prompt</span>
            </button>
        </div>
    </div>
  );
};
