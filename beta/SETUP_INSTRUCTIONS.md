# Card #21: Manual Setup Instructions

This file documents the exact steps to complete Card #21 setup.

## Step 1: Create Google Form

Go to https://forms.google.com and create a new form named "Locali MVP Beta — Bug Report"

### Form Fields (in order):

1. **Platform** (Required, Dropdown)
   - Option 1: iOS (iPhone/iPad)
   - Option 2: Android (Phone/Tablet)

2. **Device Model** (Required, Short Answer)
   - Placeholder: "e.g., iPhone 14 Pro, Pixel 6 Pro"

3. **App Version** (Required, Short Answer)
   - Placeholder: "e.g., 0.1.0 (found in app Settings)"

4. **Bug Type** (Required, Multiple Choice)
   - Crash (app closes unexpectedly)
   - Blocker (feature completely broken, can't proceed)
   - Major (feature broken but workaround exists)
   - Minor (small bug, doesn't block usage)
   - UX (confusing flow, misleading text)

5. **Steps to Reproduce** (Required, Paragraph)
   - Placeholder: "1. Open app\n2. Tap...\n3. See..."

6. **Expected Behavior** (Required, Short Answer)
   - Placeholder: "What should have happened?"

7. **Actual Behavior** (Required, Short Answer)
   - Placeholder: "What actually happened instead?"

8. **Screenshot or Video** (Required, File Upload)
   - Allowed: PNG, JPG, MP4, MOV
   - Help text: "Attach a screenshot or 10-30 second video"

9. **Tester Name** (Optional, Short Answer)
   - Placeholder: "Your name"

10. **Tester Email** (Optional, Email)
    - Placeholder: "your@email.com"

### Form Settings:
- Collect email addresses: YES
- Show progress bar: YES
- Confirmation message: "Thank you! Your bug report has been submitted."

### Share Form Link:
Once created, copy the form link (looks like: https://forms.gle/XXXXXXX)

---

## Step 2: Create Trello Board

Go to https://trello.com and create a new board named "Locali — Beta Bugs"

### Create 5 Lists (in order):
1. New
2. Reviewing
3. In Progress
4. Ready for Verification
5. Done

### Create Labels:
- 🔴 Crash (red)
- 🟠 Blocker (orange)
- 🟡 Major (yellow)
- 🟢 Minor (green)
- 💙 UX (blue)
- Priority-Critical (red)
- Priority-High (orange)
- Priority-Medium (yellow)
- Priority-Low (green)
- Beta (purple)
- iOS (blue)
- Android (green)

### Set Up Butler Automation:

**Rule 1: Auto-label by severity**
- Trigger: Card created
- If description contains "Severity: Crash" → Add labels: "🔴 Crash", "Priority-Critical"
- Repeat for Blocker, Major, Minor, UX

**Rule 2: Critical bug notification**
- Trigger: Label "🔴 Crash" added
- Action: Add comment "@CJ CRITICAL BUG"

**Rule 3: Move to In Progress when assigned**
- Trigger: Card assigned
- Action: Move to "In Progress" list

---

## Step 3: Set Up Zapier (Form → Trello)

1. Go to https://zapier.com
2. Sign in with same account as Google Form
3. Create new Zap: Google Forms → Trello
4. **Trigger:** Google Forms → New Response
5. Select your "Locali MVP Beta — Bug Report" form
6. **Action:** Trello → Create Card
7. Map fields as follows:

```
Card Name: [Beta][{Platform}] {Bug Type} — {Expected Behavior}

Board: Locali — Beta Bugs
List: New

Description:
Environment
- Platform: {Platform}
- Device: {Device Model}
- App Version: {App Version}

Steps to Reproduce
{Steps to Reproduce}

Expected Behavior
{Expected Behavior}

Actual Behavior
{Actual Behavior}

Severity: {Bug Type}

Tester: {Tester Name} ({Tester Email})

Labels (to add):
- Beta
- {Platform}
```

8. Turn on Zap
9. Test: Submit a test bug to form, verify card appears in Trello

---

## Step 4: Invite Internal Testers

### iOS (TestFlight)
1. Go to App Store Connect
2. TestFlight → Internal Testing
3. Add testers (email addresses)
4. Send invitations
5. Share playbook link

### Android (Google Play Internal Testing)
1. Go to Google Play Console
2. Your app → Testing → Internal testing
3. Create internal testing track
4. Add testers (email addresses)
5. Share playbook link

---

## Step 5: Distribute Tester Playbook

Share this link with all testers:
```
https://github.com/cha-llc/Locali-App/blob/main/beta/TESTER_PLAYBOOK.md
```

Also share the feedback form link:
```
[Your Google Form URL]
```

---

## Step 6: Record Demo Video

Record a 2-3 minute video showing:
1. Tester phone: Open Expo app
2. Tester phone: Scan QR code to install Locali
3. Tester phone: Complete quick onboarding
4. Tester phone: Navigate to home screen
5. Tester phone: Find and tap a booking
6. Tester phone: Click "Submit feedback" (or use feedback form link)
7. Desktop: Fill out Google Form with test bug
8. Desktop: Zoom to form submission confirmation
9. Desktop: Refresh Trello board
10. Desktop: Show new card appeared in "New" list
11. Narration: "All tester feedback automatically flows into our bug tracking system"

Upload to YouTube (unlisted) or Google Drive, share link.

---

## Completion Checklist

- [ ] Google Form created
- [ ] Google Form link copied
- [ ] Trello board created
- [ ] 5 lists created
- [ ] 12 labels created
- [ ] Butler automation rules set up
- [ ] Zapier Zap created and tested
- [ ] iOS testers invited to TestFlight
- [ ] Android testers invited to Google Play
- [ ] Tester Playbook link shared
- [ ] Demo video recorded and linked
- [ ] All testers have form link

---

## Links to Save

| Item | URL |
|------|-----|
| Google Form | [INSERT] |
| Trello Board | [INSERT] |
| Tester Playbook | https://github.com/cha-llc/Locali-App/blob/main/beta/TESTER_PLAYBOOK.md |
| GitHub Repo | https://github.com/cha-llc/Locali-App |
| TestFlight Link | [INSERT] |
| Google Play Internal | [INSERT] |

---

**Status:** Ready for manual completion  
**Authority:** CJ H. Adisa  
**Date:** April 10, 2026
