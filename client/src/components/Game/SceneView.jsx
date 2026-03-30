import React from 'react';

const SceneView = ({ scene }) => {
    if (!scene) return <div className="scene-placeholder">Loading scene...</div>;

    const bgStyle = scene.background
        ? { backgroundImage: `url(${scene.background})` }
        : { backgroundColor: '#111' };

    return (
        <div className="scene-view" style={bgStyle}>
            <div className="scene-content fade-in">
                <h2 className="scene-title">{scene.title}</h2>
                <div className="scene-text">
                    {scene.text}
                </div>
            </div>

            <style>{`
                .scene-view {
                    position: relative;
                    width: 100%;
                    min-height: 400px;
                    background-size: cover;
                    background-position: center;
                    border: 2px solid #444;
                    border-radius: 4px;
                    display: flex;
                    align-items: flex-end;
                    margin-bottom: 2rem;
                }
                .scene-content {
                    background: rgba(0, 0, 0, 0.85);
                    padding: 2rem;
                    width: 100%;
                    border-top: 1px solid #d4af37;
                }
                .scene-title {
                    color: #d4af37;
                    margin-bottom: 1rem;
                    font-family: 'Cinzel', serif;
                }
                .scene-text {
                    color: #e0e0e0;
                    white-space: pre-wrap;
                    font-size: 1.1rem;
                }
                .fade-in {
                    animation: fadeIn 0.8s ease-in-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default SceneView;
