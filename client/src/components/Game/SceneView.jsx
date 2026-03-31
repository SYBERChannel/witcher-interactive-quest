import React from 'react';

const BACKGROUND_MAP = {
    'kaer_morhen.jpg': '/backgrounds/kaer_morhen.png',
    'forest.jpg': '/backgrounds/forest.png',
    'novigrad.jpg': '/backgrounds/novigrad.png',
    'wild_hunt_fortress.jpg': '/backgrounds/wild_hunt_fortress.png',
    'tavern': '/backgrounds/tavern.png',
    'tavern.png': '/backgrounds/tavern.png',
    'kaer_morhen': '/backgrounds/kaer_morhen.png',
    'forest': '/backgrounds/forest.png',
    'novigrad': '/backgrounds/novigrad.png',
    'wild_hunt_fortress': '/backgrounds/wild_hunt_fortress.png',
};

const resolveBackground = (bg) => {
    if (!bg) return '/backgrounds/kaer_morhen.png';
    if (bg.startsWith('http')) return bg;
    if (bg.startsWith('/')) return bg;
    return BACKGROUND_MAP[bg] || '/backgrounds/kaer_morhen.png';
};

const SceneView = ({ scene }) => {
    if (!scene) {
        return <div className="scene-placeholder">Loading scene...</div>;
    }

    const bgUrl = resolveBackground(scene.background);

    return (
        <div className="flex-grow flex flex-col bg-surface-container shadow-inner border-none overflow-hidden parchment-glow">
            <div className="h-[400px] w-full relative">
                <img
                    alt={scene.title}
                    className="w-full h-full object-cover opacity-60 grayscale-[30%]"
                    src={bgUrl}
                    onError={(e) => { e.target.src = '/backgrounds/kaer_morhen.png'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-8">
                    <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary tracking-tight">{scene.title}</h1>
                    {scene.location && (
                        <p className="font-headline italic text-on-surface-variant text-lg">{scene.location}</p>
                    )}
                </div>
            </div>
            <div className="p-8 md:p-12 space-y-8">
                <div className="max-w-3xl">
                    <p className="font-body text-xl md:text-2xl leading-relaxed text-on-surface/90 first-letter:text-5xl first-letter:font-headline first-letter:text-primary first-letter:mr-3 first-letter:float-left">
                        {scene.text}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SceneView;
