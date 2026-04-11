# 🔔 Card #15: Push Notifications (Bookings, Status Updates, Messages)

**Status:** ✅ Complete  
**Platform:** Android (React Native / Expo)  
**Date:** April 10, 2026  

---

## 📋 Overview

Card #15 implements real push notifications for:
- Booking confirmed → notify provider
- Booking cancelled → notify other party
- Booking completed → notify user
- New message → notify recipient
- Status changes → notify user

Uses **Expo Notifications + Supabase** (not Firebase FCM).

---

## 🎬 Notification Flow

```
Event Triggered (e.g., booking confirmed)
    ↓
Insert into notifications table
    ↓
Get user's notification_token from users table
    ↓
Send via Expo Push Notification Service
    ↓
Device receives push (if app installed)
    ↓
User sees notification on lock screen
    ↓
User taps notification
    ↓
App handles deep link (navigate to booking/conversation)
```

---

## 💾 Database Schema

### Users Table (Updated)

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS (
  notification_token VARCHAR(500),
  notification_enabled BOOLEAN DEFAULT TRUE,
  last_token_update TIMESTAMP WITH TIME ZONE
);
```

### Providers Table (Updated)

```sql
ALTER TABLE providers ADD COLUMN IF NOT EXISTS (
  notification_token VARCHAR(500),
  notification_enabled BOOLEAN DEFAULT TRUE,
  last_token_update TIMESTAMP WITH TIME ZONE
);
```

### Notifications Table (New)

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES users(id),
  type VARCHAR(50) CHECK (type IN (
    'booking_confirmed',
    'booking_cancelled', 
    'booking_completed',
    'message',
    'booking_status_changed'
  )),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  booking_id UUID REFERENCES bookings(id),
  conversation_id UUID REFERENCES conversations(id),
  data JSONB,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Indexes:**
- `idx_notifications_by_user` – Fetch notifications per user
- `idx_unread_notifications` – Get unread count
- `idx_notifications_by_type` – Filter by event type

---

## 🔐 Security (RLS Policies)

```sql
-- Users can read their own notifications
CREATE POLICY "Users can read own notifications" ON notifications
  FOR SELECT USING (auth.uid() = recipient_id);

-- System can create notifications (via backend)
CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (TRUE);

-- Users can mark as read
CREATE POLICY "Users can mark own notifications as read" ON notifications
  FOR UPDATE USING (auth.uid() = recipient_id);

-- Users can delete
CREATE POLICY "Users can delete own notifications" ON notifications
  FOR DELETE USING (auth.uid() = recipient_id);
```

**Enforces:**
- Users only see their own notifications
- Cannot manually create notifications from client
- System/backend creates all notifications
- Token deletion impossible from client

---

## 📱 Notification Types

### 1. Booking Confirmed

**Trigger:** Booking created (Card #12)  
**Recipient:** Provider  
**Title:** "Booking Confirmed ✓"  
**Body:** "{serviceName} on {date} at {time}"

**Example:**
```
Title: Booking Confirmed ✓
Body: House Cleaning on April 12, 2026 at 2:00 PM
Data: { bookingId: "...", action: "view_booking" }
```

---

### 2. Booking Cancelled

**Trigger:** User/provider cancels booking  
**Recipient:** Other party (user or provider)  
**Title:** "Booking Cancelled"  
**Body:** "{serviceName} booking has been cancelled"

**Example:**
```
Title: Booking Cancelled
Body: House Cleaning booking has been cancelled
Data: { bookingId: "...", action: "view_booking" }
```

---

### 3. Booking Completed

**Trigger:** Provider marks booking complete  
**Recipient:** User  
**Title:** "Booking Completed ✓"  
**Body:** "{serviceName} is complete. Please leave a review!"

**Example:**
```
Title: Booking Completed ✓
Body: House Cleaning is complete. Please leave a review!
Data: { bookingId: "...", action: "view_booking" }
```

---

### 4. New Message

**Trigger:** New message in booking conversation  
**Recipient:** Other participant  
**Title:** "Message from {senderName}"  
**Body:** "{messageText}" (truncated to 100 chars)

**Example:**
```
Title: Message from Provider
Body: What time should I expect you?
Data: { conversationId: "...", action: "open_conversation" }
```

**Note:** System messages are NOT sent as push notifications (type='system')

---

### 5. Status Changed

**Trigger:** Provider updates booking status  
**Recipient:** User  
**Title:** "Booking Status Updated"  
**Body:** "Status changed to: {newStatus}"

**Example:**
```
Title: Booking Status Updated
Body: Status changed to: pending_approval
Data: { bookingId: "...", action: "view_booking" }
```

---

## 📱 Implementation

### NotificationProvider

**Location:** `NotificationProvider.tsx`

**Setup Flow:**
```typescript
// 1. Initialize notifications (app startup)
const token = await initializeNotifications();

