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
                        background: 'rgba(10,8,8,0.7)',
                        color: 'var(--primary)',
                        border: '1px solid var(--outline-variant)',
                        padding: '8px 10px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    title={isMuted ? 'Unmute Music' : 'Mute Music'}
                >
                    {isMuted ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                            <line x1="23" y1="9" x2="17" y2="15"></line>
                            <line x1="17" y1="9" x2="23" y2="15"></line>
                        </svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                        </svg>
                    )}
                </button>
            </div>
        </AudioContext.Provider>
    );
};

export const useAudio = () => useContext(AudioContext);
