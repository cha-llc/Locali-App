# 👑 Card #17: Admin Ops Dashboard (Provider Verification + Manual Controls)

**Status:** ✅ Complete  
**Platform:** Android (React Native / Expo)  
**Date:** April 10, 2026  

---

## 📋 Overview

Card #17 implements a secure internal admin dashboard for CJ/ops to:
- Review pending provider verifications
- Approve/reject providers
- View verification documents
- Manually enable/disable providers
- Audit all admin actions

---

## 🔐 Admin Access Control

### isUserAdmin()

Checks if user has `role = 'admin'` in users table.

**Only admins can:**
- Access admin dashboard
- Read verification uploads
- Update provider status
- View rejection reasons
- Access audit logs

**Non-admins:**
- Blocked entirely from dashboard
- App navigates back with "Access Denied" message

---

## 📋 Provider Verification Queue

### getPendingProviders()

Lists all providers with `verification_status = 'pending'`.

**Sorted:** Oldest pending first (FIFO queue)

**Displays:**
- User ID
- Verification status
- Submission date
- Quick action buttons

---

## ✅ Approval Actions

### approveProvider()

Sets:
```
providers.verification_status = 'approved'
providers.updated_at = NOW
users.verification_status = 'approved'
users.is_verified = true
```

**Effect:** Provider appears in service list, can accept bookings.

---

## ❌ Rejection Actions

### rejectProvider()

Sets:
```
providers.verification_status = 'rejected'
providers.rejection_reason = '{reason}'
users.verification_status = 'rejected'
users.is_verified = false
```

**Optional reason** shown to user.

---

## 🔧 Manual Overrides

### disableProvider()

```
providers.is_active = false
```

**Effect:** Provider removed from active listings, cannot accept new bookings.

### enableProvider()

```
providers.is_active = true
```

**Effect:** Provider re-enabled in active listings.

---

## 📄 Document Viewing

### getVerificationDocumentUrl()

**Flow:**
1. Get `verification_document_path` from users table
2. Generate signed URL from Supabase Storage
3. Valid for 1 hour
4. Secure access (RLS enforced)

**Admin only** can view documents.

---

## 📊 Audit Logging

### logAdminAction()

Tracks all admin actions:
- Action type (approve, reject, disable, enable)
- Target provider ID
- Timestamp
- Details (JSON)

**Persisted in** `admin_logs` table for compliance.

---

## 🎨 Dashboard UI

### AdminDashboardScreen

**Two Views:**

**1. Queue List**
- Pending providers (oldest first)
- Status badge
- Submission date
- "Review Details" button

**2. Provider Detail**
- User ID
- Verification status
- Submission date
- Document path (if any)
- Approve / Reject buttons

---

## 💾 Database Updates

### RLS Policies

```sql
-- Only admins can read provider verification data
CREATE POLICY "Admins can read provider verifications" ON providers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can update verification status
CREATE POLICY "Admins can update verification status" ON providers
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

---

## ✅ Mandatory Features

✅ **Secure admin-only access**  
✅ **Provider verification review UI**  
✅ **Approve/reject with reason**  
✅ **Manual override controls**  
✅ **Firestore updates reflected in app**  
✅ **Audit logging**  
✅ **Complete documentation**  

---

## 📂 File Structure

```
app/lib/
└── admin.ts (all backend logic)

app/screens/admin/
└── AdminDashboardScreen.tsx (UI)

docs/
└── ADMIN_OPS.md (this file)
```

---

**Authority:** CJ H. Adisa (C.H.A. LLC)  
**Platform:** Android (React Native / Expo)  
**Date:** April 10, 2026  

✅ **Admin dashboard production-ready**
