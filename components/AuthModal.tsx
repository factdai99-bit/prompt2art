import React, { useState } from 'react';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: () => void;
}

const GoogleIcon = () => (
  <svg className="w-5 h-5" aria-hidden="true" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56,12.25C22.56,11.47 22.49,10.72 22.36,10H12v4.51h5.84c-0.26,1.47 -1.05,2.73 -2.28,3.58v3.01h3.86c2.26,-2.08 3.56,-5.15 3.56,-8.85Z" />
    <path fill="#34A853" d="M12,23c3.24,0 5.95,-1.08 7.93,-2.91l-3.86,-3.01c-1.08,0.73 -2.45,1.16 -4.07,1.16c-3.13,0 -5.78,-2.11 -6.73,-4.96H1.36v3.1c1.86,3.66 5.46,6.21 9.64,6.21Z" />
    <path fill="#FBBC05" d="M5.27,14.29c-0.24,-0.73 -0.38,-1.51 -0.38,-2.29s0.14,-1.56 0.38,-2.29V6.6H1.36c-0.75,1.47 -1.18,3.14 -1.18,4.91s0.43,3.44 1.18,4.91l3.91,-3.12Z" />
    <path fill="#EA4335" d="M12,5.38c1.73,0 3.28,0.59 4.51,1.74l3.43,-3.43C17.95,1.94 15.24,0 12,0C7.82,0 4.22,2.55 2.38,6.21l3.91,3.1C7.22,6.5 9.87,5.38 12,5.38Z" />
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.128 22 16.991 22 12z" />
  </svg>
);

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div onClick={onClose} className="absolute inset-0 bg-black/70 animate-fade-in"></div>
      <div className="relative glass-pane w-full max-w-md m-4 transform animate-slide-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10" aria-label="Close">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="p-8">
          <div className="text-center mb-6">
             <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
              {activeTab === 'signin' ? 'Welcome Back' : 'Join the Studio'}
            </h2>
          </div>
          
          <div className="flex bg-gray-900/50 rounded-lg p-1 mb-6">
            <button onClick={() => setActiveTab('signin')} className={`w-1/2 py-2.5 text-sm font-semibold transition-colors rounded-md focus:outline-none ${activeTab === 'signin' ? 'text-white bg-indigo-600' : 'text-gray-300 hover:text-white'}`}>
              Sign In
            </button>
            <button onClick={() => setActiveTab('signup')} className={`w-1/2 py-2.5 text-sm font-semibold transition-colors rounded-md focus:outline-none ${activeTab === 'signup' ? 'text-white bg-indigo-600' : 'text-gray-300 hover:text-white'}`}>
              Sign Up
            </button>
          </div>
          
          <div className="space-y-3">
             <button onClick={onLoginSuccess} className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg bg-gray-700/80 hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500">
                <GoogleIcon />
                <span className="text-sm font-semibold text-white">Continue with Google</span>
            </button>
            <button onClick={onLoginSuccess} className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg bg-[#1877F2]/80 hover:bg-[#1877F2] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500">
                <FacebookIcon />
                <span className="text-sm font-semibold text-white">Continue with Facebook</span>
            </button>
          </div>
          
          <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-700"></div>
              <span className="mx-4 text-xs text-gray-500 uppercase">Or</span>
              <div className="flex-grow border-t border-gray-700"></div>
          </div>
          
          <form onSubmit={(e) => { e.preventDefault(); onLoginSuccess(); }} className="space-y-4">
              <input type="email" placeholder="Email address" required className="w-full p-3 bg-gray-900/70 border-2 border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors" />
              <input type="password" placeholder="Password" required className="w-full p-3 bg-gray-900/70 border-2 border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors" />
              <button type="submit" className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg text-sm hover:from-violet-500 hover:to-indigo-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-violet-500">
                {activeTab === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};
