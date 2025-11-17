import React from 'react';

export const Header: React.FC<{ isLoggedIn: boolean; onLoginClick: () => void; onLogoutClick: () => void; }> = ({ isLoggedIn, onLoginClick, onLogoutClick }) => {
  return (
    <header className="bg-gray-900/60 backdrop-blur-lg p-4 sticky top-0 z-50 border-b border-gray-800/70">
      <div className={`container mx-auto flex justify-between items-center ${isLoggedIn ? 'pl-20' : ''}`}>
        <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400">
          Prompt2Art
        </h1>
        <div className="flex items-center space-x-2 md:space-x-4">
          {isLoggedIn ? (
             <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-lg ring-2 ring-offset-2 ring-offset-gray-900 ring-violet-500">
                    A
                </div>
                <button 
                  onClick={onLogoutClick} 
                  className="text-sm text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 rounded-md px-3 py-2"
                  aria-label="Logout"
                >
                    Logout
                </button>
            </div>
          ) : (
            <>
                <button 
                  onClick={onLoginClick} 
                  className="text-sm md:text-base px-4 py-2 rounded-lg hover:bg-gray-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
                >
                    Login
                </button>
                <button 
                  onClick={onLoginClick} 
                  className="text-sm md:text-base bg-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
                >
                    Sign Up
                </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
