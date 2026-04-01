import React, { useEffect, useState } from 'react';
import useGameState from '../hooks/useGameState';
import GameHUD from '../components/Game/GameHUD';
import SceneView from '../components/Game/SceneView';
import ChoiceList from '../components/Game/ChoiceList';
import Inventory from '../components/Game/Inventory';
import RandomEventModal from '../components/Game/RandomEventModal';
import audioManager from '../services/AudioManager';

const GamePage = () => {
    const { fetchState, gameState, currentScene, loading, error } = useGameState();
    const [isInventoryOpen, setIsInventoryOpen] = useState(false);

    useEffect(() => {
        fetchState();
    }, []);

    useEffect(() => {
        if (currentScene?.music) {
            audioManager.play(currentScene.music);
        }
        return () => {};
    }, [currentScene?.music]);

    useEffect(() => {
        return () => {
            // keep music playing
        };
    }, []);

    if (loading && !gameState) {
        return (
            <div className="min-h-[100dvh] bg-background flex items-center justify-center font-headline text-primary italic">
                Собираемся в путь...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center gap-4">
                <span className="font-headline text-secondary text-2xl">Путь заблокирован</span>
                <span className="text-on-surface-variant italic">{error}</span>
                <button className="px-6 py-2 border border-primary text-primary hover:bg-primary hover:text-on-primary transition-all" onClick={fetchState}>Повторить</button>
            </div>
        );
    }

    return (
        <div className="min-h-[100dvh] bg-background text-on-surface selection:bg-primary/30 selection:text-primary overflow-x-hidden">
            <GameHUD onToggleInventory={() => setIsInventoryOpen(prev => !prev)} />

            <main className="pb-24 grid grid-cols-1 xl:grid-cols-12 gap-0 relative">
                <div className={`xl:col-span-8 p-6 md:p-10 flex flex-col gap-8 transition-opacity duration-300 ${isInventoryOpen ? 'opacity-50 xl:opacity-100' : 'opacity-100'}`}>
                    <SceneView scene={currentScene} />
                    <ChoiceList />
                </div>

                <aside className={`fixed top-0 right-0 h-full w-80 xl:w-auto xl:relative xl:col-span-4 bg-surface-container-low p-6 flex flex-col gap-6 border-l border-outline-variant/10 shadow-2xl z-40 transition-transform duration-300 transform 
                    ${isInventoryOpen ? 'translate-x-0' : 'translate-x-full xl:translate-x-0'}`}>
                    <Inventory />
                </aside>

                {isInventoryOpen && (
                    <div
                        className="fixed inset-0 bg-black/60 z-30 xl:hidden backdrop-blur-sm"
                        onClick={() => setIsInventoryOpen(false)}
                    />
                )}
            </main>

            <RandomEventModal />

            <footer className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-8 pb-4 bg-[#131313]/90 backdrop-blur-md h-24 border-t border-[#4d4635]/30 shadow-[0_-10px_40px_rgba(0,0,0,0.7)] font-['Inter'] text-[10px] font-bold uppercase md:hidden">
                <div className="flex flex-col items-center justify-center text-[#e5e2e1]/30" onClick={() => setIsInventoryOpen(true)}>
                    <span className="material-symbols-outlined mb-1">backpack</span>
                    <span>Инвентарь</span>
                </div>
                <div className="flex flex-col items-center justify-center text-[#f1c97d] scale-110 drop-shadow-[0_0_10px_rgba(241,201,125,0.5)]">
                    <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>article</span>
                    <span>Задания</span>
                </div>
            </footer>
        </div>
    );
};

export default GamePage;
