BEGIN;

CREATE TYPE item_type AS ENUM ('weapon', 'armor', 'key', 'potion');

CREATE TABLE inventories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_save_id UUID NOT NULL REFERENCES game_saves(id) ON DELETE CASCADE,
    item_id VARCHAR(100) NOT NULL,
    item_type item_type NOT NULL,
    name VARCHAR(255) NOT NULL,
    stats JSONB NOT NULL DEFAULT '{}',
    equipped BOOLEAN NOT NULL DEFAULT FALSE,
    quantity INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX idx_inventories_game_save_id ON inventories (game_save_id);
CREATE INDEX idx_inventories_item_type ON inventories (item_type);

COMMIT;
