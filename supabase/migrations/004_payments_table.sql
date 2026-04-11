-- ============================================================================
-- PAYMENTS TABLE & BOOKING PAYMENT FIELDS
-- ============================================================================

-- Create payments table for Stripe + MercadoPago
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  provider VARCHAR(50) NOT NULL CHECK (provider IN ('stripe', 'mercadopago')),
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  provider_payment_id VARCHAR(255),
  payment_method VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_payment_per_booking ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_by_user ON payments(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_by_provider ON payments(provider, status);
CREATE INDEX IF NOT EXISTS idx_payments_by_status ON payments(status, created_at DESC);

-- Add payment fields to bookings table
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  ADD COLUMN IF NOT EXISTS payment_id UUID REFERENCES payments(id),
  ADD COLUMN IF NOT EXISTS payment_provider VARCHAR(50),
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMP WITH TIME ZONE;

-- Index for payment lookups
CREATE INDEX IF NOT EXISTS idx_bookings_by_payment_status ON bookings(payment_status);

-- ============================================================================
-- RLS POLICIES FOR PAYMENTS
-- ============================================================================

-- Enable RLS on payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Users can read their own payments
DROP POLICY IF EXISTS "Users can read own payments" ON payments;
CREATE POLICY "Users can read own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

-- Providers can read payments for their bookings
DROP POLICY IF EXISTS "Providers can read assigned payments" ON payments;
CREATE POLICY "Providers can read assigned payments" ON payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE id = booking_id AND provider_id = auth.uid()
    )
  );

-- Admins can read all payments (future)
DROP POLICY IF EXISTS "Admins can read all payments" ON payments;
CREATE POLICY "Admins can read all payments" ON payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
