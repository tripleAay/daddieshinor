"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";

type AudioContextType = {
    isPlaying: boolean;
    togglePlay: () => void;
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(() => {
                // Silent fail – most common on first play due to browser autoplay policy
            });
        }
        setIsPlaying((prev) => !prev);
    };

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.25;     // gentle volume
            audioRef.current.loop = true;       // seamless looping
            // Optional: start muted on first load (uncomment if needed)
            // audioRef.current.muted = true;
            // audioRef.current.play().catch(() => {});
        }

        // Cleanup (rarely needed since provider is root-level)
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, []);

    return (
        <AudioContext.Provider value={{ isPlaying, togglePlay }}>
            {children}
            <audio
                ref={audioRef}
                src="/audio/Late-at-Night(chosic.com).mp3"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            />

        </AudioContext.Provider>
    );
}

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error("useAudio must be used within an AudioProvider");
    }
    return context;
};