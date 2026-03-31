class AudioManager {
    constructor() {
        if (AudioManager.instance) {
            return AudioManager.instance;
        }

        this.bgMusic = null;
        this.currentTrack = null;
        this.volume = 0.3;
        this.isMuted = localStorage.getItem('audio_muted') === 'true';
        this.fadeDuration = 2000;
        this._pendingTrack = null;

        // Auto-pause when tab is hidden, resume when visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this._pauseForVisibility();
            } else {
                this._resumeFromVisibility();
            }
        });

        AudioManager.instance = this;
    }

    _pauseForVisibility() {
        if (this.bgMusic && !this.bgMusic.paused) {
            this.bgMusic.pause();
            this._wasPlayingBeforeHidden = true;
        }
    }

    _resumeFromVisibility() {
        if (this._wasPlayingBeforeHidden && this.bgMusic && !this.isMuted) {
            this.bgMusic.play().catch(e => console.log("Visibility resume failed:", e));
        }
        this._wasPlayingBeforeHidden = false;
    }

    play(trackName) {
        const trackMap = {
            kaer_morhen_theme: '/music/spikeroog.mp3',
            tavern: '/music/spikeroog.mp3',
            forest_ambient: '/music/spikeroog.mp3',
            battle_theme: '/music/Cloak&Dagger.mp3',
            wild_hunt_theme: '/music/Cloak&Dagger.mp3',
            menu: '/music/spikeroog.mp3',
        };

        const src = trackMap[trackName] || trackMap.menu;

        if (this.currentTrack === src && this.bgMusic && !this.bgMusic.paused) {
            return;
        }

        this.stop();

        this.bgMusic = new Audio(src);
        this.bgMusic.loop = true;
        this.bgMusic.volume = this.isMuted ? 0 : this.volume;
        this.bgMusic.playsInline = true;
        this.bgMusic.setAttribute('playsinline', '');
        this.currentTrack = src;

        const playPromise = this.bgMusic.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                this._pendingTrack = trackName;
                this._attachResumeListeners();
            });
        }
        
        // If document is already hidden, pause immediately
        if (document.hidden) {
            this._pauseForVisibility();
        }
    }

    _attachResumeListeners() {
        const resume = () => {
            if (this._pendingTrack) {
                const t = this._pendingTrack;
                this._pendingTrack = null;
                this.play(t);
            }
            document.removeEventListener('touchend', resume, { once: true });
            document.removeEventListener('click', resume, { once: true });
        };
        document.addEventListener('touchend', resume, { once: true });
        document.addEventListener('click', resume, { once: true });
    }

    stop() {
        if (this.bgMusic) {
            this.bgMusic.pause();
            this.bgMusic.currentTime = 0;
            this.bgMusic = null;
            this.currentTrack = null;
        }
    }

    fadeOut(duration) {
        if (!this.bgMusic) return;
        const ms = duration || this.fadeDuration;
        const steps = 20;
        const stepTime = ms / steps;
        const volumeStep = this.bgMusic.volume / steps;
        let currentStep = 0;

        const interval = setInterval(() => {
            currentStep++;
            if (currentStep >= steps || !this.bgMusic) {
                clearInterval(interval);
                this.stop();
            } else {
                this.bgMusic.volume = Math.max(0, this.bgMusic.volume - volumeStep);
            }
        }, stepTime);
    }

    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
        if (this.bgMusic && !this.isMuted) {
            this.bgMusic.volume = this.volume;
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('audio_muted', this.isMuted);
        
        if (this.bgMusic) {
            if (this.isMuted) {
                this.bgMusic.volume = 0;
                this.bgMusic.pause();
            } else {
                this.bgMusic.volume = this.volume;
                this.bgMusic.play().catch(e => console.log("Resume failed:", e));
            }
        }
        
        if (!this.isMuted && this._pendingTrack) {
            const t = this._pendingTrack;
            this._pendingTrack = null;
            this.play(t);
        }
        return this.isMuted;
    }

    getMuted() {
        return this.isMuted;
    }
}

const audioManager = new AudioManager();
export default audioManager;
