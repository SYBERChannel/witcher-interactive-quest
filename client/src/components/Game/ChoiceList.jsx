import React from 'react';
import useGameState from '../../hooks/useGameState';

const ChoiceList = () => {
    const { currentScene, submitChoice, loading } = useGameState();

    if (!currentScene?.choices) return null;

    return (
        <div className="choice-list">
            {currentScene.choices.map((choice) => (
                <button
                    key={choice.id}
                    className="choice-btn"
                    onClick={() => submitChoice(choice.id)}
                    disabled={loading}
                >
                    {choice.label}
                </button>
            ))}

            <style>{`
                .choice-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    max-width: 600px;
                    margin: 0 auto;
                }
                .choice-btn {
                    background: transparent;
                    border: 1px solid #d4af37;
                    color: #d4af37;
                    padding: 1rem;
                    font-size: 1.1rem;
                    transition: all 0.3s ease;
                    text-align: left;
                }
                .choice-btn:hover:not(:disabled) {
                    background: rgba(212, 175, 55, 0.1);
                    transform: translateX(5px);
                }
                .choice-btn:disabled {
                    border-color: #555;
                    color: #555;
                }
            `}</style>
        </div>
    );
};

export default ChoiceList;
