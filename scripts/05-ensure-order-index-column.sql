-- Ensure the order_index column exists in the links table
DO $$ 
BEGIN
    -- Check if order_index column exists, if not add it
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'links' 
        AND column_name = 'order_index'
    ) THEN
        ALTER TABLE links ADD COLUMN order_index INTEGER DEFAULT 0;
        
        -- Update existing records to have proper order based on creation time
        UPDATE links 
        SET order_index = subquery.row_num - 1
        FROM (
            SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at) as row_num
            FROM links
        ) AS subquery
        WHERE links.id = subquery.id;
        
        -- Create an index for better performance
        CREATE INDEX IF NOT EXISTS idx_links_user_order ON links(user_id, order_index);
    END IF;
END $$;
