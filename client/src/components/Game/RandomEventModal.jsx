import React from 'react';
import useGameState from '../../hooks/useGameState';

const RandomEventModal = () => {
    const { activeEvent, handleEvent } = useGameState();

    if (!activeEvent) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h3 className="event-title">{activeEvent.title}</h3>
                <p className="event-text">{activeEvent.text}</p>

                <div className="event-effects">
                    {/* Show effects if needed, based on payload */}
                </div>

                <div className="event-choices">
                    {activeEvent.choices ? (
                        activeEvent.choices.map((choice) => (
                            <button
                                key={choice.id}
                                className="event-btn"
                                onClick={() => handleEvent({ choiceId: choice.id })}
                            >
                                {choice.label}
                            </button>
                        ))
                    ) : (
                        <button
                            className="event-btn"
                            onClick={() => handleEvent({ action: 'dismiss' })}
                        >
                            Continue
                        </button>
                    )}
                </div>
            </div>

            <style>{`
                .modal-backdrop {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(5px);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }
                .modal-content {
                    background: #2a2a2a;
                    border: 2px solid #cd5c5c;
                    padding: 2rem;
                    max-width: 500px;
                    width: 90%;
                    box-shadow: 0 0 20px rgba(0,0,0,0.5);
                    text-align: center;
                }
                .event-title {
                    color: #cd5c5c;
                    font-family: 'Cinzel', serif;
                    font-size: 1.5rem;
                    margin-bottom: 1rem;
                }
                .event-text {
                    color: #ddd;
                    margin-bottom: 2rem;
                }
                .event-choices {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .event-btn {
                    background: #444;
                    color: white;
                    border: 1px solid #666;
                    padding: 0.8rem;
                }
                .event-btn:hover {
                    background: #555;
                    border-color: #cd5c5c;
                }
            `}</style>
        </div>
    );
};

export default RandomEventModal;
