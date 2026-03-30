import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
    const [currentTrack, setCurrentTrack] = useState(null);
    const [isMuted, setIsMuted] = useState(() => {
        return localStorage.getItem('audio_muted') === 'true';
    });

    // Using refs to hold audio elements to avoid re-renders
    const audioRef = useRef(new Audio());
    const fadeIntervalRef = useRef(null);

    useEffect(() => {
        audioRef.current.loop = true;
        audioRef.current.volume = isMuted ? 0 : 0.5;

        return () => {
            if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
            audioRef.current.pause();
        };
    }, []);

    useEffect(() => {
        audioRef.current.volume = isMuted ? 0 : 0.5;
        localStorage.setItem('audio_muted', isMuted);
    }, [isMuted]);

    const playTrack = (trackKey) => {
        if (currentTrack === trackKey) return;

        // Simple fade out/in simulation (for browsers that allow auto-play)
        const newSrc = `/audio/${trackKey}.mp3`;

        // In a real implementation we might cross-fade two audio elements.
        // For simplicity: stop, change src, play.

        // Fade out
        let vol = isMuted ? 0 : 0.5;
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

        if (!isMuted && audioRef.current.paused === false) {
            fadeIntervalRef.current = setInterval(() => {
                vol = Math.max(0, vol - 0.05);
                audioRef.current.volume = vol;
                if (vol <= 0) {
                    clearInterval(fadeIntervalRef.current);
                    switchTrack(newSrc, trackKey);
                }
            }, 100);
        } else {
            switchTrack(newSrc, trackKey);
        }
    };

    const switchTrack = (src, key) => {
        audioRef.current.src = src;
        audioRef.current.currentTime = 0;

        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Fade in
                if (!isMuted) {
                    let vol = 0;
                    audioRef.current.volume = vol;
                    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
                    fadeIntervalRef.current = setInterval(() => {
                        vol = Math.min(0.5, vol + 0.05);
                        audioRef.current.volume = vol;
                        if (vol >= 0.5) clearInterval(fadeIntervalRef.current);
                    }, 100);
                }
            }).catch(error => {
                console.warn("Audio playback failed (browser policy?):", error);
            });
        }

        setCurrentTrack(key);
    };

    const stop = () => {
        audioRef.current.pause();
        setCurrentTrack(null);
    };

    const toggleMute = () => {
        setIsMuted(prev => !prev);
    };

    return (
        <AudioContext.Provider value={{ playTrack, stop, toggleMute, isMuted }}>
            {children}
            {/* Visual audio control could be placed here or in App structure */}
            <div style={{ position: 'fixed', bottom: '10px', right: '10px', zIndex: 9999 }}>
                <button
                    onClick={toggleMute}
                    style={{
                        background: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        border: '1px solid #555',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        fontSize: '0.8rem'
                    }}
                >
                    {isMuted ? 'Unmute' : 'Mute Music'}
                </button>
            </div>
        </AudioContext.Provider>
    );
};

export const useAudio = () => useContext(AudioContext);
