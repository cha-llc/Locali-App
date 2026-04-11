# 🎯 Card #12: Service Booking Flow (Availability → Booking Record)

**Status:** ✅ Complete  
**Platform:** Android (React Native / Expo)  
**Date:** April 10, 2026  

---

## 📋 Overview

Card #12 implements the complete transactional booking flow:
1. Browse services
2. Select date & time
3. Confirm booking
4. Create real booking record in Supabase

**Key Features:**
- ✅ Real service data from database
- ✅ Real availability selection
- ✅ No double-booking (unique constraints)
- ✅ Real booking creation in Supabase
- ✅ Visible to both user and provider

---

## 🎬 Booking Flow Diagram

```
ServiceSelectionScreen
├── Load verified services
├── Filter by category
└── Select service
    ↓
AvailabilitySelectionScreen
├── Date picker (no past dates)
├── Time slots (8am - 7pm)
├── Price display
└── Select date + time
    ↓
BookingConfirmationScreen
├── Review all details
├── Price breakdown
├── Cancellation policy
└── Confirm booking
    ↓
CREATE BOOKING in Supabase
├── Check for duplicates
├── Insert booking record
├── Return to home
└── Show success message
```

---

## 📱 Screen Details

### Screen 1: Service Selection
**File:** `ServiceSelectionScreen.tsx`

**Purpose:** Browse and filter available services

**UI Elements:**
- Service category filter (pills)
- Service list with:
  - Service name
  - Provider availability status
  - Base price
  - Provider rating (⭐)
- Empty state if no services

**Data Source:**
- `getServices()` – Load all active services
- `getVerifiedProviders()` – Load approved providers
- Merge provider data into services

**Actions:**
- Filter by category
- Select service → Navigate to availability

**Example:**
```
┌─────────────────────────────────┐
│ Select a Service                │
│ Choose what you need help with  │
├─────────────────────────────────┤
│ [All] [Cleaning] [Laundry] ...  │
├─────────────────────────────────┤
│ House Cleaning              →   │
│ Provider Available               │
│ $50,000  ⭐ 4.5 (2 reviews)   │
└─────────────────────────────────┘
```

---

### Screen 2: Availability Selection
**File:** `AvailabilitySelectionScreen.tsx`

**Purpose:** Select date and time for service

**UI Elements:**
- Service summary box
- Date picker (calendar)
- Time slots grid (12 slots)
- Price breakdown
- Continue button

**Validation Rules:**
- Cannot select past dates
- Time slots: 08:00 - 19:00 (hourly)
- Duration: 60 minutes
- No client-side availability logic (MVP)

**Data Flow:**
```json
{
  "selectedDate": "2026-04-12",
  "selectedTime": "14:00",
  "service": { "id": "...", "base_price": 50000 },
  "provider": { "id": "..." }
}
```

**Example:**
```
┌─────────────────────────────────┐
│ Select Date & Time              │
├─────────────────────────────────┤
│ Saturday, April 12, 2026        │
├─────────────────────────────────┤
│ [08:00] [09:00] [10:00] ...     │
│ [13:00] [14:00]✓ [15:00] ...    │
├─────────────────────────────────┤
│ Service Fee      $50,000         │
│ Total            $50,000         │
└─────────────────────────────────┘
```

---

### Screen 3: Booking Confirmation
**File:** `BookingConfirmationScreen.tsx`

**Purpose:** Final confirmation before booking creation

**UI Elements:**
- Service details box
- Date & time display
- Duration
- Price breakdown (service + fees + total)
- Cancellation policy
- Back button
- Confirm Booking button

**Data Display:**
- Service name
- Provider status
- Selected date
- Selected time
- Duration: 60 minutes
- Price (no fees in MVP)

**On Confirm:**
1. Call `createBooking()`
2. Check for errors
3. On success → Navigate to home, show alert
4. On failure → Show error, allow retry

**Example:**
```
┌─────────────────────────────────┐
│ Confirm Your Booking            │
├─────────────────────────────────┤
│ Service: House Cleaning          │
│ Date: Saturday, April 12, 2026   │
│ Time: 2:00 PM                    │
│ Duration: 60 minutes             │
├─────────────────────────────────┤
│ Service Fee      $50,000         │
│ Platform Fee     Free            │
│ ─────────────────────────────    │
│ Total            $50,000         │
├─────────────────────────────────┤
│ [Back]  [Confirm Booking]        │
└─────────────────────────────────┘
```

---

## 💾 Database Operations

### createBooking()
**Location:** `app/lib/database.ts`

**Function:**
```typescript
async function createBooking(
  userId: string,
  booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>
): Promise<Booking | null>
```

**Logic:**
1. Validate required fields
2. Check for duplicate booking (provider + date + time)
3. If duplicate exists → Throw error
4. Insert booking record
5. Return booking document

**Duplicate Check Query:**
```sql
SELECT id FROM bookings
WHERE provider_id = $1
  AND booking_date = $2
  AND booking_time = $3
  AND status IN ('pending', 'confirmed')
```

**Insertion:**
```sql
INSERT INTO bookings (
  user_id, provider_id, service_id,
  booking_date, booking_time,
  duration_minutes, status, price
) VALUES (...)
```

**Example Request:**
```json
{
  "user_id": "11111111-...",
  "provider_id": "22222222-...",
  "service_id": "33333333-...",
  "booking_date": "2026-04-12",
  "booking_time": "14:00",
  "duration_minutes": 60,
  "status": "confirmed",
  "price": 50000
}
```

