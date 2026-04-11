# 🎯 Card #11: User Onboarding + Neighborhood Verification Flow

**Status:** ✅ Complete  
**Platform:** Android (React Native / Expo)  
**Date:** April 10, 2026  

---

## 📋 Overview

Card #11 implements the complete onboarding flow that triggers immediately after successful phone authentication. Users must complete their profile and upload a neighborhood verification document before full app access.

**Key Features:**
- ✅ Onboarding trigger on first login
- ✅ Two-step onboarding (profile + verification)
- ✅ File upload to Supabase Storage
- ✅ Real Supabase database writes
- ✅ Verification status gating
- ✅ Persistent state across app restarts

---

## 🎬 Onboarding Flow

```
Authentication Complete
         ↓
Check User Profile Status
    ↙         ↘
Has Profile?   No Profile?
    ↓             ↓
Onboarding    Onboarding Stack
  Completed       ↓
    ↓         BasicProfile Screen
   Home         (Name + Neighborhood)
              ↓
        NeighborhoodVerification Screen
        (Upload verification document)
              ↓
        OnboardingComplete Screen
        (Success confirmation)
              ↓
            Home (Full Access)
```

---

## 📱 Onboarding Screens

### Screen 1: Basic Profile
**Purpose:** Collect name and neighborhood information

**UI Elements:**
- Step indicator (1 of 2)
- Title: "Complete Your Profile"
- First name input field
- Last name input field
- Neighborhood input field
- Continue button (disabled until all fields filled)
- Helper text explaining verification

**Data Collected:**
- `first_name` (VARCHAR 100)
- `last_name` (VARCHAR 100)
- `neighborhood_id` (VARCHAR 255)

**On Submit:**
- Validates all fields not empty
- Updates `users` record in Supabase
- Navigates to Screen 2

**Example Data:**
```json
{
  "first_name": "Juan",
  "last_name": "García",
  "neighborhood_id": "La Candelaria"
}
```

---

### Screen 2: Neighborhood Verification
**Purpose:** Upload proof of residence

**UI Elements:**
- Step indicator (2 of 2)
- Title: "Verify Your Neighborhood"
- Accepted documents list:
  - Utility bill
  - Lease document
  - Official government letter
- Document upload button
- File type & size constraints
- Upload & Complete button (disabled until file selected)
- Privacy notice

**File Upload:**
- Allowed types: PDF, JPG, PNG
- Max size: 5MB
- Destination: `supabase.storage: /verifications/{userId}/{timestamp}_{filename}`

**Upload Process:**
1. User selects document via file picker
2. Validate file type & size
3. Display selected file with option to change
4. Upload to Supabase Storage
5. Update user record with:
   - `verification_document_path`
   - `verification_status = 'pending'`
   - `onboarding_completed = true`
6. Navigate to completion screen

**Example Storage Path:**
```
verifications/
└── 11111111-1111-1111-1111-111111111111/
    └── 1712761234567_utility_bill.pdf
```

---

### Screen 3: Onboarding Complete
**Purpose:** Confirm successful onboarding

**UI Elements:**
- Success icon (✓)
- Title: "You're All Set!"
- Explanation of what happens next
- Current status: "Pending Verification"
- Button: "Go to Home"
- Auto-redirect to home after 2 seconds

**Status Message:**
```
⏳ Pending Verification
Your verification is pending review by our admin team.
Most verifications are completed within 24 hours.
```

---

## 🔐 Onboarding Trigger Logic

### When Does Onboarding Show?

Onboarding is triggered in `RootNavigator` when user checks pass:

```typescript
const needsOnboarding =
  !profile ||
  !profile.first_name ||
  !profile.last_name ||
  !profile.neighborhood_id ||
  !profile.onboarding_completed;
```

**Triggers:**
- First login (no profile exists)
- Missing required fields
- `onboarding_completed = false`

**Does NOT trigger:**
- User has completed onboarding once
- Returning users (profile complete)

---

## 💾 Database Updates

### Schema Changes

**Updated `users` Table:**
```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_status VARCHAR(50) DEFAULT 'unverified';
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_document_path VARCHAR(500);
ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;
```

### Example User Record After Onboarding

**Before Onboarding:**
```json
{
  "id": "11111111-1111-1111-1111-111111111111",
  "phone": "+573001234567",
  "role": "user",
  "first_name": null,
  "last_name": null,
  "neighborhood_id": null,
  "verification_status": "unverified",
  "onboarding_completed": false,
  "created_at": "2026-04-10T12:00:00Z"
}
```

**After Onboarding:**
```json
{
  "id": "11111111-1111-1111-1111-111111111111",
  "phone": "+573001234567",
  "role": "user",
  "first_name": "Juan",
  "last_name": "García",
  "neighborhood_id": "La Candelaria",
  "verification_status": "pending",
  "verification_document_path": "verifications/11111111-1111-1111-1111-111111111111/1712761234567_utility_bill.pdf",
  "onboarding_completed": true,
  "created_at": "2026-04-10T12:00:00Z",
  "updated_at": "2026-04-10T14:30:45Z"
}
```

