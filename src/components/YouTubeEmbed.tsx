import React, { useState, useEffect } from 'react';
import { useCookieConsent } from '../hooks/useCookieConsent';
import { useCookieYesStoreApi } from '@cookieyes/react';
import './YouTubeEmbed.css';

interface YouTubeEmbedProps {
  /**
   * YouTube video ID (extracted from URL)
   * Example: "dQw4w9WgXcQ" from "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
   */
  videoId: string;
  
  /**
   * Optional title for the video
   */
  title?: string;
  
  /**
   * Width of the embed (default: 560)
   */
  width?: number;
  
  /**
   * Height of the embed (default: 315)
   */
  height?: number;
  
  /**
   * Whether to require consent before loading (default: true)
   * Set to false to always load (not GDPR compliant)
   */
  requireConsent?: boolean;
  
  /**
   * Which consent category to check (default: 'functional')
   * YouTube embeds typically require functional consent
   */
  consentCategory?: 'functional' | 'analytics' | 'advertising';
  
  /**
   * Use privacy-enhanced mode (youtube-nocookie.com)
   * This delays cookie setting until user clicks play (default: true)
   * More GDPR compliant
   */
  usePrivacyMode?: boolean;
}

/**
 * YouTube Embed Component
 * 
 * Embeds YouTube videos with GDPR-compliant consent handling.
 * Only loads the iframe if user has given consent.
 */
export function YouTubeEmbed({
  videoId,
  title = 'YouTube video player',
  width = 560,
  height = 315,
  requireConsent = true,
  consentCategory = 'functional',
  usePrivacyMode = true,
}: YouTubeEmbedProps) {
  const { hasConsent, preferences } = useCookieConsent();
  const storeApi = useCookieYesStoreApi();
  const [controller, setController] = useState<any>(null);
  
  // Get the banner controller from window (exposed by CookieBanner)
  useEffect(() => {
    const checkController = () => {
      if (typeof window !== 'undefined') {
        if ((window as any).__cookieYesBannerController) {
          setController((window as any).__cookieYesBannerController);
        }
      }
    };

    checkController();
    // Check periodically in case CookieBanner hasn't mounted yet
    const interval = setInterval(checkController, 100);
    
    return () => clearInterval(interval);
  }, []);
  
  // Check consent directly from preferences for reactivity
  const hasConsentForCategory = preferences[consentCategory] === true;
  
  // Check if we can load the video
  // Only allow loading if consent is given through the proper consent system
  // No bypass mechanism - GDPR compliant
  const canLoad = !requireConsent || hasConsentForCategory;
  
  // Extract video ID from URL if full URL is provided
  const extractVideoId = (idOrUrl: string): string => {
    // If it's already just an ID, return it
    if (!idOrUrl.includes('youtube.com') && !idOrUrl.includes('youtu.be')) {
      return idOrUrl;
    }
    
    // Extract from various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    ];
    
    for (const pattern of patterns) {
      const match = idOrUrl.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return idOrUrl;
  };
  
  const finalVideoId = extractVideoId(videoId);
  
  // Use privacy-enhanced mode (youtube-nocookie.com) to delay cookie setting
  // Cookies are only set when user clicks play, not when iframe loads
  const youtubeDomain = usePrivacyMode ? 'www.youtube-nocookie.com' : 'www.youtube.com';
  const embedUrl = `https://${youtubeDomain}/embed/${finalVideoId}?enablejsapi=1&origin=${window.location.origin}`;
  
  const handleOpenPreferences = () => {
    // Open the cookie preferences modal using the CookieYes controller
    // GDPR compliant: Users must give consent through the proper consent system
    if (controller) {
      controller.actions.openPreferences();
      // Ensure banner doesn't show (we only want the modal)
      storeApi.getState().setShowBanner(false);
    } else {
      // Fallback: try to show the banner if controller isn't available yet
      storeApi.getState().setShowBanner(true);
    }
  };
  
  if (canLoad) {
    return (
      <div className="youtube-embed-container">
        <iframe
          width={width}
          height={height}
          src={embedUrl}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="youtube-embed"
        />
      </div>
    );
  }
  
  // Show consent placeholder
  // GDPR compliant: No bypass mechanism - users must give consent through the cookie banner
  return (
    <div className="youtube-embed-placeholder" style={{ width, height }}>
      <div className="youtube-embed-placeholder-content">
        <div className="youtube-embed-placeholder-icon">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
              fill="currentColor"
            />
          </svg>
        </div>
        <h3>YouTube Video</h3>
        <p>
          This video is hosted on YouTube. To view it, please accept{' '}
          {consentCategory === 'functional' ? 'functional' : consentCategory} cookies.
          {usePrivacyMode && ' (Privacy mode enabled - cookies only set when you play the video)'}
        </p>
        <button
          className="youtube-embed-consent-button"
          onClick={handleOpenPreferences}
        >
          Manage Cookie Preferences
        </button>
        <p className="youtube-embed-note">
          Please accept {consentCategory === 'functional' ? 'functional' : consentCategory} cookies in the cookie banner to view this video.
        </p>
      </div>
    </div>
  );
}

/**
 * Helper function to extract video ID from YouTube URL
 */
export function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

