BEGIN;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_game_saves_updated_at
BEFORE UPDATE ON game_saves
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

COMMIT;