---

## 🔒 Security Rules

### Supabase Storage RLS

**Bucket:** `verifications`

**Policy 1: Users can upload own documents**
```sql
CREATE POLICY "Users can upload own verification documents"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'verifications' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

**Policy 2: Users can read own documents**
```sql
CREATE POLICY "Users can read own verification documents"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'verifications' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

**Policy 3: Admins can read all documents**
```sql
CREATE POLICY "Admins can read all verification documents"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'verifications' AND
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
  );
```

### Validation Rules

**Client-Side:**
- File type: PDF, JPG, PNG only
- File size: Max 5MB
- File name sanitization
- User can only upload to their own folder

**Server-Side (RLS):**
- Storage: Only owner can read/write
- Database: User can update own record
- Admin: Can read all verification documents

---

## 🧪 Testing Onboarding

### Test Case 1: First-Time User

1. ✅ Start app (no user)
2. ✅ Complete phone auth → OTP verified
3. ✅ Redirected to BasicProfile screen
4. ✅ Enter name & neighborhood
5. ✅ Continue → Navigate to verification screen
6. ✅ Select PDF/JPG/PNG file
7. ✅ Upload → Firestore updated
8. ✅ Success screen → Auto-redirect to home
9. ✅ Home shows but limited access (pending verification)

### Test Case 2: Returning User (Already Onboarded)

1. ✅ Start app
2. ✅ User is authenticated
3. ✅ Profile check: `onboarding_completed = true`
4. ✅ Skip onboarding → Go directly to Home

### Test Case 3: File Upload Validation

1. ✅ Try uploading .exe file → Error: "Only PDF, JPG, PNG allowed"
2. ✅ Try uploading 10MB PDF → Error: "File must be < 5MB"
3. ✅ Upload valid file → Success

### Test Case 4: Profile Updates

1. ✅ Change first name in BasicProfile
2. ✅ Submit → Database updates immediately
3. ✅ Refresh app → Shows updated name

---

## 📂 File Structure

```
app/screens/onboarding/
├── BasicProfileScreen.tsx          ← Profile entry
├── NeighborhoodVerificationScreen.tsx ← File upload
└── OnboardingCompleteScreen.tsx    ← Success

app/navigation/
├── OnboardingStack.tsx             ← Onboarding navigation
└── RootNavigator.tsx               ← Onboarding trigger logic (UPDATED)

supabase/migrations/
├── 001_initial_schema.sql          ← Updated users table
└── 002_storage_bucket.sql          ← Storage bucket & RLS
```

---

## 🚀 How to Approve Users (Manual Admin Process)

Until automated approval is built, admins can approve users by updating their record:

### Via Supabase Dashboard

1. Go to SQL Editor
2. Run:
```sql
UPDATE users 
SET verification_status = 'approved'
WHERE id = '11111111-1111-1111-1111-111111111111';
```

3. User sees updated status on next app refresh

### Via Code (Admin API - Future)

```typescript
async function approveUser(userId: string) {
  const { error } = await supabase
    .from('users')
    .update({ verification_status: 'approved' })
    .eq('id', userId);
  
  if (error) throw error;
}
```

---

## 🔔 Verification Status States

| Status | User Access | UI State | Next Step |
|--------|-------------|----------|-----------|
| `unverified` | None (before onboarding) | Hidden | Complete onboarding |
| `pending` | Limited | "⏳ Pending" | Admin approval |
| `approved` | Full | "✓ Verified" | App use |
| `rejected` | None | "❌ Rejected" | Contact support |

---

## 📊 Data Flow

```
User Authentication
        ↓
Check: onboarding_completed == true?
    ↙              ↘
  Yes              No
   ↓                ↓
 Home          BasicProfile
               (input name/neighborhood)
                   ↓
            Update users record
                   ↓
           NeighborhoodVerification
            (upload file to storage)
                   ↓
            Update users record with:
            - verification_document_path
            - verification_status='pending'
            - onboarding_completed=true
                   ↓
            OnboardingComplete
            (success message)
                   ↓
                 Home
```

---

## ✅ Deliverables (Card #11)

✅ Basic Profile screen (name + neighborhood)  
✅ Neighborhood Verification screen (file upload)  
✅ Onboarding Complete screen (success confirmation)  
✅ OnboardingStack navigation  
✅ Onboarding trigger logic in RootNavigator  
✅ File upload to Supabase Storage  
✅ Real database writes (users table)  
✅ RLS policies for storage  
✅ File validation (type & size)  
✅ Type definitions  
✅ Documentation  

---

## 🔄 Next Steps

**Card #12:** Provider Onboarding
- Provider signup
- Service setup
- Document verification

**Card #13:** Service Booking
- Provider search
- Calendar selection
- Payment integration

---

**Authority:** CJ H. Adisa (C.H.A. LLC)  
**Platform:** Android (React Native / Expo)  
**Date:** April 10, 2026  

🚀 Ready for production testing
