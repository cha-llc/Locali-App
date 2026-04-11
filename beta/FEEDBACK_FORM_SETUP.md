# Locali MVP Beta — Feedback Intake Form Setup

## Form Details

**Form Name:** Locali MVP Beta — Bug Report  
**Purpose:** Centralized feedback collection for internal beta testers  
**Submission Action:** Auto-create Trello cards with Butler automation  

## Google Form Setup (Recommended)

1. Go to https://forms.google.com
2. Create new form: "Locali MVP Beta — Bug Report"
3. Add the following fields (in order):

### Form Fields

**1. Platform** (Required, Dropdown)
Options:
- iOS (iPhone/iPad)
- Android (Phone/Tablet)

**2. Device Model** (Required, Short Answer)
Placeholder: "e.g., iPhone 14 Pro, Pixel 6 Pro"

**3. App Version** (Required, Short Answer)
Placeholder: "e.g., 0.1.0 (found in app Settings)"

**4. Bug Type** (Required, Multiple Choice)
Options:
- Crash (app closes unexpectedly)
- Blocker (feature completely broken, can't proceed)
- Major (feature broken but workaround exists)
- Minor (small bug, doesn't block usage)
- UX (confusing flow, misleading text)

**5. Steps to Reproduce** (Required, Paragraph)
Placeholder: "1. Open app\n2. Tap...\n3. See..."

**6. Expected Behavior** (Required, Short Answer)
Placeholder: "What should have happened?"

**7. Actual Behavior** (Required, Short Answer)
Placeholder: "What actually happened instead?"

**8. Screenshot or Video** (Required, File Upload)
Allowed file types: Images (PNG, JPG), Video (MP4, MOV)
Help text: "Attach a screenshot or 10-30 second video showing the bug"

**9. Tester Name** (Optional, Short Answer)
Placeholder: "Your name (for follow-up questions)"

**10. Tester Email** (Optional, Email)
Placeholder: "your@email.com"

## Form Sharing

**Form Link:** https://forms.gle/[YOUR_FORM_ID]

**Share with testers:**
```
Here's the feedback form for reporting bugs:
https://forms.gle/locali-beta-feedback

Please report any issues you find using this form.
All submissions are automatically added to our tracking system.
```

## Form Response Settings

1. In Google Forms, click **Settings** (gear icon)
2. Enable: **Collect email addresses** (to link responses to testers)
3. Enable: **Show progress bar**
4. Set **Confirmation message:** "Thank you! Your bug report has been submitted and will be reviewed within 24 hours."

## Zapier Integration (Auto-Create Trello Cards)

To automatically create Trello cards from form submissions:

1. Go to https://zapier.com
2. Create new Zap: Google Forms → Trello
3. Trigger: New Google Forms response
4. Select your form
5. Action: Create Trello card with:
   - **Card Name:** `[Beta][{Platform}] {Bug Type} — {Expected Behavior}`
   - **List:** "Locali — Beta Bugs"
   - **Description:** 
     ```
     **Device:** {Device Model}
     **Version:** {App Version}
     **Type:** {Bug Type}
     
     **Steps to Reproduce:**
     {Steps to Reproduce}
     
     **Expected:** {Expected Behavior}
     **Actual:** {Actual Behavior}
     
     **Tester:** {Tester Name} ({Tester Email})
     ```
   - **Labels:** Auto-label by severity
     - Crash → "🔴 Crash" + "Priority-Critical"
     - Blocker → "🟠 Blocker" + "Priority-High"
     - Major → "🟡 Major" + "Priority-Medium"
     - Minor → "🟢 Minor" + "Priority-Low"
     - UX → "💙 UX" + "Priority-Low"

6. Test with a form submission
7. Verify Trello card is created automatically

## Manual Alternative (If Zapier Not Available)

If automation is not set up:
1. Designate someone to check form responses daily
2. Manually create Trello cards from responses
3. Link card to form response URL
4. Follow same card template (below)

## Trello Card Template

Every bug card should follow this format:

```
Title: [Beta][iOS] Crash on login with special characters

Environment: 
- Platform: iOS
- Device: iPhone 14 Pro
- App Version: 0.1.0
- Build: Apr 10, 2026

Steps to Reproduce:
1. Open app
2. Enter phone with special chars: "+1 (555) 123-4567"
3. Tap "Send OTP"
4. App crashes

Expected: OTP sent, verify screen appears
Actual: App closes to home screen

Severity: Blocker
Status: New
Tester: Jane Doe (jane@example.com)

Attachment: [screenshot.png, video.mp4]
```

---

**Form Ready:** Yes  
**Auto-Integration:** Pending (setup Zapier)  
**Live Date:** April 10, 2026
