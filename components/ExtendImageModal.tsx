
import React, { useState } from 'react';
import { GenerationResult } from '../types';
import { extendImage } from '../services/geminiService';
import { Loader } from './Loader';

interface ExtendImageModalProps {
  originalResult: GenerationResult;
  onClose: () => void;
  onApply: (newImageUrl: string) => void;
}

type Direction = 'top' | 'bottom' | 'left' | 'right';

const DirectionButton: React.FC<{
  direction: Direction;
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  positionClass: string;
}> = ({ direction, selected, onClick, children, positionClass }) => (
  <button
    onClick={onClick}
    className={`absolute ${positionClass} transform -translate-x-1/2 -translate-y-1/2 z-20
                flex items-center justify-center w-12 h-12 rounded-full
                transition-all duration-300 backdrop-blur-md
                ${selected 
                  ? 'bg-violet-600/80 text-white ring-2 ring-white' 
                  : 'bg-gray-900/60 text-gray-300 hover:bg-violet-600/80 hover:text-white'}`}
    aria-label={`Extend ${direction}`}
  >
    {children}
  </button>
);

export const ExtendImageModal: React.FC<ExtendImageModalProps> = ({ originalResult, onClose, onApply }) => {
  const [direction, setDirection] = useState<Direction | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extendedImage, setExtendedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!direction) {
      setError('Please select a direction to extend the image.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const newImage = await extendImage(originalResult.imageUrl, prompt, direction);
      setExtendedImage(newImage);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (extendedImage) {
      onApply(extendedImage);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div onClick={onClose} className="absolute inset-0 bg-black/70 animate-fade-in"></div>
      <div className="relative glass-pane w-full max-w-4xl m-4 transform animate-slide-in-up flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
            Extend Image
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Close">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 p-6 flex flex-col md:flex-row gap-6 overflow-y-auto">
          <div className="md:w-2/3 flex-shrink-0 relative bg-gray-900/50 rounded-lg flex items-center justify-center p-4 min-h-[300px]">
            {isLoading ? (
              <Loader message="Extending your vision..." />
            ) : (
              <div className="relative w-full h-full flex items-center justify-center">
                <img 
                    src={extendedImage || originalResult.imageUrl} 
                    alt="Image preview" 
                    className="max-w-full max-h-full object-contain rounded-md" 
                    style={{maxHeight: '60vh'}}
                />
                {!extendedImage && !isLoading && (
                  <>
                    <DirectionButton direction="top" selected={direction === 'top'} onClick={() => setDirection('top')} positionClass="top-0 left-1/2"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg></DirectionButton>
                    <DirectionButton direction="bottom" selected={direction === 'bottom'} onClick={() => setDirection('bottom')} positionClass="bottom-0 left-1/2"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg></DirectionButton>
                    <DirectionButton direction="left" selected={direction === 'left'} onClick={() => setDirection('left')} positionClass="top-1/2 left-0"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg></DirectionButton>
                    <DirectionButton direction="right" selected={direction === 'right'} onClick={() => setDirection('right')} positionClass="top-1/2 right-0"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></DirectionButton>
                  </>
                )}
              </div>
            )}
          </div>
          
          <div className="md:w-1/3 flex flex-col space-y-4">
             <h3 className="text-lg font-semibold text-gray-200">Controls</h3>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Direction</label>
                <p className="glass-pane !bg-gray-900/80 p-3 rounded-md text-gray-300 text-sm capitalize">
                    {direction || 'Select a direction around the image'}
                </p>
              </div>
            <div>
              <label htmlFor="extend-prompt" className="block text-sm font-medium text-gray-400 mb-2">Extension Prompt (Optional)</label>
              <textarea
                id="extend-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., add a beautiful lake..."
                className="w-full h-32 p-3 bg-gray-900/70 border-2 border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors resize-none"
                rows={4}
                disabled={!!extendedImage}
              />
            </div>
            {error && <p className="text-red-400 text-center bg-red-900/50 p-3 rounded-md text-sm mt-2">{error}</p>}
            <div className="flex-grow"></div>
            {extendedImage ? (
                <div className="space-y-3">
                     <button onClick={handleApply} className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg text-sm transition-all duration-300 transform hover:scale-105">
                        Accept & Use Image
                    </button>
                    <button onClick={() => setExtendedImage(null)} className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg text-sm transition-colors">
                        Go Back
                    </button>
                </div>
            ) : (
                 <button 
                    onClick={handleGenerate} 
                    disabled={isLoading || !direction} 
                    className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg text-sm transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Generating...' : 'Generate Extension'}
                </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
