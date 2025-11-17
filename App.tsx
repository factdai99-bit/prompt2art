
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ControlsPanel } from './components/ControlsPanel';
import { Loader } from './components/Loader';
import { ResultDisplay } from './components/ResultDisplay';
import { Gallery } from './components/Gallery';
import { AuthModal } from './components/AuthModal';
import { ExtendImageModal } from './components/ExtendImageModal';
import AdBanner from './components/AdBanner';
import AdBannerVertical from './components/AdBannerVertical';
import { STYLE_PACKS } from './constants';
import { StylePack, GenerationResult } from './types';
import { boostPrompt, generateImage, upscaleImage } from './services/geminiService';

const WelcomeScreen: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => (
  <div className="text-center p-12 glass-pane max-w-3xl mx-auto animate-slide-in-up">
    <h2 className="text-5xl font-bold text-gray-100 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400 mb-4">
      Unlock Your Imagination
    </h2>
    <p className="text-gray-300 mt-2 text-xl">
      Transform your ideas into stunning, AI-generated art with Prompt2Art Studio.
    </p>
    <button
      onClick={onGetStarted}
      className="mt-10 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold py-4 px-10 rounded-xl text-lg 
                 hover:from-violet-500 hover:to-indigo-500 transition-all duration-300 transform hover:scale-105 
                 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-violet-500/50"
    >
      Start Creating
    </button>
  </div>
);

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<StylePack>(STYLE_PACKS[0]);
  const [enhanceResolution, setEnhanceResolution] = useState<boolean>(false);
  const [resolution, setResolution] = useState<'1:1' | '9:16' | '16:9'>('1:1');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [galleryItems, setGalleryItems] = useState<GenerationResult[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showExtendModal, setShowExtendModal] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoggedIn) return;
    try {
      const storedGallery = localStorage.getItem('prompt2art-gallery');
      if (storedGallery) setGalleryItems(JSON.parse(storedGallery));
    } catch (e) {
      console.error("Failed to parse gallery from localStorage", e);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) return;
    try {
      localStorage.setItem('prompt2art-gallery', JSON.stringify(galleryItems));
    } catch(e) {
      console.error("Failed to save gallery to localStorage", e);
    }
  }, [galleryItems, isLoggedIn]);
  
  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setResult(null);
  };

  const handleGenerate = useCallback(async (useCurrentResult = false) => {
    const currentPrompt = useCurrentResult && result ? result.originalPrompt : prompt;
    const currentStyle = useCurrentResult && result ? result.stylePack : selectedStyle;
    const currentResolution = useCurrentResult && result ? result.aspectRatio : resolution;

    if (!currentPrompt.trim()) {
      setError('Please describe your vision in the prompt field.');
      return;
    }
    if(loading) return;

    setLoading(true);
    setError(null);
    if (!useCurrentResult) setResult(null);

    try {
      setLoadingMessage('✨ Boosting your prompt...');
      const boosted = await boostPrompt(currentPrompt, currentStyle.promptPrefix);
      
      setLoadingMessage('🎨 Painting your masterpiece...');
      let imageUrl = await generateImage(boosted, currentResolution);
      let isEnhanced = false;

      if (enhanceResolution) {
        setLoadingMessage('🚀 Enhancing to 4K...');
        imageUrl = await upscaleImage(imageUrl);
        isEnhanced = true;
      }
      
      const newResult: GenerationResult = {
        id: new Date().toISOString(),
        originalPrompt: currentPrompt,
        boostedPrompt: boosted,
        imageUrl,
        stylePack: currentStyle,
        timestamp: new Date().toLocaleString(),
        isEnhanced,
        aspectRatio: currentResolution,
      };
      
      setResult(newResult);
      if (!galleryItems.some(item => item.id === newResult.id)) {
          setGalleryItems(prevItems => [newResult, ...prevItems].slice(0, 20));
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Generation failed: ${errorMessage}`);
      setResult({
        id: new Date().toISOString(),
        originalPrompt: currentPrompt,
        boostedPrompt: "Error during generation. Please try regenerating.",
        imageUrl: `https://picsum.photos/seed/error/${currentResolution === '16:9' ? '1920/1080' : currentResolution === '9:16' ? '1080/1920': '1024/1024'}`,
        stylePack: currentStyle,
        timestamp: new Date().toLocaleString(),
        aspectRatio: currentResolution,
      });
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  }, [prompt, selectedStyle, loading, enhanceResolution, result, galleryItems, resolution]);

  const handleRegenerate = () => {
      if(result) handleGenerate(true);
  }

  const handleEditPrompt = () => {
    if (result) {
      setPrompt(result.originalPrompt);
      setSelectedStyle(result.stylePack);
      setResolution(result.aspectRatio);
    }
  };
  
  const handleOpenExtend = () => {
    if(result) setShowExtendModal(true);
  }
  
  const handleApplyExtension = (newImageUrl: string) => {
    if (!result) return;
    
    const newResult: GenerationResult = {
        ...result,
        id: new Date().toISOString(),
        imageUrl: newImageUrl,
        timestamp: new Date().toLocaleString(),
    };
    
    setResult(newResult);
    if (!galleryItems.some(item => item.id === newResult.id)) {
        setGalleryItems(prevItems => [newResult, ...prevItems].slice(0, 20));
    }
    setShowExtendModal(false);
  }

  const clearGallery = () => {
    setGalleryItems([]);
  };

  return (
    <div className="min-h-screen font-sans text-white flex flex-col">
      <Header isLoggedIn={isLoggedIn} onLoginClick={() => setShowAuthModal(true)} onLogoutClick={handleLogout} />
      
      {isLoggedIn && <Sidebar />}

      <main className={`flex-1 flex flex-col ${isLoggedIn ? 'pl-20' : ''}`}>
        {isLoggedIn ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 h-full flex-1">
            {/* Left Panel: Controls */}
            <aside className="lg:col-span-3 h-full">
               <ControlsPanel
                prompt={prompt}
                setPrompt={setPrompt}
                selectedStyle={selectedStyle}
                setSelectedStyle={setSelectedStyle}
                enhanceResolution={enhanceResolution}
                setEnhanceResolution={setEnhanceResolution}
                resolution={resolution}
                setResolution={setResolution}
                handleGenerate={() => handleGenerate(false)}
                loading={loading}
                error={error}
              />
            </aside>

            {/* Center Panel: Viewer */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center h-full">
              {loading ? (
                <Loader message={loadingMessage} />
              ) : result ? (
                <ResultDisplay result={result} onRegenerate={handleRegenerate} onEditPrompt={handleEditPrompt} onExtend={handleOpenExtend} isLoading={loading} />
              ) : (
                <div className="text-center p-8 glass-pane w-full max-w-2xl">
                  <h2 className="text-2xl font-bold text-gray-200">AI Art Studio</h2>
                  <p className="text-gray-400 mt-2">Your creations will appear here.</p>
                  <p className="text-gray-500 mt-4 text-sm">Select a style, write a prompt, and click Generate!</p>
                </div>
              )}
              <AdBanner />
            </div>

            {/* Right Panel: Gallery */}
            <aside className="lg:col-span-3 h-full">
               <div className="glass-pane p-6 flex flex-col h-full">
                 <Gallery items={galleryItems} onClear={clearGallery} />
                 <AdBannerVertical />
               </div>
            </aside>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <WelcomeScreen onGetStarted={() => setShowAuthModal(true)} />
          </div>
        )}
      </main>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onLoginSuccess={handleLogin} />}
      {showExtendModal && result && (
        <ExtendImageModal 
            originalResult={result}
            onClose={() => setShowExtendModal(false)}
            onApply={handleApplyExtension}
        />
      )}
    </div>
  );
};

export default App;
