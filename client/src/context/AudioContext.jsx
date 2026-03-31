import React, { createContext, useContext, useState, useEffect } from 'react';
import audioManager from '../services/AudioManager';

const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
    const [isMuted, setIsMuted] = useState(audioManager.getMuted());

    // Automatically start default music on first user interaction if nothing is playing
    useEffect(() => {
        const handleInteraction = () => {
            if (!audioManager.bgMusic && !audioManager.currentTrack) {
                audioManager.play('menu');
            }
        };

        window.addEventListener('click', handleInteraction);
        window.addEventListener('keydown', handleInteraction);

        return () => {
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
        };
    }, []);

    const toggleMute = () => {
        const newMuted = audioManager.toggleMute();
        setIsMuted(newMuted);
    };

    return (
        <AudioContext.Provider value={{ toggleMute, isMuted }}>
            {children}
            <div style={{ position: 'fixed', bottom: '15px', right: '15px', zIndex: 9999 }}>
                <button
                    onClick={toggleMute}
                    style={{
                        background: 'rgba(10,8,8,0.8)',
                        color: 'var(--primary)',
                        border: '1px solid var(--outline-variant)',
                        padding: '10px 12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                        transition: 'all 0.2s ease'
                    }}
                    title={isMuted ? 'Включить музыку' : 'Выключить музыку'}
                >
                    {isMuted ? (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                            <line x1="23" y1="9" x2="17" y2="15"></line>
                            <line x1="17" y1="9" x2="23" y2="15"></line>
                        </svg>
                    ) : (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
