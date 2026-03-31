import React from 'react';
import { useNavigate } from 'react-router-dom';
import useGameState from '../../hooks/useGameState';

const CHOICE_ICONS = {
    'combat': 'swords',
    'diplomacy': 'forum',
    'magic': 'magic_button',
    'investigation': 'liquor',
    'default': 'arrow_forward'
};

const CHOICE_BORDERS = {
    'combat': 'border-secondary-container hover:border-secondary',
    'diplomacy': 'border-primary-container hover:border-primary',
    'magic': 'border-primary-container hover:border-primary',
    'default': 'border-outline-variant hover:border-primary'
};

const CHOICE_TEXT_COLORS = {
    'combat': 'group-hover:text-secondary',
    'diplomacy': 'group-hover:text-primary',
    'magic': 'group-hover:text-primary',
    'default': 'group-hover:text-primary'
};

const TYPE_LABELS = {
    'combat': 'Бой',
    'diplomacy': 'Дипломатия',
    'magic': 'Магия',
    'investigation': 'Исследование',
    'default': 'Действие',
};

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
            {currentScene.choices.map((choice, index) => {
                const type = choice.type || 'default';
                const icon = CHOICE_ICONS[type] || CHOICE_ICONS.default;
                const borderClass = CHOICE_BORDERS[type] || CHOICE_BORDERS.default;
                const hoverTextClass = CHOICE_TEXT_COLORS[type] || CHOICE_TEXT_COLORS.default;
                const typeLabel = TYPE_LABELS[type] || TYPE_LABELS.default;

                return (
                    <button
                        key={choice.id}
                        className={`group relative flex items-center justify-between p-5 bg-surface-container-highest border-l-4 ${borderClass} transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed`}
                        onClick={() => handleChoice(choice.id)}
                        disabled={loading}
                    >
                        <div className="flex flex-col text-left">
                            <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                                {typeLabel}
                            </span>
                            <span className={`font-headline text-lg font-bold text-on-surface ${hoverTextClass}`}>
                                {choice.label}
                            </span>
                        </div>
                        <span className={`material-symbols-outlined ${type === 'combat' ? 'text-secondary' : 'text-primary'} opacity-0 group-hover:opacity-100 transition-opacity`}>
                            {icon}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default ChoiceList;
