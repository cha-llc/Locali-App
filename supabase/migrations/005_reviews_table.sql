-- ============================================================================
-- REVIEWS TABLE (Card #15)
-- ============================================================================

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  is_flagged BOOLEAN DEFAULT FALSE,
  flag_reason VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public can read non-flagged reviews
CREATE POLICY "Public can read non-flagged reviews" ON reviews
  FOR SELECT USING (is_flagged = FALSE);

-- Users can read their own reviews
CREATE POLICY "Users can read own reviews" ON reviews
  FOR SELECT USING (auth.uid() = user_id);

-- Providers can read reviews for their bookings
CREATE POLICY "Providers can read reviews for their bookings" ON reviews
  FOR SELECT USING (auth.uid() = provider_id);

-- Users can create reviews for their bookings
CREATE POLICY "Users can create reviews for completed bookings" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can flag and delete reviews (future)

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_reviews_provider_id ON reviews(provider_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_booking_id ON reviews(booking_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_is_flagged ON reviews(is_flagged);

-- ============================================================================
-- UPDATE PROVIDERS TABLE WITH RATING FIELDS
-- ============================================================================

ALTER TABLE providers 
  ADD COLUMN IF NOT EXISTS rating_avg DECIMAL(2,1) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_providers_rating ON providers(rating_avg DESC);
CREATE INDEX IF NOT EXISTS idx_providers_reviews ON providers(total_reviews DESC);
