# Структура проекта «Ведьмак: Путь Геральта»

> Строго по [architecture.md](file:///C:/Users/%D0%92%D0%B0%D0%BB%D0%B5%D1%80%D0%B8%D0%B9/.gemini/antigravity/brain/62cd0142-1a9e-4be0-a574-8e58bcee1295/architecture.md) и [GEMINI.md](file:///C:/Users/%D0%92%D0%B0%D0%BB%D0%B5%D1%80%D0%B8%D0%B9/.gemini/GEMINI.md).

---

## 1. Backend (`server/`)

```
server/
├── index.js                          — Точка входа: Express app, подключение middleware, монтирование routes
│
├── config/
│   ├── db.js                         — Подключение к PostgreSQL (pool / client)
│   ├── jwt.js                        — JWT secret, TTL access (15m) и refresh (7d)
│   └── cors.js                       — Настройка CORS (allowed origins, credentials)
│
├── middleware/
│   ├── authGuard.js                  — Верификация access token, прикрепление req.user
│   ├── errorHandler.js               — Централизованная обработка ошибок (JSON-ответ)
│   └── rateLimiter.js                — Ограничение запросов (express-rate-limit)
│
├── routes/
│   ├── auth.routes.js                — POST register, login, refresh, logout
│   ├── game.routes.js                — POST new, choice, use-item; GET state, scene, inventory
│   ├── battle.routes.js              — GET /:id; POST /:id/action
│   └── leaderboard.routes.js         — GET / (публичный); POST /submit (за authGuard)
│
├── controllers/
│   ├── auth.controller.js            — Тонкий контроллер: валидация входа → вызов сервисов → ответ
│   ├── game.controller.js            — Тонкий контроллер: делегирование в SceneEngine / InventoryService
│   ├── battle.controller.js          — Тонкий контроллер: делегирование в BattleEngine
│   └── leaderboard.controller.js     — Тонкий контроллер: запись и чтение leaderboard
│
├── services/
│   ├── SceneEngine.js                — Загрузка сцены, валидация выбора, применение effects, переход
│   ├── BattleEngine.js               — Расчёт раунда, AI врага, определение исхода
│   ├── RandomEventEngine.js          — Бросок вероятности, фильтрация пула, предотвращение повторов
│   └── InventoryService.js           — CRUD инвентаря, экипировка, проверка наличия предмета
│
├── models/
│   ├── User.js                       — SQL-запросы к таблице users
│   ├── GameSave.js                   — SQL-запросы к таблице game_saves
│   ├── Inventory.js                  — SQL-запросы к таблице inventories
│   ├── BattleLog.js                  — SQL-запросы к таблице battle_logs
│   └── Leaderboard.js                — SQL-запросы к таблице leaderboard
│
├── validators/
│   ├── auth.validator.js             — Схемы: register, login (express-validator / Joi)
│   ├── game.validator.js             — Схемы: choice, use-item
│   └── battle.validator.js           — Схемы: battle action
│
├── data/
│   ├── scenes/
│   │   ├── prologue.json             — Сцены пролога (neutral ветка)
│   │   ├── act1_good.json            — Сцены 1 акта (good ветка)
│   │   ├── act1_bad.json             — Сцены 1 акта (bad ветка)
│   │   ├── act2_good.json            — Сцены 2 акта (good ветка)
│   │   ├── act2_bad.json             — Сцены 2 акта (bad ветка)
│   │   └── finale.json               — Финальные сцены (оба финала)
│   ├── enemies/
│   │   └── enemies.json              — Справочник врагов: имя, HP, attack, defense, AI-weights, loot table
│   └── events/
│       └── random_events.json        — Справочник random events: id, type, effects, conditions
│
├── migrations/
│   ├── 001_create_users.sql          — Таблица users (id, username, email, password_hash, refresh_token)
│   ├── 002_create_game_saves.sql     — Таблица game_saves (состояние игры, JSONB flags/choices)
│   ├── 003_create_inventories.sql    — Таблица inventories (предметы, stats JSONB, equipped)
│   ├── 004_create_battle_logs.sql    — Таблица battle_logs (раунды JSONB, результат, лут)
│   ├── 005_create_leaderboard.sql    — Таблица leaderboard (xp, level, branch, completed_at)
│   └── 006_create_indexes.sql        — Индексы: user_id FK, leaderboard по xp DESC
│
├── utils/
│   ├── token.js                      — Генерация / верификация JWT, хеширование refresh token
│   ├── password.js                   — bcrypt hash / compare
│   └── AppError.js                   — Кастомный класс ошибки (statusCode, message)
│
├── package.json                      — Зависимости backend
└── .env.example                      — Шаблон переменных окружения (без секретов)
```

---

## 2. Frontend (`client/`)

```
client/
├── index.html                        — HTML entry point (SPA shell)
├── vite.config.js                    — Конфигурация Vite (proxy → backend, alias)
├── package.json                      — Зависимости frontend
│
├── public/
│   ├── audio/
│   │   ├── kaer_morhen_theme.mp3     — Трек: главное меню / Каэр Морхен
│   │   ├── wild_hunt_theme.mp3       — Трек: ветка злодеев / Дикая Охота
│   │   ├── tavern.mp3                — Трек: таверна / мирные сцены
│   │   ├── forest_ambient.mp3        — Трек: лесные / болотные сцены
│   │   ├── battle_theme.mp3          — Трек: боевые сцены
│   │   └── ending.mp3               — Трек: финал
│   ├── sprites/
│   │   ├── geralt/                   — Спрайты / Lottie-анимации Геральта (slash, parry, igni, potion)
│   │   └── enemies/                  — Спрайты врагов (drowner, griffin, wild_hunt_warrior и т.д.)
│   └── backgrounds/
│       ├── kaer_morhen.jpg           — Фон: Каэр Морхен
│       ├── swamp.jpg                 — Фон: болота
│       ├── forest.jpg                — Фон: темнолесье
│       ├── novigrad.jpg              — Фон: город
│       └── wild_hunt_fortress.jpg    — Фон: крепость Дикой Охоты
│
└── src/
    ├── main.jsx                      — Точка входа React: рендер <App/>, провайдеры
    ├── App.jsx                       — React Router: маршруты, AudioProvider, ProtectedRoute
    ├── App.css                       — Глобальные стили, CSS-переменные, анимации
    │
    ├── api/
    │   ├── axios.js                  — Инстанс Axios: baseURL, interceptors (token inject, 401 refresh)
    │   ├── auth.api.js               — register(), login(), refresh(), logout()
    │   ├── game.api.js               — newGame(), getState(), getScene(), makeChoice(), getInventory(), useItem()
    │   ├── battle.api.js             — getBattle(), sendAction()
    │   └── leaderboard.api.js        — getLeaderboard()
    │
    ├── store/
    │   ├── authStore.js              — Zustand: user, accessToken, isAuthenticated, login/logout actions
    │   ├── gameStore.js              — Zustand: gameState, scene, inventory (read-only кэш с сервера)
    │   └── battleStore.js            — Zustand: battleData, rounds, isBattleActive, animation queue
    │
    ├── hooks/
    │   ├── useAuth.js                — Обёртка над authStore + API: login, register, auto-refresh
    │   ├── useGameState.js           — Обёртка над gameStore + API: loadScene, makeChoice, loadInventory
    │   ├── useAudio.js               — Доступ к AudioManager context: play, stop, setVolume, crossfade
    │   └── useBattle.js              — Обёртка над battleStore + API: startBattle, sendAction, animation sync
    │
    ├── context/
    │   └── AudioContext.jsx          — AudioManager singleton через React Context + Provider
    │
    ├── components/
    │   ├── Auth/
    │   │   ├── LoginForm.jsx         — Форма логина
    │   │   ├── LoginForm.css         — Стили формы логина
    │   │   ├── RegisterForm.jsx      — Форма регистрации
    │   │   └── RegisterForm.css      — Стили формы регистрации
    │   │
    │   ├── Scene/
    │   │   ├── SceneView.jsx         — Отображение текущей сцены: фон, текст, музыка, choices
    │   │   ├── SceneView.css         — Стили сцены (фон, типографика, анимация появления)
    │   │   ├── ChoiceList.jsx        — Список вариантов выбора (кнопки)
    │   │   ├── ChoiceList.css        — Стили списка выборов
    │   │   ├── RandomEventModal.jsx  — Модальное окно случайного события
    │   │   └── RandomEventModal.css  — Стили модала случайного события
    │   │
    │   ├── Battle/
    │   │   ├── BattleArena.jsx       — Арена боя: враг и Геральт, анимации раундов (Framer Motion)
    │   │   ├── BattleArena.css       — Стили арены (расположение спрайтов, эффекты)
    │   │   ├── BattleHUD.jsx         — HUD: HP-бары, кнопки действий (attack, parry, sign, potion)
    │   │   ├── BattleHUD.css         — Стили HUD
    │   │   ├── BattleResult.jsx      — Экран результата боя: победа / поражение, xp, лут
    │   │   └── BattleResult.css      — Стили экрана результата
    │   │
    │   ├── Inventory/
    │   │   ├── InventoryPanel.jsx    — Боковая панель инвентаря
    │   │   ├── InventoryPanel.css    — Стили панели
    │   │   ├── ItemCard.jsx          — Карточка предмета (иконка, название, stats)
    │   │   └── ItemCard.css          — Стили карточки
    │   │
    │   ├── Leaderboard/
    │   │   ├── LeaderboardTable.jsx  — Таблица топ-100 (username, xp, level, branch)
    │   │   └── LeaderboardTable.css  — Стили таблицы
    │   │
    │   ├── HUD/
    │   │   ├── GameHUD.jsx           — Игровой HUD: HP, XP, Gold, уровень, кнопка инвентаря
    │   │   └── GameHUD.css           — Стили игрового HUD
    │   │
    │   └── UI/
    │       ├── ProtectedRoute.jsx    — Route guard: перенаправление неавторизованных на /login
    │       ├── Loader.jsx            — Спиннер загрузки
    │       ├── Loader.css            — Стили спиннера
    │       ├── ErrorMessage.jsx      — Блок ошибки (retry кнопка)
    │       └── ErrorMessage.css      — Стили блока ошибки
    │
    ├── pages/
    │   ├── MainMenuPage.jsx          — Главное меню: «Новая игра», «Продолжить», «Таблица лидеров»
    │   ├── MainMenuPage.css          — Стили главного меню
    │   ├── LoginPage.jsx             — Страница логина (монтирует LoginForm)
    │   ├── LoginPage.css             — Стили страницы логина
    │   ├── RegisterPage.jsx          — Страница регистрации (монтирует RegisterForm)
    │   ├── RegisterPage.css          — Стили страницы регистрации
    │   ├── GamePage.jsx              — Основная игровая страница: SceneView + GameHUD + InventoryPanel
    │   ├── GamePage.css              — Стили игровой страницы (layout)
    │   ├── BattlePage.jsx            — Страница боя: BattleArena + BattleHUD
    │   ├── BattlePage.css            — Стили страницы боя
    │   ├── LeaderboardPage.jsx       — Страница таблицы лидеров
    │   ├── LeaderboardPage.css       — Стили страницы лидеров
    │   ├── EndingPage.jsx            — Страница финала: итоги, ветка, ранг
    │   └── EndingPage.css            — Стили финальной страницы
    │
    └── utils/
        ├── constants.js              — Константы: API_BASE_URL, ITEM_TYPES, ACTION_TYPES, BRANCHES
        └── helpers.js                — Хелперы: formatXP(), getAnimationByKey(), calcHPPercent()
```

---

## 3. Shared / Root files

```
web-quest/                            — Корень проекта
├── client/                           — Frontend (см. раздел 2)
├── server/                           — Backend (см. раздел 1)
│
├── .env                              — Переменные окружения (НЕ коммитится)
├── .env.example                      — Шаблон .env (PUBLIC, без секретов)
├── .gitignore                        — node_modules, .env, dist, *.log
├── docker-compose.yml                — Сервисы: postgres, server, client
├── Dockerfile.server                 — Docker-образ backend (Node)
├── Dockerfile.client                 — Docker-образ frontend (Vite build → nginx)
├── README.md                         — Документация: установка, запуск, переменные окружения
└── architecture.md                   — Архитектурный документ (этот файл)
```

---

## Маршруты React Router

| Путь | Страница | Guard |
|------|----------|-------|
| `/login` | LoginPage | — |
| `/register` | RegisterPage | — |
| `/` | MainMenuPage | ProtectedRoute |
| `/game` | GamePage | ProtectedRoute |
| `/battle/:id` | BattlePage | ProtectedRoute |
| `/leaderboard` | LeaderboardPage | — |
| `/ending` | EndingPage | ProtectedRoute |

---

## Переменные .env

```
# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=witcher_quest
DB_USER=postgres
DB_PASSWORD=

# JWT
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Server
PORT=3001
NODE_ENV=development

# Client
VITE_API_BASE_URL=http://localhost:3001/api
```
