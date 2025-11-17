import React, { useEffect, useRef } from 'react';

/**
 * A component to display a vertical Adsterra ad banner.
 * It dynamically injects the ad scripts to work within a React application.
 */
const AdBannerVertical: React.FC = () => {
    const adContainerRef = useRef<HTMLDivElement>(null);
    const isAdLoaded = useRef(false);

    useEffect(() => {
        // Prevent script from being injected multiple times
        if (isAdLoaded.current || !adContainerRef.current) {
            return;
        }

        const adContainer = adContainerRef.current;
        
        adContainer.innerHTML = '';

        const configScript = document.createElement('script');
        configScript.type = 'text/javascript';
        configScript.innerHTML = `
            atOptions = {
                'key' : '4a078e166b273b8ee1866857d0f54e45',
                'format' : 'iframe',
                'height' : 300,
                'width' : 160,
                'params' : {}
            };
        `;
        
        const invokeScript = document.createElement('script');
        invokeScript.type = 'text/javascript';
        invokeScript.src = '//www.highperformanceformat.com/4a078e166b273b8ee1866857d0f54e45/invoke.js';
        invokeScript.async = true;

        adContainer.appendChild(configScript);
        adContainer.appendChild(invokeScript);
        
        isAdLoaded.current = true;

    }, []);

    return (
        <div className="mt-6 flex justify-center items-center w-full">
            <div 
                ref={adContainerRef} 
                className="flex justify-center items-center"
                style={{ minWidth: '160px', minHeight: '300px' }}
                role="region"
                aria-label="Advertisement"
            />
        </div>
    );
};

export default AdBannerVertical;
