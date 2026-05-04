-- I am adding the ai_description column to store AI-generated text for each risk record.
ALTER TABLE risk_items ADD COLUMN IF NOT EXISTS ai_description TEXT;
COMMENT ON COLUMN risk_items.ai_description IS 'AI-generated description, populated asynchronously on record creation.';
