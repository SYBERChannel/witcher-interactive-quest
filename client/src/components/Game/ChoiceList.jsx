import React from 'react';
import { useNavigate } from 'react-router-dom';
import useGameState from '../../hooks/useGameState';

const ChoiceList = () => {
    const { currentScene, submitChoice, loading } = useGameState();
    const navigate = useNavigate();

    if (!currentScene?.choices || currentScene.choices.length === 0) return null;

    const handleChoice = async (choiceId) => {
        const result = await submitChoice(choiceId);
        if (!result) return;

        if (result.leadsToBattle) {
            navigate(`/battle/${result.leadsToBattle}`);
        } else if (result.isEnding) {
            navigate('/ending');
        }
    };

    return (
        <div className="choice-list">
            {currentScene.choices.map((choice, index) => (
                <button
                    key={choice.id}
                    className="choice-btn"
                    onClick={() => handleChoice(choice.id)}
                    disabled={loading}
                    style={{ animationDelay: `${index * 0.08}s` }}
                >
                    <span className="choice-marker">{String.fromCharCode(9670)}</span>
                    <span className="choice-text">{choice.label}</span>
                </button>
            ))}
        </div>
    );
};

export default ChoiceList;
