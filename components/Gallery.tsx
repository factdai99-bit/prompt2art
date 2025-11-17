import React from 'react';
import { GenerationResult } from '../types';

interface GalleryProps {
  items: GenerationResult[];
  onClear: () => void;
}

export const Gallery: React.FC<GalleryProps> = ({ items, onClear }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-100">Gallery</h2>
        {items.length > 0 && (
            <button onClick={onClear} className="bg-red-600/50 text-white px-3 py-1 rounded-md font-semibold hover:bg-red-500 transition-colors text-xs focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500">
            Clear
            </button>
        )}
      </div>
       {items.length === 0 ? (
           <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500 border-2 border-dashed border-gray-700 rounded-lg">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
               <p className="text-sm">Your generated images will appear here.</p>
           </div>
       ) : (
          <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer glow-on-hover">
                <img src={item.imageUrl} alt={item.originalPrompt} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                 {item.isEnhanced && (
                    <div className="absolute top-1.5 right-1.5 bg-violet-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-lg">
                        4K
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-xs text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end">
                  <p className="font-bold truncate">{item.stylePack.name}</p>
                  <p className="truncate opacity-80">{item.originalPrompt}</p>
                </div>
              </div>
            ))}
          </div>
       )}
    </div>
  );
};
