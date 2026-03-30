import React from 'react';
import useGameState from '../../hooks/useGameState';

const RandomEventModal = () => {
    const { activeEvent, handleEvent } = useGameState();

    if (!activeEvent) return null;

    return (
        <div className="stitch-modal-backdrop">
            <div className="stitch-modal">
                <div className="event-modal-type">{activeEvent.type || 'Event'}</div>
                <h3 className="event-modal-title">{activeEvent.title}</h3>
                <p className="event-modal-text">{activeEvent.text}</p>

                <div className="event-modal-choices">
                    <button
                        className="btn-primary"
                        onClick={() => handleEvent()}
                        style={{ width: '100%' }}
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RandomEventModal;
