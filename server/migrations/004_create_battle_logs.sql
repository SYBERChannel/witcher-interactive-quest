BEGIN;

CREATE TYPE battle_result AS ENUM ('won', 'lost');

CREATE TABLE battle_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_save_id UUID NOT NULL REFERENCES game_saves(id) ON DELETE CASCADE,
    battle_id VARCHAR(100) NOT NULL,
    enemy_name VARCHAR(255) NOT NULL,
    rounds JSONB NOT NULL DEFAULT '[]',
    result battle_result NOT NULL,
    xp_gained INTEGER NOT NULL DEFAULT 0,
    loot JSONB NOT NULL DEFAULT '[]',
    fought_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_battle_logs_game_save_id ON battle_logs (game_save_id);

COMMIT;
