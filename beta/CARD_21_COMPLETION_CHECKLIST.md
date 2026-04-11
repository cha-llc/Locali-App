# Card #21 Completion Checklist — Internal Test Group Deployment

**Card:** #21  
**Title:** Internal Test Group Deployment + Structured Feedback System  
**Authority:** CJ H. Adisa (C.H.A. LLC)  
**Status:** IN PROGRESS (manual setup phase)  
**Due:** Sprint 4 — Day 1 (April 10, 2026)  

---

## DELIVERABLE REQUIREMENTS (From Card Spec)

### Required #1: Internal Tester Groups Created
- [ ] iOS TestFlight internal testers group created
- [ ] At least 5 iOS testers invited + can install
- [ ] Android Google Play internal testing group created
- [ ] At least 5 Android testers invited + can install
- [ ] All testers confirmed they received invitations

### Required #2: Tester Instructions Document
- [ ] Tester Playbook created ✅ `beta/TESTER_PLAYBOOK.md`
- [ ] Document contains all mandatory sections:
  - [ ] What this test is (MVP, not polished)
  - [ ] What to test (Login, Onboarding, Booking, Payments, Messaging, Notifications)
  - [ ] What NOT to report (feature requests, design opinions, etc.)
  - [ ] How to report bugs (link to form)
  - [ ] How to submit screenshots/videos
  - [ ] Expected response time
- [ ] Document link shared with all testers

### Required #3: Central Feedback Intake Form
- [ ] Google Form created: "Locali MVP Beta — Bug Report"
- [ ] Form contains all required fields:
  - [ ] Platform (iOS / Android) — Dropdown, required
  - [ ] Device Model — Short answer, required
  - [ ] App Version — Short answer, required
  - [ ] Bug Type (Crash/Blocker/Major/Minor/UX) — Multiple choice, required
  - [ ] Steps to Reproduce — Paragraph, required
  - [ ] Expected vs Actual Behavior — Short answers, required
  - [ ] Screenshot or Video Upload — File upload, required
  - [ ] Tester Name/Email — Short answer + email, optional
- [ ] Form settings:
  - [ ] Collect email addresses enabled
  - [ ] Progress bar enabled
  - [ ] Confirmation message set
- [ ] Form link copied and ready to share
- [ ] Form tested: Submit a test response, verify it works

### Required #4: Trello Bug Board + Card Template
- [ ] Trello board created: "Locali — Beta Bugs"
- [ ] 5 lists created (in order):
  - [ ] New
  - [ ] Reviewing
  - [ ] In Progress
  - [ ] Ready for Verification
  - [ ] Done
- [ ] 12 labels created:
  - [ ] 🔴 Crash (red)
  - [ ] 🟠 Blocker (orange)
  - [ ] 🟡 Major (yellow)
  - [ ] 🟢 Minor (green)
  - [ ] 💙 UX (blue)
  - [ ] Priority-Critical (red)
  - [ ] Priority-High (orange)
  - [ ] Priority-Medium (yellow)
  - [ ] Priority-Low (green)
  - [ ] Beta (purple)
  - [ ] iOS (blue)
  - [ ] Android (green)
- [ ] Card template documented and ready to use

### Required #5: Trello Automation (Butler Rules)
- [ ] Butler automation enabled on board
- [ ] 8 Butler rules configured:
  - [ ] Auto-label Crash bugs
  - [ ] Auto-label Blocker bugs
  - [ ] Auto-label Major bugs
  - [ ] Auto-label Minor bugs
  - [ ] Auto-label UX bugs
  - [ ] Critical bug escalation (notify CJ)
  - [ ] Auto-move on assignment
  - [ ] Auto-add Beta label
- [ ] At least one test bug created and verified automation fires

### Required #6: Form → Trello Automation (Zapier)
- [ ] Zapier account connected
- [ ] Zapier Zap created: Google Forms → Trello
- [ ] Zap trigger: Google Forms → New Response (correct form selected)
- [ ] Zap action: Trello → Create Card
- [ ] All field mappings configured correctly:
  - [ ] Card name format: `[Beta][{Platform}] {Bug Type} — {Expected Behavior}`
  - [ ] Board: Locali — Beta Bugs
  - [ ] List: New
  - [ ] Description includes: Environment, Steps, Expected, Actual, Severity, Tester
  - [ ] Labels: Beta + Platform
- [ ] Zap tested with real form submission:
  - [ ] Submit test bug to form
  - [ ] Verify Trello card created within 5 minutes
  - [ ] Verify card content matches form submission
  - [ ] Verify labels applied correctly

---

## DELIVERABLE PROOF (Screenshots & Documentation)

### Documentation (In Repo) ✅
- [x] `beta/TESTER_PLAYBOOK.md` — Complete tester instructions
- [x] `beta/FEEDBACK_FORM_SETUP.md` — Form field spec + integration guide
- [x] `beta/TRELLO_BOARD_SETUP.md` — Board structure + automation rules
- [x] `beta/SETUP_INSTRUCTIONS.md` — Step-by-step manual setup guide
- [x] `beta/TRELLO_BUTLER_RULES.json` — Butler rules reference

