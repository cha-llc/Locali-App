# Locali MVP — EXECUTION WORKFLOW (April 14, 2026)
# Android Build & Google Play Store Submission

**Authority:** CJ H. Adisa (C.H.A. LLC)  
**Status:** READY FOR MANUAL EXECUTION  
**Date:** April 14, 2026

---

## 🚀 STEP-BY-STEP EXECUTION WORKFLOW

### STEP 1: Authenticate with Expo (5 min)
```bash
# If not already logged in
eas login

# Verify authentication
eas whoami
```

**Expected output:** Your Expo account email and organization

---

### STEP 2: Execute Android Production Build (20-30 min)
```bash
# Navigate to Locali app directory
cd /path/to/Locali-App

# Execute production build
eas build --platform android --profile production
```

**What happens:**
- Build starts on Expo's servers
- Check progress at: https://expo.dev/builds
- Expected size: 80-120 MB
- Expected completion: ~20-30 minutes
- You'll receive an email when build completes

**Build Configuration (verified):**
- App: Locali v1.0.0
- Package: com.chaholdingsltd.locali
- Min SDK: 21 | Target SDK: 34
- Release keystore: Configured
- Output format: APK/AAB

---

### STEP 3: Download APK/AAB (2 min)
```bash
# Once build completes:
# 1. Go to https://expo.dev/builds
# 2. Find "Locali" build for Android
# 3. Click "Download"
# 4. Choose either APK or AAB (AAB preferred for Play Store)
# 5. Save locally

# Alternative: Use EAS CLI
eas build:list --platform android
# Copy the download URL
```

**File location:** `~/Downloads/Locali-1.0.0.aab` (or .apk)

---

### STEP 4: Create Google Play Console App (5 min)
```
1. Go to https://play.google.com/console
2. Login with your Google account
3. Click "Create app"
4. Fill in:
   - App name: "Locali"
   - Default language: English
   - App category: Lifestyle / Shopping
   - Type: Paid/Free: FREE
5. Click "Create app"
```

---

### STEP 5: Upload APK/AAB (5 min)
```
In Google Play Console:
1. Left menu → "Release" → "Production"
2. Click "Create new release"
3. Click "Browse files" or drag APK/AAB
4. Select your downloaded file (Locali-1.0.0.aab)
5. Wait for upload to complete
6. System will verify and show "Ready to review"
```

---

### STEP 6: Complete Store Listing (10 min)

**In Google Play Console → "Store listing":**

1. **Title:** Locali
2. **Short description:** Hire trusted neighbors for cleaning, repairs, groceries & more
3. **Full description:**
```
Locali is your neighborhood super-app for on-demand services.

FEATURES:
✅ Book instantly
✅ Real-time scheduling
✅ Secure payments via Stripe
✅ Community ratings & reviews
✅ In-app messaging with providers
✅ Favorites & saved searches

SERVICES:
• Home Cleaning
• Light Repairs
• Pet Care
• Grocery Shopping
• Odd Jobs & Errands

LOCATIONS:
📍 Bogotá, Colombia
📍 Florida, USA
(Expanding to more neighborhoods)

Trust your neighbors. Get things done.

Support: support@mylocali.app
Website: https://www.mylocali.app
```

4. **Category:** Lifestyle → Shopping
5. **Content rating:**
   - Fill the rating questionnaire
   - Expected: Everyone (4+)

---

### STEP 7: Add Store Assets (10 min)

**Required graphics (use Locali brand assets):**

1. **App Icon** (512×512 PNG)
   - Upload in "Icon" section
   - Use mascot logo (smiling house pin)

2. **Feature Graphic** (1024×500 PNG)
   - Upload in "Feature graphic"
   - Hero image showing key features

3. **Screenshots** (5 × 1080×1920 PNG)
   - Upload minimum 4, maximum 8
   - Sequence:
     1. Login screen with phone OTP
     2. Service browsing/search
     3. Booking confirmation
     4. Real-time messaging
     5. Provider profile & ratings

---

### STEP 8: Add Privacy & Legal (5 min)

**In Google Play Console → "App content":**

1. **Privacy policy URL:** https://locali.mylocali.app/privacy
2. **Terms of service URL:** https://locali.mylocali.app/terms
3. **Developer contact:** support@mylocali.app
4. **Website:** https://www.mylocali.app

---

### STEP 9: Final Review & Submit (5 min)

**In Google Play Console → "Review" tab:**

1. Review all information:
   - ✅ App name, description, category
   - ✅ Graphics and screenshots
   - ✅ Content rating
   - ✅ Privacy policy and terms
   - ✅ Developer contact info

2. Click "Submit for review"
3. Accept Google Play Developer Program Policies
4. Click "Confirm"

**Expected confirmation:** "Submission successful. Your app is being reviewed."

---

## 📊 SUBMISSION TIMELINE

| Timeframe | Status | Action |
|-----------|--------|--------|
| **Today (Apr 14)** | Build | Execute EAS build (20-30 min) |
| **Tonight (Apr 14)** | Submit | Upload to Play Store (~30 min total) |
| **Apr 14-15** | Review | Google reviews app (24-48 hours) |
| **Apr 15-17** | Decision | Approval or rejection |
| **Apr 17-20** | **LIVE** | App live on Google Play Store ✅ |

---

## ✅ PRE-SUBMISSION CHECKLIST

**Before executing build:**
- [x] All backend services functional (Supabase, Stripe, Firebase)
- [x] Phone OTP authentication working
- [x] Google/Apple OAuth configured
- [x] Admin authentication functional
- [x] Stripe LIVE payment processing
- [x] Firebase Cloud Messaging ready
- [x] Real-time messaging enabled
- [x] Zero crashes or ANRs
- [x] GDPR/CCPA compliant
- [x] Privacy policy published
- [x] Terms of service published

**Before uploading to Play Store:**
- [ ] APK/AAB downloaded from Expo
- [ ] App icon (512×512 PNG) ready
- [ ] Feature graphic (1024×500 PNG) ready
- [ ] 5 screenshots (1080×1920 PNG) ready
- [ ] Privacy policy URL verified
- [ ] Terms of service URL verified
- [ ] Support email: support@mylocali.app

---

## 🔗 IMPORTANT LINKS

- **Expo Builds:** https://expo.dev/builds
- **Google Play Console:** https://play.google.com/console
- **GitHub Repo:** https://github.com/cha-llc/Locali-App
- **Support Email:** support@mylocali.app
- **Website:** https://www.mylocali.app
- **Privacy Policy:** https://locali.mylocali.app/privacy
- **Terms of Service:** https://locali.mylocali.app/terms

---

## 📞 SUPPORT

**If build fails:**
1. Check https://expo.dev/builds for error logs
2. Common issues: Missing EAS token, outdated Expo CLI
3. Solution: `npm install -g eas-cli` + `eas login`

**If Play Store submission rejected:**
1. Google will email detailed rejection reason
2. Common issues: Crashes, misleading description, policy violation
3. Fix issue, rebuild, resubmit (25-point review on resubmit)

---

## ✅ STATUS: READY FOR EXECUTION

All backend services verified. App is production-ready.

**Next action:** Execute Step 1 (Expo login) → Proceed through Steps 2-9

**Authority:** CJ H. Adisa (C.H.A. LLC)  
**Date:** April 14, 2026

