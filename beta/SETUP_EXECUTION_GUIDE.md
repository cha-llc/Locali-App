# 🚀 Card #21 Setup Execution Guide

**Status:** Ready to Execute  
**Estimated Time:** 45 minutes  
**Prerequisites:** Google account, Trello account, Apple + Google developer accounts  

---

## Phase 1: Google Form Creation (10 min)

### Step 1.1: Create Form
1. Go to https://forms.google.com
2. Click **"+"** (Create new form)
3. Title: `Locali MVP Beta — Bug Report`
4. Description: `Report bugs found during beta testing. All submissions automatically create tracking cards.`
5. Enable **Collect email addresses** (Settings → gear icon)

### Step 1.2: Add Form Fields (In Order)

**Field 1: Platform**
- Type: Multiple choice
- Question: `What platform are you testing?`
- Options:
  - iOS (iPhone/iPad)
  - Android (Phone/Tablet)
- Required: Yes

**Field 2: Device Model**
- Type: Short answer
- Question: `Device model (e.g., iPhone 14 Pro, Pixel 6 Pro)`
- Required: Yes

**Field 3: App Version**
- Type: Short answer
- Question: `App version (found in Settings)`
- Required: Yes

**Field 4: Bug Type**
- Type: Multiple choice
- Question: `Bug severity`
- Options:
  - Crash (app closes unexpectedly)
  - Blocker (feature completely broken)
  - Major (broken but workaround exists)
  - Minor (small bug)
  - UX (confusing flow)
- Required: Yes

**Field 5: Steps to Reproduce**
- Type: Paragraph
- Question: `Exact steps to reproduce (numbered list)`
- Placeholder: `1. Open app\n2. Tap...\n3. See...`
- Required: Yes

**Field 6: Expected Behavior**
- Type: Short answer
- Question: `What should have happened?`
- Required: Yes

**Field 7: Actual Behavior**
- Type: Short answer
- Question: `What actually happened?`
- Required: Yes

**Field 8: Screenshot or Video**
- Type: File upload
- Question: `Attach screenshot or video (MP4, PNG, JPG)`
- File type: Images and video
- Required: Yes

**Field 9: Tester Name**
- Type: Short answer
- Question: `Your name (optional, for follow-up)`
- Required: No

**Field 10: Tester Email**
- Type: Email
- Question: `Your email (optional, for follow-up)`
- Required: No

### Step 1.3: Configure Settings
1. Click **Settings** (gear icon)
2. Enable: **Collect email addresses**
3. Enable: **Show progress bar**
4. Set confirmation message: 
   ```
   Thank you! Your bug report has been submitted and will be reviewed within 24 hours.
   ```
5. Click **Save**

### Step 1.4: Get Form Link
1. Click **Send** (top right)
2. Click **Link icon**
3. Copy the link: `https://forms.gle/[YOUR_FORM_ID]`
4. **Save this URL** — you'll need it for Zapier

---

## Phase 2: Trello Board Creation (10 min)

### Step 2.1: Create Board
1. Go to https://trello.com
2. Click **Create new board**
3. Name: `Locali — Beta Bugs`
4. Visibility: **Private** (team only)
5. Click **Create board**

### Step 2.2: Create Lists
Delete the default list and create exactly 5 lists:

1. **New** (bugs just submitted)
2. **Reviewing** (being investigated)
3. **In Progress** (being fixed)
4. **Ready for Verification** (fixed, awaiting tester)
5. **Done** (verified fixed, closed)

### Step 2.3: Create Labels
Click **Show menu** → **Labels** and create:

- **🔴 Crash** (Red)
- **🟠 Blocker** (Orange)
- **🟡 Major** (Yellow)
- **🟢 Minor** (Green)
- **💙 UX** (Blue)
- **Priority-Critical** (Red)
- **Priority-High** (Orange)
- **Priority-Medium** (Yellow)
- **Priority-Low** (Green)
- **Beta** (Purple)
- **iOS** (Blue)
- **Android** (Green)

### Step 2.4: Save Board URL
Click **Share** → Copy board URL  
**Save:** `https://trello.com/b/[BOARD_ID]/locali-beta-bugs`

---

## Phase 3: Zapier Automation (15 min)

### Step 3.1: Create Zapier Account
1. Go to https://zapier.com
2. Sign up or log in
3. Click **Create Zap**

### Step 3.2: Set Trigger (Google Forms)
1. **Trigger App:** Search for "Google Forms"
2. **Trigger Event:** Select "New Response"
3. Click **Continue**
4. **Connect Account:** Authorize your Google account
5. **Form:** Select "Locali MVP Beta — Bug Report"
6. Click **Test** → Submit a test response to the form
7. Click **Continue**

### Step 3.3: Set Action (Trello)
1. **Action App:** Search for "Trello"
2. **Action Event:** Select "Create Card"
3. Click **Continue**
4. **Connect Account:** Authorize your Trello account
5. **Board:** Select "Locali — Beta Bugs"
6. **List:** Select "New"

### Step 3.4: Map Form Fields to Trello

**Card Name:**
```
[Beta][{{Platform}}] {{Bug Type}} — {{Expected Behavior}}
```

**Description:**
```
**Environment**
- Platform: {{Platform}}
- Device: {{Device Model}}
- App Version: {{App Version}}

**Steps to Reproduce**
{{Steps to Reproduce}}

**Expected Behavior**
{{Expected Behavior}}

**Actual Behavior**
{{Actual Behavior}}

**Severity:** {{Bug Type}}

**Tester:** {{Tester Name}} ({{Tester Email}})
```