### Screenshots to Capture
- [ ] TestFlight internal testers page (showing invited testers)
- [ ] Google Play Internal Testing page (showing invited testers)
- [ ] Google Form (showing all 10 fields)
- [ ] Google Form responses view (showing test submission)
- [ ] Trello board (showing all 5 lists + 12 labels)
- [ ] Trello board with 1+ test bug cards
- [ ] Zapier Zap configuration (trigger + action mappings)
- [ ] Zapier Zap test run (successful)

### Demo Video (2–3 minutes)
- [ ] Open Expo app on phone
- [ ] Scan QR to install Locali
- [ ] Complete quick onboarding
- [ ] Navigate to home screen
- [ ] Find test booking
- [ ] Navigate to feedback form link
- [ ] Desktop: Fill out Google Form with test bug
- [ ] Desktop: Submit form
- [ ] Desktop: Refresh Trello board
- [ ] Desktop: Show new card in "New" list with correct labels
- [ ] Narration: "All tester feedback automatically flows into our bug tracking system"

---

## FINAL CHECKLIST

### Infrastructure Ready
- [ ] Google Form created and tested
- [ ] Trello board created with 5 lists + 12 labels
- [ ] Butler automation rules configured (8 rules)
- [ ] Zapier Zap created and tested

### Testers Ready
- [ ] TestFlight tester group created + invitations sent
- [ ] Google Play internal testing group created + invitations sent
- [ ] Minimum 5 testers per platform confirmed

### Documentation Ready
- [ ] Tester Playbook link shared with testers
- [ ] Feedback form link shared with testers
- [ ] All setup docs in GitHub repo

### Demo Complete
- [ ] Demo video recorded (2–3 minutes)
- [ ] Demo video uploaded
- [ ] Demo video link available

### Verification
- [ ] Test bug submitted via form
- [ ] Trello card created automatically
- [ ] Card labels applied correctly
- [ ] Card in correct list (New)
- [ ] All required fields populated

---

## MANUAL SETUP CHECKLIST

| Step | Task | Status | Notes |
|------|------|--------|-------|
| 1 | Create Google Form | ⏳ | Follow FEEDBACK_FORM_SETUP.md |
| 2 | Create Trello board | ⏳ | Follow TRELLO_BOARD_SETUP.md |
| 3 | Create Trello labels (12) | ⏳ | Reference: TRELLO_BUTLER_RULES.json |
| 4 | Set up Butler rules (8) | ⏳ | One rule per severity level + escalation |
| 5 | Create Zapier Zap | ⏳ | Map all fields as specified |
| 6 | Test form → Trello | ⏳ | Submit test bug, verify card created |
| 7 | Invite iOS testers | ⏳ | TestFlight, minimum 5 |
| 8 | Invite Android testers | ⏳ | Google Play internal, minimum 5 |
| 9 | Share playbook link | ⏳ | GitHub link: beta/TESTER_PLAYBOOK.md |
| 10 | Share form link | ⏳ | Google Form link |
| 11 | Record demo video | ⏳ | 2–3 minutes, end-to-end flow |
| 12 | Collect screenshots | ⏳ | TestFlight, Play, Form, Trello, Zapier |

---

## COMPLETION SIGNATURES

**When all checklist items are complete, sign below:**

Prepared By: Claude (Assistant)  
Date Prepared: April 10, 2026  
Status: Documentation + setup guides complete. Awaiting manual platform setup.

Reviewed By: [CJ H. Adisa to confirm]  
Date Reviewed: [TBD]  
Status: [APPROVED / CHANGES REQUESTED]

Implemented By: [Manual setup phase]  
Date Completed: [TBD]  
Status: [COMPLETE / IN PROGRESS]

---

## LINKS TO SAVE

| Item | URL | Status |
|------|-----|--------|
| GitHub Repo | https://github.com/cha-llc/Locali-App | ✅ |
| Tester Playbook | https://github.com/cha-llc/Locali-App/blob/main/beta/TESTER_PLAYBOOK.md | ✅ |
| Setup Instructions | https://github.com/cha-llc/Locali-App/blob/main/beta/SETUP_INSTRUCTIONS.md | ✅ |
| Google Form | [To be created] | ⏳ |
| Trello Board | [To be created] | ⏳ |
| Zapier Zap | [To be created] | ⏳ |
| Demo Video | [To be recorded] | ⏳ |
| TestFlight Link | [From App Store Connect] | ⏳ |
| Google Play Internal | [From Play Console] | ⏳ |

---

**Authority:** CJ H. Adisa, C.H.A. LLC  
**Card Status:** IN PROGRESS  
**Go-Live Target:** April 10, 2026
