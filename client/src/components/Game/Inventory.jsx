import React from 'react';
import useGameState from '../../hooks/useGameState';

const Inventory = () => {
    const { inventory, useItem } = useGameState();

    if (!inventory) return null;

    const grouped = {
        weapon: inventory.filter(i => i.item_type === 'weapon'),
        armor: inventory.filter(i => i.item_type === 'armor'),
        potion: inventory.filter(i => i.item_type === 'potion'),
        key: inventory.filter(i => i.item_type === 'key'),
        misc: inventory.filter(i => !['weapon', 'armor', 'potion', 'key'].includes(i.item_type))
    };

    const renderCategory = (title, items) => {
        if (items.length === 0) return null;
        return (
            <div>
                <div className="inv-category-title">{title}</div>
                <div>
                    {items.map(item => (
                        <div key={item.id} className="inv-item">
                            <span className="inv-item-name">{item.name}</span>
                            <span className="inv-item-qty">x{item.quantity}</span>
                            {item.item_type === 'potion' && (
                                <button
                                    className="inv-use-btn"
                                    onClick={() => useItem(item.id)}
                                >
                                    Use
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="inventory-panel">
            <h3 className="inventory-title">Inventory</h3>
            {renderCategory('Weapons', grouped.weapon)}
            {renderCategory('Armor', grouped.armor)}
            {renderCategory('Potions', grouped.potion)}
            {renderCategory('Key Items', grouped.key)}
            {renderCategory('Misc', grouped.misc)}
        </div>
    );
};

export default Inventory;
