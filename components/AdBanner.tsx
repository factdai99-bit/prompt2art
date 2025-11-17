import React, { useEffect, useRef } from 'react';

/**
 * A component to display an Adsterra ad banner.
 * It dynamically injects the ad scripts to work within a React application.
 */
const AdBanner: React.FC = () => {
    const adContainerRef = useRef<HTMLDivElement>(null);
    const isAdLoaded = useRef(false);

    useEffect(() => {
        // Prevent script from being injected multiple times, e.g., in React.StrictMode
        if (isAdLoaded.current || !adContainerRef.current) {
            return;
        }

        const adContainer = adContainerRef.current;
        
        // Clear any previous content in case of a component remount
        adContainer.innerHTML = '';

        const configScript = document.createElement('script');
        configScript.type = 'text/javascript';
        // This sets the global configuration for the ad script.
        configScript.innerHTML = `
            atOptions = {
                'key' : '23e99c548a4d46677a8a84956d705b53',
                'format' : 'iframe',
                'height' : 50,
                'width' : 320,
                'params' : {}
            };
        `;
        
        const invokeScript = document.createElement('script');
        invokeScript.type = 'text/javascript';
        invokeScript.src = '//www.highperformanceformat.com/23e99c548a4d46677a8a84956d705b53/invoke.js';
        invokeScript.async = true;

        adContainer.appendChild(configScript);
        adContainer.appendChild(invokeScript);
        
        isAdLoaded.current = true;

    }, []);

    // The outer div handles centering and vertical spacing.
    // The inner div is where the ad scripts are injected and the ad iframe will be rendered.
    // Setting min-height and min-width helps prevent layout shift while the ad loads.
    return (
        <div className="my-6 flex justify-center items-center w-full">
            <div 
                ref={adContainerRef} 
                className="flex justify-center items-center"
                style={{ minWidth: '320px', minHeight: '50px' }}
                aria-live="polite"
                role="region"
                aria-label="Advertisement"
            />
        </div>
    );
};

export default AdBanner;
