-- ============================================================================
-- NOTIFICATIONS TABLE FOR PUSH NOTIFICATION TRACKING
-- ============================================================================

-- Add notification_token to users table
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS notification_token VARCHAR(500),
  ADD COLUMN IF NOT EXISTS notification_enabled BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS last_token_update TIMESTAMP WITH TIME ZONE;

-- Add notification_token to providers table
ALTER TABLE providers
  ADD COLUMN IF NOT EXISTS notification_token VARCHAR(500),
  ADD COLUMN IF NOT EXISTS notification_enabled BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS last_token_update TIMESTAMP WITH TIME ZONE;

-- Create notifications table for tracking sent notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('booking_confirmed', 'booking_cancelled', 'booking_completed', 'message', 'booking_status_changed')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  data JSONB,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for recent notifications per user
CREATE INDEX IF NOT EXISTS idx_notifications_by_user 
  ON notifications(recipient_id, created_at DESC);

-- Index for unread notifications
CREATE INDEX IF NOT EXISTS idx_unread_notifications 
  ON notifications(recipient_id, read_at) 
  WHERE read_at IS NULL;

-- Index for notifications by type
CREATE INDEX IF NOT EXISTS idx_notifications_by_type 
  ON notifications(type, created_at DESC);

-- RLS POLICIES FOR NOTIFICATIONS TABLE

-- Users can read their own notifications
CREATE POLICY "Users can read own notifications" ON notifications
  FOR SELECT USING (auth.uid() = recipient_id);

-- Admins/system can create notifications
CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (TRUE);

-- Users can mark notifications as read
CREATE POLICY "Users can mark own notifications as read" ON notifications
  FOR UPDATE USING (auth.uid() = recipient_id)
  WITH CHECK (auth.uid() = recipient_id);

-- Users can delete their own notifications
CREATE POLICY "Users can delete own notifications" ON notifications
  FOR DELETE USING (auth.uid() = recipient_id);

-- Enable RLS on notifications table
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
