# Locali — Apple App Store Submission Checklist

**App Name:** Locali  
**Version:** 1.0.0  
**Bundle ID:** com.chaholdingsltd.locali  
**Category:** Lifestyle  
**Platform:** iOS  
**Minimum iOS Version:** 13.0  

---

## Required Metadata

### 1. App Name (Max 30 characters)
```
Locali
```
✅ **Count:** 6 characters

---

### 2. Subtitle (Max 30 characters, optional but recommended)
```
Your Neighborhood, On-Demand
```
✅ **Count:** 28 characters

---

### 3. Keywords (Max 100 characters, comma-separated)
```
services, booking, local, neighborhoods, home services, marketplace
```
✅ **Count:** 67 characters

---

### 4. App Description (Max 4000 characters)

```
Locali connects you with trusted local service providers in your neighborhood.

Book services from cleaning and repairs to personal errands—all in one app.

FEATURES
• One-tap booking: Browse, compare, and book services instantly
• Secure payments: Pay safely with Stripe encryption
• In-app messaging: Communicate directly with service providers
• Real-time notifications: Get updates on your bookings
• Ratings & reviews: Find trusted providers based on community feedback
• Verified neighborhoods: Know you're booking from your community

HOW IT WORKS
1. Sign up with your phone number
2. Verify your neighborhood
3. Browse available services
4. Book your provider and time
5. Chat, pay, and get it done

WHAT YOU CAN BOOK
• Cleaning & organization
• Home repairs & maintenance
• Personal errands & shopping
• And more from your community

Currently available in select neighborhoods. Download now and join your local service network.

Privacy Policy: [https://locali.cjhadisa.com/privacy](privacy URL)
Terms of Service: [https://locali.cjhadisa.com/terms](terms URL)
```

✅ **Verification:** Non-commercial tone, features accurately described, no exaggerated claims

---

### 5. Privacy Policy URL

**Required:** Yes  
**Format:** Full HTTPS URL  
**URL:** `https://locali.cjhadisa.com/privacy`  
**Status:** [ ] Hosted and live  
**Verification:** [ ] Opens in browser, shows full policy

---

### 6. Support URL

**Required:** Yes  
**URL:** `https://locali.cjhadisa.com/support`  
**Email:** `support@cjhadisa.com`  
**Response Time:** Within 48 hours

---

### 7. Marketing URL (Optional)

**URL:** `https://locali.cjhadisa.com`  
**Status:** [ ] Website live or landing page ready

---

## App Content Rating

### Content Rating Questionnaire

**Does this app contain:**

| Question | Answer | Notes |
|----------|--------|-------|
| Alcohol, tobacco, or drug use | No | |
| Gambling | No | |
| Profane language | No | Only user-generated in messages |
| Horror or fear themes | No | |
| Prolonged graphic violence | No | |
| Sexual content | No | |
| Unrestricted internet access | Yes | User messaging |
| User-generated content | Yes | User messages, reviews |

**Content Rating:** 4+ (General Audiences)  
**Parental Controls:** No parental controls needed

---

## App Privacy (Required)

### App Privacy Form

**1. Does your app collect any personal data?**
- [x] Yes

**2. What categories of data does your app collect?**

| Data Type | Collected | Used for Marketing | Shared | Notes |
|-----------|-----------|-------------------|--------|-------|
| User ID | Yes | No | Service providers only | Phone number, account ID |
| Name | Yes | No | Service providers only | First name, last name |
| Phone Number | Yes | No | Service providers only | Used for OTP auth |
| Location | Yes | No | No | Neighborhood only (not GPS) |
| User Content | Yes | No | Service providers only | Messages, reviews, bookings |
| Payment Info | Yes | No | Payment processor only | Stripe (encrypted) |
| Device ID | Yes | No | No | App analytics |
| Usage Data | Yes | No | No | Performance metrics |

**3. Are you using any third-party SDKs?**

| SDK | Purpose | Privacy Policy |
|-----|---------|-----------------|
| Stripe | Payment processing | https://stripe.com/privacy |
| Supabase | Backend/database | https://supabase.com/privacy |
| Expo | Build system | https://expo.dev/privacy |
| Amplitude | Analytics | https://amplitude.com/privacy |

**4. Is your app COPPA compliant?**
- [x] Yes (App is not directed at children under 13)

---

## Screenshots (Required)

### iPhone Screenshots (Multiple Sizes)

**Requirement:** 2-5 screenshots per language  
**Size:** 1170×2532 (iPhone 14 Pro)  
**Format:** PNG  

**Required Screens:**
1. Login/Onboarding
2. Service Browsing
3. Booking Confirmation
4. In-App Messaging
5. Profile/Settings

**Text Overlay (Optional but Recommended):**
- Keep text minimal (5-10 words)
- Use clear contrasting colors
- Font: San Francisco (system font)

