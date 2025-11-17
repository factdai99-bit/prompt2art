import React from 'react';

const SidebarIcon = ({ icon, text, active = false }: { icon: React.ReactNode; text: string; active?: boolean }) => (
  <button className={`relative flex items-center justify-center h-12 w-12 my-2 transition-all duration-300 ease-in-out
                      group
                      ${active 
                        ? 'bg-indigo-600 text-white rounded-2xl' 
                        : 'bg-gray-800 text-gray-400 hover:bg-indigo-600 hover:text-white rounded-3xl hover:rounded-xl'}`}
    aria-label={text}
  >
    {icon}
    <span className="absolute w-auto p-2 m-2 min-w-max left-14 rounded-md shadow-md
                   text-white bg-gray-900 border border-gray-700
                   text-xs font-bold transition-all duration-100 scale-0 origin-left group-hover:scale-100">
      {text}
    </span>
  </button>
);

const CreateIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
const GalleryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

export const Sidebar: React.FC = () => {
  return (
    <aside className="fixed top-0 left-0 h-screen w-20 flex flex-col items-center
                      bg-gray-900/80 backdrop-blur-sm border-r border-gray-800 shadow-lg z-40 pt-24">
      <SidebarIcon icon={<CreateIcon />} text="Create" active />
      <SidebarIcon icon={<GalleryIcon />} text="Gallery" />
      <SidebarIcon icon={<SettingsIcon />} text="Settings" />
    </aside>
  );
};
