import React from 'react';

const SceneView = ({ scene }) => {
    if (!scene) return <div className="scene-placeholder">Loading scene...</div>;

    const bgStyle = scene.background
        ? { backgroundImage: `url(${scene.background})` }
        : { backgroundColor: 'var(--surface-container-lowest)' };

    return (
        <div className="scene-view" style={bgStyle}>
            <div className="scene-content">
                <h2 className="scene-title">{scene.title}</h2>
                <div className="scene-text">
                    {scene.text}
                </div>
            </div>
        </div>
    );
};

export default SceneView;
