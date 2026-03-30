BEGIN;

CREATE TYPE branch_type AS ENUM ('good', 'bad', 'neutral');

CREATE TABLE game_saves (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    current_scene_id VARCHAR(100) NOT NULL DEFAULT 'prologue_01',
    branch branch_type NOT NULL DEFAULT 'neutral',
    flags JSONB NOT NULL DEFAULT '{}',
    hp INTEGER NOT NULL DEFAULT 100,
    max_hp INTEGER NOT NULL DEFAULT 100,
    xp INTEGER NOT NULL DEFAULT 0,
    level INTEGER NOT NULL DEFAULT 1,
    gold INTEGER NOT NULL DEFAULT 50,
    battle_count INTEGER NOT NULL DEFAULT 0,
    choices_made JSONB NOT NULL DEFAULT '[]',
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_game_saves_user_id ON game_saves (user_id);

COMMIT;
