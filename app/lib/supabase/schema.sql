CREATE TABLE IF NOT EXISTS users (
  wallet_address           TEXT PRIMARY KEY,
  twitter_username         TEXT,
  twitter_id               TEXT,
  twitter_access_token     TEXT,
  twitter_token_expires_at TIMESTAMPTZ,
  twitter_follows_verified BOOLEAN DEFAULT FALSE,
  discord_id               TEXT,
  discord_username         TEXT,
  is_holder                BOOLEAN DEFAULT FALSE,
  referral_code            TEXT UNIQUE,
  referred_by              TEXT REFERENCES users(wallet_address),
  status                   TEXT DEFAULT 'waitlisted' CHECK (status IN ('waitlisted', 'queued', 'upgraded')),
  created_at               TIMESTAMPTZ DEFAULT NOW(),
  updated_at               TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS referrals (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_wallet TEXT REFERENCES users(wallet_address),
  referred_wallet TEXT REFERENCES users(wallet_address),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pending_registrations (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT REFERENCES users(wallet_address),
  signature      TEXT NOT NULL,
  message        TEXT NOT NULL,
  status         TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'confirmed', 'failed')),
  tx_hash        TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  processed_at   TIMESTAMPTZ
);

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select" ON users FOR SELECT USING (true);
CREATE POLICY "users_insert" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "users_update" ON users FOR UPDATE USING (true);
CREATE POLICY "referrals_select" ON referrals FOR SELECT USING (true);
CREATE POLICY "referrals_insert" ON referrals FOR INSERT WITH CHECK (true);
CREATE POLICY "pending_select" ON pending_registrations FOR SELECT USING (true);
CREATE POLICY "pending_insert" ON pending_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "pending_update" ON pending_registrations FOR UPDATE USING (true);
