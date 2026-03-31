import React, { useState } from 'react';
import useGameState from '../../hooks/useGameState';

const ITEM_ICONS = {
    weapon: 'swords',
    armor: 'shield',
    potion: 'science',
    key: 'key',
    misc: 'category',
};

const TYPE_LABELS = {
    weapon: 'Оружие',
    armor: 'Броня',
    potion: 'Зелье',
    key: 'Ключ',
    misc: 'Прочее',
};

const Inventory = () => {
    const { inventory, useItem, equipItem } = useGameState();
    const [activeFilter, setActiveFilter] = useState('all');

    if (!inventory) return null;

    const filteredItems = activeFilter === 'all'
        ? inventory
        : inventory.filter(i => i.item_type === activeFilter);

    const handleEquip = async (item) => {
        await equipItem(item.item_id);
    };

    const handleUse = async (item) => {
        await useItem(item.item_id);
    };

    const renderItem = (item) => (
        <div key={item.id} className="bg-surface-container p-4 flex items-center gap-4 group hover:bg-surface-container-high transition-colors">
            <div className="w-16 h-16 bg-surface-container-highest flex items-center justify-center border border-outline-variant/30 relative">
                <span className="material-symbols-outlined text-primary text-3xl">
                    {ITEM_ICONS[item.item_type] || 'category'}
                </span>
                {item.equipped && (
                    <span className="absolute top-0 right-0 bg-primary text-on-primary text-[7px] px-1 font-bold">ЭК</span>
                )}
            </div>
            <div className="flex-grow">
                <h3 className="font-headline text-sm font-bold text-on-surface">{item.name}</h3>
                <p className="font-label text-[10px] text-on-surface-variant capitalize">{TYPE_LABELS[item.item_type] || item.item_type}</p>
                {item.stats && (
                    <p className="font-label text-[9px] text-primary mt-0.5">
                        {item.stats.damage ? `УРОН: ${item.stats.damage} ` : ''}
                        {item.stats.defense ? `ЗАЩИТА: ${item.stats.defense} ` : ''}
                        {item.stats.heal ? `ЛЕЧЕНИЕ: ${item.stats.heal}` : ''}
                    </p>
                )}
            </div>
            <div className="flex flex-col items-end gap-2">
                <span className="font-label font-bold text-on-surface-variant text-xs">x{item.quantity}</span>
                {item.item_type === 'potion' ? (
                    <button
                        className="text-[10px] text-primary font-bold hover:underline uppercase tracking-widest"
                        onClick={() => handleUse(item)}
                    >
                        Выпить
                    </button>
                ) : (item.item_type === 'weapon' || item.item_type === 'armor') ? (
                    <button
                        className={`text-[10px] px-3 py-1 font-bold uppercase tracking-widest border transition-all ${
                            item.equipped
                                ? 'border-primary bg-primary text-on-primary cursor-default'
                                : 'border-primary/50 text-primary hover:bg-primary hover:text-on-primary'
                        }`}
                        onClick={() => !item.equipped && handleEquip(item)}
                        disabled={item.equipped}
                    >
                        {item.equipped ? 'Надето' : 'Надеть'}
                    </button>
                ) : null}
            </div>
        </div>
    );

    const filters = [
        { key: 'all', label: 'Все' },
        { key: 'weapon', label: 'Оружие' },
        { key: 'armor', label: 'Броня' },
        { key: 'potion', label: 'Зелья' },
    ];

    return (
        <div className="flex flex-col gap-6 custom-scrollbar h-full">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
                <h2 className="font-headline text-2xl font-bold text-on-surface uppercase tracking-widest">Инвентарь</h2>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {filters.map(f => (
                    <button
                        key={f.key}
                        className={`px-4 py-2 font-label text-[10px] uppercase tracking-widest whitespace-nowrap transition-colors ${
                            activeFilter === f.key
                                ? 'bg-surface-container-highest text-primary border-b-2 border-primary'
                                : 'hover:bg-surface-container-highest text-on-surface-variant'
                        }`}
                        onClick={() => setActiveFilter(f.key)}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            <div className="flex flex-col gap-3">
                {filteredItems.length === 0 ? (
                    <p className="font-label text-sm text-on-surface-variant italic text-center py-8">В этой категории пусто</p>
                ) : (
                    filteredItems.map(item => renderItem(item))
                )}
            </div>

            <div className="mt-auto pt-6 border-t border-outline-variant/10">
                <div className="flex justify-between items-end mb-2">
                    <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Предметы</span>
                    <span className="font-label text-[10px] text-on-surface">{inventory.length} всего</span>
                </div>
            </div>
        </div>
    );
};

export default Inventory;
