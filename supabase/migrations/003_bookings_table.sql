-- ============================================================================
-- BOOKINGS TABLE IMPROVEMENTS FOR BOOKING FLOW
-- ============================================================================

-- Ensure bookings table has all required fields with correct types
ALTER TABLE bookings 
  ADD COLUMN IF NOT EXISTS location_address TEXT,
  ALTER COLUMN booking_time TYPE VARCHAR(5);

-- Create composite unique index to prevent double-booking same provider + date + time
CREATE UNIQUE INDEX IF NOT EXISTS idx_provider_availability 
  ON bookings(provider_id, booking_date, booking_time) 
  WHERE status IN ('pending', 'confirmed');

-- Index for filtering past bookings
CREATE INDEX IF NOT EXISTS idx_bookings_by_date ON bookings(booking_date, booking_time);

-- Index for user upcoming bookings
CREATE INDEX IF NOT EXISTS idx_user_upcoming_bookings 
  ON bookings(user_id, booking_date) 
  WHERE status IN ('pending', 'confirmed');

-- Index for provider upcoming bookings
CREATE INDEX IF NOT EXISTS idx_provider_upcoming_bookings 
  ON bookings(provider_id, booking_date) 
  WHERE status IN ('pending', 'confirmed');