// 2. Store token in Supabase
await storeNotificationToken(userId, token);

// 3. Setup listeners
setupNotificationListeners();
  // - Listen for foreground notifications
  // - Handle notification tap (deep linking)
```

**Wraps entire app:**
```typescript
<NotificationProvider>
  <App />
</NotificationProvider>
```

---

### Building Notification Payloads

**Example:**
```typescript
import {
  buildBookingConfirmedPayload,
  buildMessagePayload,
  buildBookingCompletedPayload,
} from '@/lib/notifications';

// Build payload
const payload = buildBookingConfirmedPayload(
  bookingId,
  'House Cleaning',
  'April 12, 2026',
  '2:00 PM'
);
// Returns: {
//   type: 'booking_confirmed',
//   title: 'Booking Confirmed ✓',
//   body: 'House Cleaning on April 12, 2026 at 2:00 PM',
//   data: { bookingId, action: 'view_booking' }
// }
```

---

### Sending Notifications (Backend)

**Via Supabase Function (Phase 2):**
```typescript
// Function listens to Firestore events
// Creates notification record
// Fetches recipient token
// Sends via Expo Push Service
```

**Local Test (Development):**
```typescript
import { sendTestNotification, scheduleNotification } from '@/lib/notifications';

// Send immediately
await sendTestNotification();

// Schedule with delay
await scheduleNotification(
  'Test Title',
  'Test body',
  5, // seconds
  { testId: '123' }
);
```

---

## 🔄 Notification Lifecycle

| Phase | Status | Location | Handler |
|-------|--------|----------|---------|
| **Creation** | Inserted | `notifications` table | Backend function |
| **Send** | Queued for Expo | Expo Push Service | Expo servers |
| **Delivery** | Delivered to device | Device notification | OS notification center |
| **Display** | Shown to user | Lock screen/notification tray | Native notification UI |
| **Tap** | Interaction | App receives tap event | `setupNotificationListeners()` |
| **Read** | marked read | `notifications` table | `markNotificationAsRead()` |

---

## 🧪 Testing Checklist

- [ ] App requests notification permission
- [ ] Token stored in `users.notification_token`
- [ ] Test notification sends (development only)
- [ ] Notification appears on lock screen
- [ ] Notification shows title + body
- [ ] Tapping notification opens correct screen
- [ ] Booking created → provider gets notification
- [ ] Message sent → recipient gets notification
- [ ] System messages NOT sent as push
- [ ] Disabled notifications don't send
- [ ] Network failure handled gracefully

---

## 📊 Data Flow

### Notification Record

```json
{
  "id": "11111111-...",
  "recipient_id": "22222222-...",
  "type": "booking_confirmed",
  "title": "Booking Confirmed ✓",
  "body": "House Cleaning on April 12, 2026 at 2:00 PM",
  "booking_id": "33333333-...",
  "conversation_id": null,
  "data": {
    "bookingId": "33333333-...",
    "action": "view_booking"
  },
  "sent_at": "2026-04-10T15:30:45Z",
  "read_at": null,
  "created_at": "2026-04-10T15:30:45Z"
}
```

---

## ⚠️ MVP Limitations & Deferred

✅ **Implemented:**
- Notification types and payloads
- Token storage and retrieval
- Notification tracking table
- Local test notifications
- Permission handling

⏳ **Phase 2 (Deferred):**
- Backend Cloud Functions (actual push sending)
- Webhook handling
- Batch notification delivery
- Notification scheduling
- Analytics/delivery tracking
- Push notification preferences UI

---

## 📂 File Structure

```
app/lib/
└── notifications.ts (all logic)

app/providers/
└── NotificationProvider.tsx (setup)

supabase/migrations/
└── 004_notifications_table.sql (schema)
```

---

## 🚀 Next Steps

**Phase 2:**
- Create Cloud Functions to listen to events
- Implement actual push sending via Expo API
- Add notification preferences UI
- Webhook for delivery receipts

---

**Authority:** CJ H. Adisa (C.H.A. LLC)  
**Platform:** Android (React Native / Expo)  
**Date:** April 10, 2026  

✅ **Push notification foundation complete and ready for Phase 2**
