import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface MusicPlayerProps {
  videoId: string;
  title: string;
  artist: string;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ videoId, title, artist }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const playerRef = useRef<any>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const isApiLoaded = useRef(false);

  useEffect(() => {
    const loadYouTubeAPI = () => {
      if (isApiLoaded.current) return;
      
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.body.appendChild(script);
      isApiLoaded.current = true;
    };

    const initializePlayer = () => {
      if (!window.YT || !window.YT.Player || !playerContainerRef.current) return;

      playerRef.current = new window.YT.Player(playerContainerRef.current, {
        height: '0',
        width: '0',
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          showinfo: 0,
        },
        events: {
          onReady: () => {
            setIsPlayerReady(true);
            if (playerRef.current) {
              playerRef.current.mute();
            }
          },
          onStateChange: (event: any) => {
            setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initializePlayer();
    } else {
      loadYouTubeAPI();
      window.onYouTubeIframeAPIReady = initializePlayer;
    }

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
      playerRef.current = null;
      setIsPlayerReady(false);
    };
  }, [videoId]);

  const togglePlayPause = () => {
    if (!playerRef.current || !isPlayerReady) return;

    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const toggleMute = () => {
    if (!playerRef.current || !isPlayerReady) return;

    if (isMuted) {
      playerRef.current.unMute();
      playerRef.current.setVolume(30);
    } else {
      playerRef.current.mute();
    }
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm z-40">
      <div ref={playerContainerRef} className="hidden"></div>
      
      <div className="flex items-center space-x-3">
        <button
          onClick={togglePlayPause}
          disabled={!isPlayerReady}
          className="flex-shrink-0 w-10 h-10 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-white" />
          ) : (
            <Play className="w-5 h-5 text-white ml-0.5" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
          <p className="text-xs text-gray-500 truncate">{artist}</p>
        </div>

        <button
          onClick={toggleMute}
          disabled={!isPlayerReady}
          className="flex-shrink-0 w-8 h-8 text-gray-600 hover:text-gray-800 disabled:text-gray-300 transition-colors"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};