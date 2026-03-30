BEGIN;

CREATE INDEX IF NOT EXISTS idx_game_saves_current_scene ON game_saves (current_scene_id);
CREATE INDEX IF NOT EXISTS idx_game_saves_branch ON game_saves (branch);
CREATE INDEX IF NOT EXISTS idx_inventories_equipped ON inventories (game_save_id) WHERE equipped = TRUE;
CREATE INDEX IF NOT EXISTS idx_battle_logs_battle_id ON battle_logs (battle_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_completed_at ON leaderboard (completed_at DESC);

COMMIT;
