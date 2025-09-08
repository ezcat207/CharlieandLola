'use client';

import { useEffect, useRef } from 'react';

interface TwitterEmbedProps {
  html: string;
  className?: string;
}

export function TwitterEmbed({ html, className = '' }: TwitterEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Set the HTML content
      containerRef.current.innerHTML = html;
      
      // Load Twitter widgets script if not already loaded
      if (!window.twttr) {
        const script = document.createElement('script');
        script.src = 'https://platform.twitter.com/widgets.js';
        script.async = true;
        script.charset = 'utf-8';
        document.head.appendChild(script);
        
        script.onload = () => {
          if (window.twttr?.widgets && containerRef.current) {
            window.twttr.widgets.load(containerRef.current);
          }
        };
      } else if (window.twttr?.widgets && containerRef.current) {
        // If Twitter widgets are already loaded, process the container
        window.twttr.widgets.load(containerRef.current);
      }
    }
  }, [html]);

  return (
    <div 
      ref={containerRef} 
      className={`twitter-embed ${className}`}
    />
  );
}

// Global type declaration for Twitter widgets
declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (element?: Element) => void;
      };
    };
  }
}