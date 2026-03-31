import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as gameApi from '../api/game.api';

const ITEM_ICONS = {
    weapon: 'swords',
    armor: 'shield',
    potion: 'science',
};

const TYPE_LABELS = {
    weapon: 'Оружие',
    armor: 'Броня',
    potion: 'Зелье',
};

const ShopPage = () => {
    const navigate = useNavigate();
    const [shopItems, setShopItems] = useState([]);
    const [gold, setGold] = useState(0);
    const [loading, setLoading] = useState(true);
    const [buyingId, setBuyingId] = useState(null);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const fetchShop = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await gameApi.getShop();
            setShopItems(response.data.items);
            setGold(response.data.gold);
        } catch (err) {
            setError('Не удалось загрузить лавку');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShop();
    }, []);

    const handleBuy = async (itemId) => {
        setBuyingId(itemId);
        setMessage(null);
        try {
            const response = await gameApi.buyShopItem(itemId);
            setGold(response.data.remainingGold);
            setMessage(`Куплено: ${response.data.item.name}!`);
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            const errMsg = err.response?.data?.message || 'Покупка не удалась';
            setMessage(errMsg);
            setTimeout(() => setMessage(null), 3000);
        } finally {
            setBuyingId(null);
        }
    };

    const handleRefresh = () => {
        fetchShop();
    };

    return (
        <div className="min-h-screen relative text-on-surface">
            <div
                className="fixed inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/backgrounds/tavern.png')" }}
            ></div>
            <div className="fixed inset-0 bg-gradient-to-b from-[#0e0e0e]/80 via-[#131313]/70 to-[#0e0e0e]/90"></div>

            <div className="relative z-10 min-h-screen flex flex-col">
                <header className="flex justify-between items-center px-6 h-20 bg-[#131313]/80 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                    <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-[#D4AF37] tracking-tighter uppercase font-['Noto_Serif']">Ведьмак</span>
                        <span className="text-sm font-bold text-[#d0c5af] tracking-tight uppercase font-['Noto_Serif']">Путь Геральта</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 mr-4">
                            <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
                            <span className="font-label font-bold text-on-surface">{gold.toLocaleString()} <span className="text-[10px] text-on-surface-variant uppercase ml-1">крон</span></span>
                        </div>
                        <button
                            className="px-4 py-2 border border-outline-variant text-on-surface-variant font-label text-[10px] uppercase tracking-widest hover:border-primary hover:text-primary transition-all"
                            onClick={() => navigate('/game')}
                        >
                            Вернуться в Игру
                        </button>
                    </div>
                </header>

                <div className="flex-grow flex flex-col items-center px-6 py-10">
                    <div className="max-w-5xl w-full">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="font-headline text-4xl text-primary tracking-tight mb-1">Лавка</h1>
                                <p className="font-body text-on-surface-variant italic">Товары странствующих торговцев</p>
                            </div>
                            <button
                                className="flex items-center gap-2 px-5 py-3 bg-surface-container-high border border-outline-variant/30 text-on-surface font-label text-xs uppercase tracking-widest hover:border-primary hover:text-primary transition-all group"
                                onClick={handleRefresh}
                                disabled={loading}
                            >
                                <span className="material-symbols-outlined text-primary group-hover:rotate-180 transition-transform duration-500">refresh</span>
                                Обновить Товар
                            </button>
                        </div>

                        {message && (
                            <div className="mb-6 px-6 py-3 bg-primary-container/20 border border-primary/30 text-primary font-label text-sm text-center">
                                {message}
                            </div>
                        )}

                        {error && (
                            <div className="mb-6 px-6 py-3 bg-error-container/20 border border-error/30 text-error font-label text-sm text-center">
                                {error}
                            </div>
                        )}

                        {loading ? (
                            <div className="flex items-center justify-center py-20 font-headline text-on-surface-variant italic text-lg">
                                Проверяем запасы торговца...
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {shopItems.map((item) => (
                                    <div
                                        key={item.item_id}
                                        className="bg-surface-container-low/80 backdrop-blur-sm border border-outline-variant/20 p-6 flex flex-col gap-4 hover:border-primary/30 transition-all group"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="w-14 h-14 bg-surface-container-highest flex items-center justify-center border border-outline-variant/30">
                                                <span className="material-symbols-outlined text-primary text-2xl">
                                                    {ITEM_ICONS[item.item_type] || 'category'}
                                                </span>
                                            </div>
                                            <span className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant px-2 py-1 bg-surface-container-high">
                                                {TYPE_LABELS[item.item_type] || item.item_type}
                                            </span>
                                        </div>

                                        <div>
                                            <h3 className="font-headline text-lg font-bold text-on-surface group-hover:text-primary transition-colors">{item.name}</h3>
                                            <p className="font-body text-sm text-on-surface-variant mt-1">{item.description}</p>
                                        </div>

                                        <div className="flex items-center gap-2 text-primary font-label text-[10px] uppercase">
                                            {item.stats.damage && <span>УРОН: {item.stats.damage}</span>}
                                            {item.stats.defense && <span>ЗАЩИТА: {item.stats.defense}</span>}
                                            {item.stats.heal && <span>ЛЕЧЕНИЕ: {item.stats.heal}</span>}
                                            {item.stats.damage_boost && <span>УСИЛЕНИЕ: x{item.stats.damage_boost}</span>}
                                        </div>

                                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-outline-variant/10">
                                            <div className="flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
                                                <span className="font-label font-bold text-on-surface">{item.price}</span>
                                                <span className="font-label text-[9px] text-on-surface-variant uppercase">крон</span>
                                            </div>
                                            <button
                                                className={`px-4 py-2 font-label text-[10px] font-bold uppercase tracking-widest border transition-all ${
                                                    gold >= item.price
                                                        ? 'border-primary/50 text-primary hover:bg-primary hover:text-on-primary'
                                                        : 'border-outline-variant/30 text-on-surface-variant cursor-not-allowed opacity-50'
                                                }`}
                                                onClick={() => handleBuy(item.item_id)}
                                                disabled={buyingId === item.item_id || gold < item.price}
                                            >
                                                {buyingId === item.item_id ? 'Покупка...' : gold >= item.price ? 'Купить' : 'Не хватает'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopPage;
