BEGIN;

CREATE TABLE leaderboard (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_xp INTEGER NOT NULL DEFAULT 0,
    level INTEGER NOT NULL DEFAULT 1,
    branch branch_type NOT NULL,
    scenes_visited INTEGER NOT NULL DEFAULT 0,
    battles_won INTEGER NOT NULL DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leaderboard_user_id ON leaderboard (user_id);
CREATE INDEX idx_leaderboard_total_xp_desc ON leaderboard (total_xp DESC);

COMMIT;
