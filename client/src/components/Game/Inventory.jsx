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
            <div className="inv-category">
                <h4>{title}</h4>
                <div className="inv-grid">
                    {items.map(item => (
                        <div key={item.id} className="inv-item">
                            <div className="inv-name">{item.name}</div>
                            <div className="inv-qty">x{item.quantity}</div>
                            {item.item_type === 'potion' && (
                                <button className="use-btn" onClick={() => useItem(item.id)}>Use</button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="inventory-panel">
            <h3 style={{ borderBottom: '1px solid #444', paddingBottom: '0.5rem' }}>Inventory</h3>
            {renderCategory('Weapons', grouped.weapon)}
            {renderCategory('Armor', grouped.armor)}
            {renderCategory('Potions', grouped.potion)}
            {renderCategory('Key Items', grouped.key)}
            {renderCategory('Misc', grouped.misc)}

            <style>{`
                .inventory-panel {
                    background: #222;
                    border: 1px solid #444;
                    padding: 1rem;
                    min-width: 250px;
                }
                .inv-category {
                    margin-top: 1rem;
                }
                .inv-category h4 {
                    font-size: 0.9rem;
                    color: #aaa;
                    margin-bottom: 0.5rem;
                }
                .inv-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #333;
                    padding: 0.5rem;
                    margin-bottom: 0.25rem;
                    font-size: 0.9rem;
                }
                .use-btn {
                    padding: 0.2rem 0.5rem;
                    font-size: 0.8rem;
                    margin-left: 0.5rem;
                }
            `}</style>
        </div>
    );
};

export default Inventory;
