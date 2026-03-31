class AudioManager {
    constructor() {
        if (AudioManager.instance) {
            return AudioManager.instance;
        }

        // Single persistent HTMLAudioElement.
        // Reusing this instance is critical for iOS Safari so it stays "unlocked"
        // after the user's first interaction.
        this.audio = new Audio();
        this.audio.loop = true;
        this.audio.playsInline = true;
        this.audio.setAttribute('playsinline', '');
        this.audio.preload = 'auto';

        this.currentTrack = null;
        this.volume = 0.3;
        this.isMuted = localStorage.getItem('audio_muted') === 'true';
        this.isUnlocked = false; // Tracks if a user gesture has unlocked audio
        this.playPromise = null;
        this._pendingTrack = null;
        this._wasPlayingBeforeHidden = false;

        this._handleVisibilityChange = this._handleVisibilityChange.bind(this);
        document.addEventListener('visibilitychange', this._handleVisibilityChange);

        AudioManager.instance = this;
    }

    getTrackSrc(trackName) {
        const trackMap = {
            kaer_morhen_theme: '/music/spikeroog.mp3',
            tavern: '/music/spikeroog.mp3',
            forest_ambient: '/music/spikeroog.mp3',
            battle_theme: '/music/Cloak&Dagger.mp3',
            wild_hunt_theme: '/music/Cloak&Dagger.mp3',
            menu: '/music/spikeroog.mp3',
        };
        return trackMap[trackName] || trackMap.menu;
    }

    play(trackName) {
        const src = this.getTrackSrc(trackName);

        // If it's already the same track, ensure it's playing if meant to be
        if (this.currentTrack === src) {
            if (!this.isMuted && !document.hidden && this.isUnlocked) {
                this._safePlay();
            }
            return;
        }

        this.currentTrack = src;
        this._pendingTrack = null;
        
        // Changing src. Do not pause explicitly here as modifying src halts playback.
        this.audio.src = src;
        this.audio.load();

        if (this.isMuted || document.hidden) {
            return; // Don't attempt to play
        }

        if (this.isUnlocked) {
            this._safePlay();
        } else {
            this._pendingTrack = trackName;
        }
    }

    _safePlay() {
        if (!this.audio.src) return;

        // Apply volume (iOS will ignore this, which is normal hardware behavior)
        this.audio.volume = this.volume;

        // Handle the play promise gracefully.
        // Safari throws DOMExceptions if pause() is called while play() is resolving.
        if (this.playPromise !== null) {
            this.playPromise.then(() => {
                this._performPlay();
            }).catch(() => {
                this._performPlay();
            });
        } else {
            this._performPlay();
        }
    }

    _performPlay() {
        if (this.isMuted || document.hidden) return; // double check state
        const promise = this.audio.play();
        if (promise !== undefined) {
            this.playPromise = promise;
            promise.then(() => {
                this.playPromise = null;
            }).catch((err) => {
                this.playPromise = null;
                console.warn('Playback prevented by browser:', err);
                if (err.name === 'NotAllowedError') {
                    this.isUnlocked = false; // We lost gesture unlock
                }
            });
        }
    }

    _safePause() {
        if (!this.audio.src) return;

        if (this.playPromise !== null) {
            this.playPromise.then(() => {
                this.audio.pause();
            }).catch(() => {
                this.audio.pause();
            });
        } else {
            this.audio.pause();
        }
    }

    _handleVisibilityChange() {
        if (document.hidden) {
            if (!this.audio.paused) {
                this._wasPlayingBeforeHidden = true;
                this._safePause();
            }
        } else {
            if (this._wasPlayingBeforeHidden && !this.isMuted && this.isUnlocked) {
                this._safePlay();
            }
            this._wasPlayingBeforeHidden = false;
        }
    }

    stop() {
        this._safePause();
        this.audio.currentTime = 0;
        this.currentTrack = null;
    }

    fadeOut(duration) {
        // iOS ignores JS volume fading entirely.
        // For cross-platform stability, just stop gracefully.
        this.stop();
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('audio_muted', String(this.isMuted));

        // Interaction unlocking
        this.isUnlocked = true;

        if (this.isMuted) {
            this._safePause();
        } else {
            if (this._pendingTrack) {
                const t = this._pendingTrack;
                this._pendingTrack = null;
                this.play(t);
            } else if (this.currentTrack) {
                this._safePlay();
            } else {
                this.play('menu');
            }
        }
        
        return this.isMuted;
    }

    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
        if (!this.isMuted) {
            this.audio.volume = this.volume;
        }
    }

    getMuted() {
        return this.isMuted;
    }
}

const audioManager = new AudioManager();
export default audioManager;
