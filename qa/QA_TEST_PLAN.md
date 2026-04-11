# 🧪 Card #18: E2E QA Test Plan — Booking → Payment → Confirmation

**Project:** Locali MVP (C.H.A. LLC)  
**Platform:** Android (React Native / Expo)  
**Backend:** Supabase (PostgreSQL)  
**Payment Providers:** Stripe (US) + MercadoPago (Colombia)  
**Test Date:** April 10, 2026  
**QA Lead:** CJ H. Adisa  

---

## 📋 Test Scope

This E2E test validates the critical payment path from booking through confirmation:

**Scope:** User authentication → Onboarding → Service booking → Payment → Confirmation → Messaging

**Out of Scope:** Admin dashboard, provider onboarding, analytics, advanced features

---

## 🎯 Scenarios to Test

### **Scenario A: Successful Payment Path (Stripe)**

**Prerequisites:**
- Fresh user account
- Android emulator / device
- Supabase dev environment
- Stripe test mode credentials

**Test Steps:**

| Step | Action | Expected Result | Status | Notes |
|------|--------|-----------------|--------|-------|
| 1 | User opens app | Splash screen → Auth screen | [ ] | |
| 2 | User enters phone number (+1 555 123 4567) | OTP sent to SMS | [ ] | Test SMS |
| 3 | User enters OTP (000000 in dev) | Session created, navigates to onboarding | [ ] | |
| 4 | User completes onboarding (name + neighborhood) | Profile saved, user navigates to home | [ ] | |
| 5 | User uploads verification file | File stored in Supabase Storage | [ ] | Test with PDF |
| 6 | User taps "Book Service" | Service selection screen opens | [ ] | |
| 7 | User selects a service | Service and provider info displayed | [ ] | |
| 8 | User selects date and time | Calendar opens, past dates disabled | [ ] | |
| 9 | User selects future date + time slot | Price displayed | [ ] | |
| 10 | User taps "Confirm Booking" | Payment screen opens (Stripe form) | [ ] | |
| 11 | User enters test card (4242 4242 4242 4242) | Card accepted | [ ] | Stripe test card |
| 12 | User taps "Pay" | Payment processing... spinner shows | [ ] | |
| 13 | Payment succeeds | Booking confirmed page shows | [ ] | Check bookings table |
| 14 | Booking record shows `status = confirmed` | Verified in Supabase | [ ] | |
| 15 | Booking record shows `paymentStatus = paid` | Verified in Supabase | [ ] | |
| 16 | User navigates to "Your Bookings" | Booking appears in list | [ ] | |
| 17 | Chat created for booking | Conversation table has record | [ ] | |
| 18 | User sends message "Test message" | Message appears instantly | [ ] | Real-time |
| 19 | Provider dashboard shows booking | Booking visible to provider | [ ] | Check provider view |
| 20 | Provider receives notification | (If notifications implemented) | [ ] | Check logs |

**Pass Criteria:**
- All 20 steps complete without error
- Booking record has correct status + payment info
- Chat created automatically
- Message sent successfully
- Provider sees booking

---

### **Scenario B: Failed Payment Path (Stripe)**

**Prerequisites:**
- Same as Scenario A
- Stripe decline test card

**Test Steps:**

| Step | Action | Expected Result | Status | Notes |
|------|--------|-----------------|--------|-------|
| 1-10 | Repeat booking flow | Payment screen opens | [ ] | |
| 11 | User enters decline card (4000 0000 0000 0002) | Card shown in form | [ ] | Stripe test card |
| 12 | User taps "Pay" | Payment processing... spinner shows | [ ] | |
| 13 | Payment fails | Error message displayed | [ ] | Check error text |
| 14 | Booking record shows `paymentStatus = failed` | Verified in Supabase | [ ] | |
| 15 | Booking NOT marked as paid | `paid_at` is null | [ ] | |
| 16 | User can retry payment OR cancel | Clear options shown | [ ] | |
| 17 | Duplicate payment prevented | No two payments for same booking | [ ] | Check payments table |
| 18 | No chat created (optional) | Conversation not created until paid | [ ] | |
| 19 | User navigates to bookings | Failed booking NOT shown | [ ] | Status = failed hides it |

**Pass Criteria:**
- Error handled cleanly
- No bad state created
- Duplicate prevention works
- User can retry safely

---

### **Scenario C: MercadoPago Flow (Colombia)**

**Prerequisites:**
- User address in Colombia
- Supabase dev + MercadoPago sandbox
- Expo web view / redirect handling

**Test Steps:**
(Same as Scenario A, but with MercadoPago form)

| Step | Action | Expected Result | Status | Notes |
|------|--------|-----------------|--------|-------|
| 1-10 | Repeat booking flow | MercadoPago form opens | [ ] | Not Stripe |
| 11 | User enters test card (sandbox) | Card accepted | [ ] | MercadoPago test |
| 12 | Payment succeeds | Booking confirmed | [ ] | |
| 13 | Booking shows `paymentStatus = paid` | Verified in Supabase | [ ] | |

**Pass Criteria:**
- MercadoPago form displays
- Payment succeeds
- Booking created correctly

---

## 🔍 Verification Checklist

After each scenario, verify:

- [ ] Booking table has correct `status` and `paymentStatus`
- [ ] Payments table has payment record with correct `provider` + `status`
- [ ] Users table shows user as verified (if onboarding completed)
- [ ] Conversations table has one record per booking
- [ ] Messages table shows chat messages
- [ ] Providers table shows rating updates (if reviews submitted)
- [ ] No duplicate payment records
- [ ] Timestamps are correct (created_at, updated_at)

---

## 🎥 Evidence Required

**For Each Scenario:**
1. Screen recording (90–120 seconds) showing:
   - User login through booking confirmation
   - Payment form visible
   - Success/failure page shown
   - App navigating to next screen

2. Screenshots (at key steps):
   - Auth screen
   - Onboarding complete
   - Service selection
   - Booking confirmation
   - Payment form
   - Success page
   - Your Bookings list

3. Database verification (Supabase console):
   - Bookings table record
   - Payments table record
   - Conversations table record
   - Users table record

---

## 🐛 Bug Report Template

**If any step fails:**

```
Title: [E2E] <Short Issue> — Android (or iOS)

Steps to Reproduce:
1. [Step that fails]
2. [Expected vs actual]

Expected: [What should happen]
Actual: [What actually happened]

Screenshots/Video: [Attached]

Severity: Blocker | Major | Minor
Environment: dev | staging
Build: [Version/commit]
```

---

## ✅ Pass/Fail Criteria

**Test PASSES if:**
- All 20 steps in Scenario A complete without error
- Payment succeeds and booking is confirmed
- Chat created and message sent
- Database records match expected state
- No duplicate payments

**Test FAILS if:**
- Any step errors or hangs
- Payment succeeds but booking not marked paid
- Duplicate payments created
- Chat doesn't exist after paid booking
- Provider doesn't see booking

---

## 📅 Execution Timeline

- **Setup:** 15 minutes (configure Stripe/MercadoPago test keys)
- **Scenario A:** 10 minutes
- **Scenario B:** 5 minutes
- **Scenario C:** 5 minutes
- **Verification:** 10 minutes
- **Report:** 15 minutes

**Total:** ~60 minutes per platform

---

**QA Approval:** _________________ Date: _______

**Ready to Ship:** No (pending test execution)