Example Overlays:
- Slide 1: "Sign up in seconds with your phone number"
- Slide 2: "Browse services from trusted neighborhood providers"
- Slide 3: "Book instantly and pay securely"
- Slide 4: "Chat directly with your provider"
- Slide 5: "Rate and review to build community"

**Status:**
- [ ] 5 screenshots captured at 1170×2532
- [ ] All screens show functional app (no mockups)
- [ ] No placeholder text or dummy data
- [ ] Text is readable and not cut off

---

### iPad Screenshots (Optional)

**Size:** 2048×2732  
**Format:** PNG  
**Required:** Only if app supports iPad

**Status:**
- [x] Not required (portrait only)

---

## Preview Video (Optional but Recommended)

**Specification:**
- **Duration:** 15-30 seconds
- **Format:** MP4 or MOV
- **Resolution:** 1080p minimum (1170×2532 preferred)
- **Frame Rate:** 30 fps
- **Codec:** H.264

**Content:**
1. Intro text (2s): "Locali — Your Neighborhood, On-Demand"
2. Login flow (3s): Phone number → OTP → Logged in
3. Browsing (3s): User browsing available services
4. Booking (4s): Selecting service → Date → Time → Payment
5. Messaging (2s): User messaging provider
6. Outro text (2s): "Download Locali today"

**Status:**
- [ ] Video created and tested
- [ ] Audio (optional) is clear and professional
- [ ] No watermarks or branding from recording software

---

## Compliance Questions

### 1. Encryption Export
**Question:** Does your app use encryption?  
**Answer:** [x] Yes (Stripe + HTTPS)

### 2. Sign In with Apple
**Question:** Does your app require Sign In with Apple?  
**Answer:** [ ] No (uses phone OTP instead)  
**Explanation:** Phone-based OTP authentication provides adequate sign-in security without requiring Apple Sign In.

### 3. Third-Party SDKs
**Question:** Does your app use SDKs with tracking capabilities?  
**Answer:** [x] Yes (Stripe, Amplitude)  
**Explanation:** Data is used only for payment processing and app analytics, not user tracking.

### 4. Healthcare Data
**Question:** Does your app collect health information?  
**Answer:** [ ] No

### 5. Kids Category
**Question:** Is this app in the Kids category?  
**Answer:** [ ] No (Rated 4+)

---

## Business Contact Information

**Company Name:** C.H.A. LLC  
**Primary Contact:** CJ H. Adisa  
**Email:** cjhadisa@icloud.com  
**Phone:** +1 689-240-4642  
**Address:** [Your address for legal documents]  

---

## Submission Checklist

- [ ] All metadata entered correctly in App Store Connect
- [ ] Bundle ID matches (com.chaholdingsltd.locali)
- [ ] Build number incremented from previous version
- [ ] All screenshots uploaded (1170×2532)
- [ ] Privacy policy URL verified and live
- [ ] Support email configured
- [ ] App Privacy form completed
- [ ] Content rating questionnaire completed
- [ ] Version release notes added (e.g., "Initial release v1.0.0")
- [ ] Final review complete — no missing items
- [ ] Submit to Apple for review

---

## App Store Connect Submission Steps

1. **Open App Store Connect**  
   https://appstoreconnect.apple.com

2. **Navigate to Locali app** → Version 1.0.0

3. **Complete App Information**
   - Category: Lifestyle
   - Subtitle: "Your Neighborhood, On-Demand"
   - Keywords: [as specified above]

4. **Upload Screenshots**
   - iPhone 6.5" (1170×2532)
   - One per screen (5 total)

5. **Enter Description**
   - Use app description from section 4 above

6. **Privacy Policy**
   - Paste URL: https://locali.cjhadisa.com/privacy

7. **Support URL**
   - Paste URL: https://locali.cjhadisa.com/support

8. **Build Selection**
   - Select v1.0.0 build
   - Confirm TestFlight build matches

9. **App Privacy**
   - Complete app privacy form
   - Specify data collection categories

10. **Content Rating**
    - Complete questionnaire
    - Confirm 4+ rating

11. **Review Information**
    - Add demo account credentials if required
    - Add test payment details (Stripe test card)

12. **Version Release Notes**
    - "v1.0.0 Initial Release: Locali MVP with core booking, messaging, and payment features"

13. **Submit for Review**
    - Click "Submit for Review"
    - Wait for Apple review (typically 24-48 hours)

---

## Post-Submission

**Expected Timeline:**
- Initial review: 24-48 hours
- If rejected: Fix issues and resubmit
- If approved: App goes live on App Store

**Approval Notifications:**
- Email notification when status changes
- Check App Store Connect daily

---

**Submission Status:** Ready for upload  
**Target Launch Date:** April 12, 2026  
**Authority:** CJ H. Adisa (C.H.A. LLC)
