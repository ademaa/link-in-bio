-- Add missing order_index column to links table
ALTER TABLE links ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- Update existing links to have proper order
UPDATE links 
SET order_index = row_number() OVER (PARTITION BY user_id ORDER BY created_at) - 1
WHERE order_index IS NULL OR order_index = 0;
