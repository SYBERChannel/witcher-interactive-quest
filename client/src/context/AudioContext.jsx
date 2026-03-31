import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import audioManager from '../services/AudioManager';

const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
    const [isMuted, setIsMuted] = useState(audioManager.getMuted());
    const [isBattlePage, setIsBattlePage] = useState(false);
    const interactionStarted = useRef(false);

    useEffect(() => {
        const checkPath = () => {
            setIsBattlePage(window.location.pathname.startsWith('/battle'));
        };
        checkPath();
        window.addEventListener('popstate', checkPath);
        return () => window.removeEventListener('popstate', checkPath);
    }, []);

    useEffect(() => {
        const startAudio = () => {
            if (interactionStarted.current) return;
            if (!audioManager.bgMusic && !audioManager.currentTrack) {
                audioManager.play('menu');
            }
            interactionStarted.current = true;
        };

        window.addEventListener('click', startAudio, { once: true });
        window.addEventListener('touchend', startAudio, { once: true });
        window.addEventListener('keydown', startAudio, { once: true });

        return () => {
            window.removeEventListener('click', startAudio);
            window.removeEventListener('touchend', startAudio);
            window.removeEventListener('keydown', startAudio);
        };
    }, []);

    const toggleMute = (e) => {
        e.stopPropagation();
        const newMuted = audioManager.toggleMute();
        setIsMuted(newMuted);
        if (!newMuted && !audioManager.bgMusic && !audioManager.currentTrack) {
            audioManager.play('menu');
        }
    };

    const bottomOffset = isBattlePage ? '90px' : '15px';

    return (
        <AudioContext.Provider value={{ toggleMute, isMuted }}>
            {children}
            <div style={{
                position: 'fixed',
                bottom: bottomOffset,
                right: '15px',
                zIndex: 9999,
                transition: 'bottom 0.3s ease'
            }}>
                <button
                    onClick={toggleMute}
                    onTouchEnd={toggleMute}
                    style={{
                        background: 'rgba(10,8,8,0.85)',
                        color: 'var(--primary)',
                        border: '1px solid var(--outline-variant)',
                        padding: '10px 12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
                        transition: 'all 0.2s ease',
                        WebkitTapHighlightColor: 'transparent',
                        touchAction: 'manipulation',
                    }}
                    title={isMuted ? 'Включить музыку' : 'Выключить музыку'}
                    aria-label={isMuted ? 'Включить музыку' : 'Выключить музыку'}
                >
                    {isMuted ? (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                            <line x1="23" y1="9" x2="17" y2="15" />
                            <line x1="17" y1="9" x2="23" y2="15" />
                        </svg>
                    ) : (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                        </svg>
                    )}
                </button>
            </div>
        </AudioContext.Provider>
    );
};

export const useAudio = () => useContext(AudioContext);
