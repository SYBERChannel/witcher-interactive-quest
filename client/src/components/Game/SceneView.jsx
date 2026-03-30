import React from 'react';

const BACKGROUND_MAP = {
    'kaer_morhen.jpg': '/backgrounds/kaer_morhen.png',
    'forest.jpg': '/backgrounds/forest.png',
    'novigrad.jpg': '/backgrounds/novigrad.png',
    'wild_hunt_fortress.jpg': '/backgrounds/wild_hunt_fortress.png',
    'tavern': '/backgrounds/tavern.png',
};

const resolveBackground = (bg) => {
    if (!bg) return null;
    if (bg.startsWith('/')) return bg;
    return BACKGROUND_MAP[bg] || bg;
};

const SceneView = ({ scene }) => {
    if (!scene) {
        return <div className="scene-placeholder">Loading scene...</div>;
    }

    const bgUrl = resolveBackground(scene.background);

    return (
        <div
            className="scene-view"
            style={bgUrl ? { backgroundImage: `url(${bgUrl})` } : {}}
        >
            <div className="scene-overlay" />
            <div className="scene-content">
                {scene.branch && (
                    <div className="scene-location">{scene.branch === 'good' ? 'The Path of Light' : scene.branch === 'bad' ? 'The Path of Darkness' : 'The Neutral Path'}</div>
                )}
                <h2 className="scene-title">{scene.title}</h2>
                <div className="scene-text">{scene.text}</div>
            </div>
        </div>
    );
};

export default SceneView;
