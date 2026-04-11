# 🧪 Locali MVP — Beta Tester Playbook

**Version:** 1.0  
**Date:** April 10, 2026  
**Status:** Active Beta Testing  

---

## Welcome to the Locali MVP Beta

You've been invited to test **Locali MVP** — an early-stage neighborhood services app currently in active development.

This is **NOT a polished, consumer-ready product.** Bugs are expected. Your job is to find them, report them cleanly, and help us ship a solid product.

---

## What You're Testing

**Locali MVP** is a mobile app (Android + iOS) that connects users with local service providers.

**Core user flows:**
- User authentication (phone OTP)
- User onboarding (profile + neighborhood verification)
- Service browsing and booking
- Payment processing (Stripe test mode)
- In-app messaging with providers
- Push notifications
- User ratings and reviews

**Current state:** Core flows implemented, security audited, performance tested.

---

## How to Install

### iOS (TestFlight)
1. Open TestFlight app on your iPhone/iPad
2. Find the invite email from CJ H. Adisa
3. Click the link or enter the redemption code
4. Tap "Accept" and install Locali

### Android (Google Play Internal Testing)
1. Open the Google Play Store app
2. Search for "Locali"
3. Tap "Join the beta"
4. Install the app

**If installation fails:** Take a screenshot and submit via the feedback form (link below).

---

## What to Test

### 1. Login (5 min)
- [ ] App opens to login screen
- [ ] Enter phone number (use +1 555 123 4567 or your real number)
- [ ] Receive OTP (or use 000000 in dev mode)
- [ ] Enter OTP and tap "Verify"
- [ ] Successfully logged in to home screen

**Test in:** WiFi + cellular

---

### 2. Onboarding (10 min)
- [ ] Profile screen: Enter first name, last name
- [ ] Neighborhood screen: Select or enter your neighborhood
- [ ] File upload: Upload a PDF or image as verification document
- [ ] Upload completes without error
- [ ] Onboarding completes and navigates to home

**Test in:** Both WiFi and cellular

---

### 3. Booking (15 min)
- [ ] Navigate to "Book Service" tab
- [ ] Select a service from the list
- [ ] Select a future date (no past dates allowed)
- [ ] Select a time slot (8am–7pm hourly)
- [ ] Confirm booking details
- [ ] Booking confirmation page appears
- [ ] Booking appears in "Your Bookings" list

**Test in:** WiFi

---

### 4. Payments (STRIPE TEST MODE ONLY — 10 min)
**CRITICAL:** All test payments use Stripe test cards. No real money is charged.

**Test Card (Success):** `4242 4242 4242 4242`
- [ ] Tap "Confirm Booking" → Payment screen opens
- [ ] Enter test card number (above)
- [ ] Enter any future expiration date (e.g., 12/30)
- [ ] Enter any 3-digit CVC (e.g., 123)
- [ ] Tap "Pay"
- [ ] Payment succeeds and booking is confirmed

**Test Card (Decline):** `4000 0000 0000 0002`
- [ ] Repeat above steps with decline card
- [ ] Payment fails with clear error message
- [ ] Booking is NOT created
- [ ] You can retry or cancel

**NEVER enter real credit card information.**

---

### 5. Messaging (10 min)
- [ ] Go to "Messages" tab
- [ ] Open a conversation (must have an active booking first)
- [ ] Type a message and tap send
- [ ] Message appears in conversation thread
- [ ] Message text is clear and readable
- [ ] Timestamps are visible
- [ ] Conversation stays on-screen (doesn't crash)

**Test in:** WiFi

---

### 6. Notifications (5 min)
- [ ] Enable notifications when prompted at login
- [ ] Complete a booking (see Booking section above)
- [ ] Wait 5–10 seconds
- [ ] Check if notification appears on your phone
- [ ] Tap notification and verify it opens the app correctly

**Expected:** Notification arrives within 10 seconds of booking completion.

---

## What NOT to Report

❌ **Feature requests** — "Add dark mode," "Support more payment methods"  
❌ **Design opinions** — "The colors are ugly," "Buttons are too small"  
❌ **Polish issues** — Minor grammar, small UI spacing misalignments  
❌ **Duplicates** — Check the feedback form to see if someone already reported it  

✅ **DO report:** Crashes, incorrect behavior, missing features listed above, confusing UX

---

## How to Report Bugs

### Step 1: Reproduce the Bug
1. Clear your app cache (or reinstall)
2. Log in fresh
3. Follow the exact steps again
4. Confirm the bug happens every time (or note if it's intermittent)

### Step 2: Fill Out the Feedback Form

**Link:** [Feedback Form](https://forms.gle/locali-beta-feedback)

**Required fields:**
- Platform (iOS or Android)
- Device model (iPhone 14, Pixel 6 Pro, etc.)
- App version (shown in Settings)
- Bug type: Crash / Blocker / Major / Minor / UX
- Steps to reproduce (exact, numbered steps)
- Expected behavior vs actual behavior
- Screenshot or 10-second video

### Step 3: Submit
- Click "Submit"
- Your bug is automatically added to the dev team's Trello board
- You'll receive a confirmation email

---

## Screenshots & Videos

**Attach for every bug:**
- Screenshots (tap screenshot button on your phone)
- Videos (10–30 seconds, showing the bug happening)

**How to make a video:**
- iOS: Hold down power + volume up to record
- Android: Settings → About Phone → hold power button → Screen Record

**Upload via the form above.**

---

## Testing Schedule

**Start date:** April 10, 2026  
**Duration:** 1 week (closed beta)  
**Feedback deadline:** April 17, 2026  

**Expected response time:**
- Critical bugs (crashes): Fixed within 24 hours
- Major bugs (blocking feature): Fixed within 48 hours
- Minor bugs: Fixed or scheduled for next build

---

## Code of Conduct

✅ **Do:**
- Test thoroughly and report what you find
- Follow the feedback form template
- Provide clear steps to reproduce
- Ask questions in the feedback form
- Be respectful and constructive

❌ **Don't:**
- Share the app outside the tester group
- Post feedback on social media
- Forward the app link to non-testers
- Spam with duplicate reports
- Report features as bugs

---

## Contact & Support

**Feedback form:** [https://forms.gle/locali-beta-feedback](https://forms.gle/locali-beta-feedback)  
**Questions:** Reply to the invite email or submit via form  
**Critical issues:** Email CJ directly (only for app-breaking crashes)  

---

## Key Dates & Milestones

| Date | Event |
|------|-------|
| Apr 10 | Beta testing begins |
| Apr 17 | Feedback collection ends |
| Apr 21 | v0.2 release with fixes |
| Apr 28 | Public beta (if approved) |

---

## Thank You

Your feedback is critical to shipping a solid product. Every bug you find, every UX issue you spot, and every suggestion you provide makes Locali better.

**Let's build something great.**

---

**Signed,**  
CJ H. Adisa  
Locali MVP — Authority  
C.H.A. LLC
