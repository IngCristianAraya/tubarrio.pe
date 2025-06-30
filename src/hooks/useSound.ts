'use client';

import { useCallback, useEffect, useRef } from 'react';

type SoundType = 'click' | 'hover' | 'success' | 'error' | 'folder';

interface SoundOptions {
  volume?: number;
  enabled?: boolean;
}

const soundFiles: Record<SoundType, string> = {
  click: '/sounds/click.mp3',
  hover: '/sounds/hover.mp3',
  success: '/sounds/success.mp3',
  error: '/sounds/error.mp3',
  folder: '/sounds/folder.mp3',
};

const useSound = (type: SoundType = 'click', options: SoundOptions = {}) => {
  const { volume = 0.5, enabled = true } = options;
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Asegurarse de que estamos en el navegador antes de crear el elemento Audio
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio(soundFiles[type]);
      audioRef.current.volume = volume;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [type, volume]);

  const play = useCallback(() => {
    if (enabled && audioRef.current) {
      // Reset the audio to the beginning if it's already playing
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => {
        // Handle any autoplay restrictions or other errors silently
        console.error('Error playing sound:', error);
      });
    }
  }, [enabled]);

  return { play };
};

export default useSound;
