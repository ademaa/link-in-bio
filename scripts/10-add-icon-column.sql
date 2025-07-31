-- Add icon column to links table
ALTER TABLE links ADD COLUMN IF NOT EXISTS icon TEXT;

-- Update existing links with default icons based on common patterns
UPDATE links 
SET icon = CASE 
  WHEN LOWER(title) LIKE '%twitter%' OR LOWER(url) LIKE '%twitter%' THEN 'twitter'
  WHEN LOWER(title) LIKE '%instagram%' OR LOWER(url) LIKE '%instagram%' THEN 'instagram'
  WHEN LOWER(title) LIKE '%facebook%' OR LOWER(url) LIKE '%facebook%' THEN 'facebook'
  WHEN LOWER(title) LIKE '%linkedin%' OR LOWER(url) LIKE '%linkedin%' THEN 'linkedin'
  WHEN LOWER(title) LIKE '%youtube%' OR LOWER(url) LIKE '%youtube%' THEN 'youtube'
  WHEN LOWER(title) LIKE '%github%' OR LOWER(url) LIKE '%github%' THEN 'github'
  WHEN LOWER(title) LIKE '%website%' OR LOWER(title) LIKE '%portfolio%' THEN 'website'
  WHEN LOWER(url) LIKE '%mailto:%' OR LOWER(title) LIKE '%email%' THEN 'email'
  WHEN LOWER(url) LIKE '%tel:%' OR LOWER(title) LIKE '%phone%' THEN 'phone'
  ELSE 'website'
END
WHERE icon IS NULL;