**Example Response:**
```json
{
  "id": "55555555-...",
  "user_id": "11111111-...",
  "provider_id": "22222222-...",
  "service_id": "33333333-...",
  "booking_date": "2026-04-12",
  "booking_time": "14:00",
  "duration_minutes": 60,
  "status": "confirmed",
  "price": 50000,
  "location_address": null,
  "created_at": "2026-04-10T15:30:45Z",
  "updated_at": "2026-04-10T15:30:45Z"
}
```

---

### getUserBookings()
**Returns all bookings for a user**

```sql
SELECT * FROM bookings
WHERE user_id = $1
ORDER BY booking_date DESC
```

---

### getProviderBookings()
**Returns all bookings assigned to a provider**

```sql
SELECT * FROM bookings
WHERE provider_id = $1
ORDER BY booking_date DESC
```

---

## 🔐 Security

### Supabase RLS Policies (Already in place from Card #10)

**Bookings Table:**
```sql
-- Users can create bookings
CREATE POLICY "Users can create bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can read own bookings
CREATE POLICY "Users can read own bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update own bookings
CREATE POLICY "Users can update own bookings" ON bookings
  FOR UPDATE USING (auth.uid() = user_id);

-- Providers can read assigned bookings
CREATE POLICY "Providers can read assigned bookings" ON bookings
  FOR SELECT USING (auth.uid() = provider_id);

-- Providers can update assigned bookings
CREATE POLICY "Providers can update assigned bookings" ON bookings
  FOR UPDATE USING (auth.uid() = provider_id);
```

### Duplicate Prevention

**Unique Index:**
```sql
CREATE UNIQUE INDEX idx_provider_availability 
  ON bookings(provider_id, booking_date, booking_time) 
  WHERE status IN ('pending', 'confirmed');
```

**Application Logic:**
```typescript
// Check for existing booking before insert
const { data: existing } = await supabase
  .from('bookings')
  .select('id')
  .eq('provider_id', booking.provider_id)
  .eq('booking_date', booking.booking_date)
  .eq('booking_time', booking.booking_time)
  .eq('status', 'confirmed');

if (existing && existing.length > 0) {
  throw new Error('Time slot unavailable');
}
```

---

## 🔄 Data Flow & Visibility

### Booking Creation

```
User Confirms
    ↓
POST /bookings (Supabase insert)
    ↓
Triggers RLS check
  - auth.uid() == user_id? ✓
    ↓
Checks unique index
  - provider available? ✓
    ↓
INSERT booking record
    ↓
Return booking document
```

### Visibility After Creation

**User Perspective:**
- Booking appears in "Your Bookings" list
- Shows date, time, status, price
- Status: "Confirmed" (immediately)

**Provider Perspective:**
- Booking appears in provider dashboard
- Shows booked time slot
- Provider can confirm/reject (future)

**Both Read Same Data:**
- Same booking document from Supabase
- Real-time updates on refresh

---

## 📊 Booking Lifecycle (MVP)

| Status | Meaning | User Can | Provider Can |
|--------|---------|----------|--------------|
| `confirmed` | User booked, awaiting provider confirmation | Cancel | Accept/Reject |
| `pending` | Provider accepted, awaiting completion | Cancel | Complete |
| `completed` | Service completed | Review | Review |
| `cancelled` | Booking cancelled | - | - |

---

## ⚠️ MVP Limitations & Known Issues

1. **No Real-Time Availability**
   - Availability is placeholder (all times available)
   - No sync with provider's actual calendar
   - Future: Integrate provider availability from providers.availability field

2. **No Conflict Detection at Time Selection**
   - Only checked at booking confirmation
   - Could show "unavailable" at selection screen (future)

3. **No Automatic Provider Notification**
   - Provider sees booking only on refresh
   - Future: Push notifications or real-time updates

4. **No Pricing Multipliers**
   - All bookings use service.base_price
   - No fees, discounts, or surge pricing
   - Future: Add fee structure and calculations

5. **Location Hardcoded**
   - Location captured at booking (optional in MVP)
   - Future: Map integration and geolocation

---

## 🧪 Testing Checklist

- [ ] Load services (verify data appears)
- [ ] Filter services by category
- [ ] Select service (verify details carry forward)
- [ ] Select future date (past dates disabled)
- [ ] Select time slot (select multiple, change selection)
- [ ] Verify price display
- [ ] Confirm booking (no duplicates created)
- [ ] Check Supabase: Booking record created
- [ ] View in "Your Bookings" screen
- [ ] Refresh app: Booking still visible
- [ ] Try double-booking same provider + time → Error shown

---

## 📂 File Structure

```
app/screens/booking/
├── ServiceSelectionScreen.tsx
├── AvailabilitySelectionScreen.tsx
└── BookingConfirmationScreen.tsx

app/navigation/
├── BookingStack.tsx (new)
└── AppStack.tsx (updated)

app/screens/bookings/
└── BookingsScreen.tsx (updated to show real bookings)

app/lib/
└── database.ts (updated with createBooking, getProviderBookings)

supabase/migrations/
└── 003_bookings_table.sql (indexes & constraints)
```

---

## 🚀 Next Steps

**Card #13:** Messaging System
- Real-time chat between users and providers
- Booking-scoped messages
- Notification system

**Card #14:** Reviews & Ratings
- Post-booking review submission
- Rating calculation
- Display ratings on provider profiles

---

**Authority:** CJ H. Adisa (C.H.A. LLC)  
**Platform:** Android (React Native / Expo)  
**Date:** April 10, 2026  

✅ **Booking flow complete and ready for production testing**
