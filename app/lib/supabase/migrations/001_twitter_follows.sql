-- Add Twitter OAuth token storage and follow verification
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS twitter_access_token TEXT,
ADD COLUMN IF NOT EXISTS twitter_token_expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS twitter_follows_verified BOOLEAN DEFAULT FALSE;

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_twitter_id ON users(twitter_id);