**Labels:**
- Beta
- {{Platform}} (use conditional: if Platform = iOS, add iOS label; if Android, add Android label)
- Auto-severity label (conditional):
  - If Bug Type = "Crash" → Add "🔴 Crash" + "Priority-Critical"
  - If Bug Type = "Blocker" → Add "🟠 Blocker" + "Priority-High"
  - If Bug Type = "Major" → Add "🟡 Major" + "Priority-Medium"
  - If Bug Type = "Minor" → Add "🟢 Minor" + "Priority-Low"
  - If Bug Type = "UX" → Add "💙 UX" + "Priority-Low"

7. Click **Continue**
8. Click **Test Zap** → Submit another test response
9. **Verify:** Check Trello board for new card
10. If card created successfully, click **Turn on Zap**

---

## Phase 4: TestFlight Setup (iOS) — 5 min

### Step 4.1: Access TestFlight
1. Go to https://appstoreconnect.apple.com
2. Click **My Apps**
3. Create or select "Locali" app
4. Click **TestFlight** tab

### Step 4.2: Create Internal Tester Group
1. Click **Testers** → **Internal Testers**
2. Click **+** to add testers
3. Add your internal testers (emails):
   - CJ H. Adisa
   - [Other testers]
4. Click **Add**
5. Accept invite

### Step 4.3: Build & Upload
1. In Xcode: `Product → Archive`
2. Click **Distribute App**
3. Select **App Store Connect**
4. Follow prompts to upload build
5. In App Store Connect, click **Internal Testing** → select build
6. Click **Save**
7. Testers will receive email invite

### Step 4.4: Get TestFlight Link
1. Click **Invite Link** in Internal Testing
2. Copy link: `https://testflight.apple.com/join/[CODE]`
3. Share with testers

---

## Phase 5: Google Play Internal Testing (Android) — 5 min

### Step 5.1: Access Play Console
1. Go to https://play.google.com/console
2. Select "Locali" app
3. Click **Testing** → **Internal testing**

### Step 5.2: Create Internal Tester List
1. Click **Create new list**
2. Name: `Locali MVP Beta Testers`
3. Add tester emails:
   - CJ H. Adisa
   - [Other testers]
4. Click **Save**

### Step 5.3: Build & Upload
1. Build Android APK/AAB in Expo
   ```bash
   eas build --platform android --profile preview
   ```
2. In Play Console, click **Internal testing**
3. Upload APK/AAB file
4. Click **Save**
5. Testers will receive email invite

### Step 5.4: Get Play Store Link
1. Click **Testers** tab
2. Copy link or share directly to tester list

---

## Phase 6: Distribute Playbook & Form Link (5 min)

### Step 6.1: Email to All Testers

**Subject:** Locali MVP Beta — Testing Instructions

**Body:**
```
Welcome to the Locali MVP Beta!

You've been invited to test our new neighborhood services app.
Before you start, please read the tester playbook:

📖 Playbook: [GitHub link to TESTER_PLAYBOOK.md]

Key points:
✅ Install the app from TestFlight (iOS) or Google Play Internal Testing (Android)
✅ Follow the playbook's test flows exactly
✅ Report bugs using this form ONLY: https://forms.gle/[YOUR_FORM_ID]
✅ No DMs, no Slack messages — use the form
✅ Include screenshots or videos with every bug report

Testing starts: April 10, 2026
Deadline: April 17, 2026

Questions? Reply to this email or use the form.

Thanks for helping us ship a solid product!

CJ H. Adisa
Locali MVP — Authority
C.H.A. LLC
```

### Step 6.2: Create Pinned Slack/Email reminder
Post daily reminder to testing channel:
```
📝 Don't forget: Report bugs using the feedback form, not Slack
🔗 Form: https://forms.gle/[YOUR_FORM_ID]
```

---

## Phase 7: Record Demo Video (5-10 min)

### Step 7.1: Script
```
1. Start with tester phone, app already installed
2. Show feedback form in browser (2 min)
3. Walk through filling out form with a real bug (3 min)
4. Submit form
5. Check Trello board (refresh) — show bug card auto-created (2 min)
6. End with "This is how bugs flow from testers to the dev team"
```

### Step 7.2: Record
- Use QuickTime (Mac) or built-in screen recording
- Keep under 3 minutes
- Save as MP4
- Upload to GitHub `/beta/DEMO_VIDEO.mp4`

---

## ✅ Verification Checklist

After completing all phases:

- [ ] Google Form created with 10 fields
- [ ] Zapier Zap connected (Google Forms → Trello)
- [ ] Test form submission created Trello card
- [ ] Trello board "Locali — Beta Bugs" created with 5 lists
- [ ] All labels created (11 labels)
- [ ] TestFlight internal testers added
- [ ] Google Play internal testing testers added
- [ ] Playbook PDF created
- [ ] Demo video recorded
- [ ] All testers received email with links
- [ ] Feedback form link is live and working
- [ ] One test bug successfully created Trello card

---

## 🎯 Final Checklist

| Item | Status |
|------|--------|
| Google Form | ✅ Created |
| Zapier Automation | ✅ Active |
| Trello Board | ✅ Created |
| TestFlight Setup | ✅ Complete |
| Google Play Setup | ✅ Complete |
| Tester Playbook | ✅ Distributed |
| Demo Video | ✅ Recorded |
| Testers Invited | ✅ Sent |
| Feedback Form Live | ✅ Active |

---

**Estimated Time to Complete:** 45–60 minutes  
**Target Go-Live Date:** April 10, 2026  
**Ready to Start:** Yes

Let me know when you've completed each phase!
