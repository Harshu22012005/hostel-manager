
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface MusicContextType {
  isPlaying: boolean;
  toggleMusic: () => void;
  volume: number;
  setVolume: (value: number) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [audio] = useState(new Audio("/bgmusic.mp3"));
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);

  useEffect(() => {
    audio.loop = true;
    audio.volume = volume;
    
    return () => {
      audio.pause();
    };
  }, [audio]);

  useEffect(() => {
    if (isPlaying) {
      audio.play().catch(error => {
        console.error("Audio playback failed:", error);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, audio]);

  useEffect(() => {
    audio.volume = volume;
  }, [volume, audio]);

  const toggleMusic = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <MusicContext.Provider value={{ isPlaying, toggleMusic, volume, setVolume }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
}
