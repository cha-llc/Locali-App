# Locali MVP — Beta Testing Infrastructure

**Card:** #21  
**Title:** Internal Test Group Deployment + Structured Feedback System  
**Authority:** CJ H. Adisa (C.H.A. LLC)  
**Date:** April 10, 2026  
**Status:** Documentation complete, manual platform setup in progress  

---

## Overview

This directory contains all documentation, specifications, and instructions for deploying the Locali MVP to an internal tester group and establishing a centralized, automated feedback pipeline.

**The goal:** No DMs, no scattered notes, no chaos. Every bug goes to one place. Every tester knows what to test. Automation handles the rest.

---

## Files in This Directory

| File | Purpose | Audience |
|------|---------|----------|
| `TESTER_PLAYBOOK.md` | What testers do, how they report bugs | Internal testers |
| `FEEDBACK_FORM_SETUP.md` | How to build the Google Form | Setup team |
| `TRELLO_BOARD_SETUP.md` | How to build the Trello board + automation | Setup team |
| `SETUP_INSTRUCTIONS.md` | Step-by-step manual setup guide (6 phases) | Setup team |
| `TRELLO_BUTLER_RULES.json` | All 8 Butler automation rules | Reference |
| `CARD_21_COMPLETION_CHECKLIST.md` | Complete checklist with 50+ items | Setup team + CJ |
| `README.md` | This file | Everyone |

---

## What Gets Built

### 1. Tester Playbook (✅ Ready)
**File:** `TESTER_PLAYBOOK.md`

A comprehensive guide for internal testers covering:
- What this test is (MVP, bugs expected)
- What to test (6 core flows: Login, Onboarding, Booking, Payments, Messaging, Notifications)
- What NOT to report (feature requests, design opinions, duplicates)
- How to report bugs (link to form)
- How to submit screenshots/videos
- Expected response time
- Code of conduct
- Contact & support

**Length:** ~1000 words  
**Format:** Markdown  
**Share with:** All internal testers via GitHub link

---

### 2. Feedback Intake Form (⏳ To be created)
**File:** `FEEDBACK_FORM_SETUP.md` (specs)

A Google Form named "Locali MVP Beta — Bug Report" with:

**10 Required Fields:**
1. Platform (iOS / Android)
2. Device Model (e.g., iPhone 14 Pro)
3. App Version (e.g., 0.1.0)
4. Bug Type (Crash / Blocker / Major / Minor / UX)
5. Steps to Reproduce
6. Expected Behavior
7. Actual Behavior
8. Screenshot or Video (file upload)
9. Tester Name (optional)
10. Tester Email (optional)

**Submission Actions:**
- Collect email addresses
- Show progress bar
- Send confirmation message
- Auto-create Trello card (via Zapier)

**Share with:** All testers via form link

---

### 3. Trello Bug Board (⏳ To be created)
**File:** `TRELLO_BOARD_SETUP.md` (specs)

A Trello board named "Locali — Beta Bugs" with:

**5 Lists (workflow):**
1. New (bugs just submitted)
2. Reviewing (being investigated)
3. In Progress (being fixed)
4. Ready for Verification (fixed, awaiting confirmation)
5. Done (verified fixed)

**12 Labels (categorization):**
- Severity: 🔴 Crash, 🟠 Blocker, 🟡 Major, 🟢 Minor, 💙 UX
- Priority: Priority-Critical, Priority-High, Priority-Medium, Priority-Low
- Meta: Beta, iOS, Android

**Automation Rules (8 total):**
- Auto-label by severity
- Auto-escalate critical bugs (notify CJ)
- Auto-move to In Progress when assigned
- Auto-add Beta label to all cards

**Access:**
- CJ (admin): Full access
- Dev team: Can create, edit, assign
- Testers: Can view, comment, attach files

---

### 4. Zapier Automation (⏳ To be created)
**File:** `SETUP_INSTRUCTIONS.md` (step 3)

A Zapier Zap that automatically:
1. **Trigger:** New Google Form response submitted
2. **Action:** Create Trello card with:
   - Card name: `[Beta][{Platform}] {Bug Type} — {Expected Behavior}`
   - Description: All form fields structured
   - Board: Locali — Beta Bugs
   - List: New
   - Labels: Beta + Platform
   - Auto-labels applied via Butler (severity, priority)

**Testing:** Submit test bug to form, verify card created within 5 minutes

---

## How It Works

### End-to-End Feedback Flow

```
Tester finds bug
     ↓
Tester opens feedback form link
     ↓
Tester fills out 10 required fields
     ↓
Tester clicks "Submit"
     ↓
Google Form collects response
     ↓
Zapier detects new response (instant)
     ↓
Zapier creates Trello card (< 5 min)
     ↓
Butler rules apply labels (auto)
     ↓
If Crash/Blocker: CJ gets notified
     ↓
Card appears in "New" list on board
     ↓
Dev team sees card in morning standup
     ↓
Dev assigns to owner, moves to "In Progress"
     ↓
Dev fixes bug, pushes commit
     ↓
Dev moves card to "Ready for Verification"
     ↓
Tester confirms fix, card moves to "Done"
     ↓
Weekly bug report generated
```

---

## Manual Setup Phase

All documentation is ready. To complete setup, follow:

1. **Create Google Form** → See `FEEDBACK_FORM_SETUP.md`
2. **Create Trello Board** → See `TRELLO_BOARD_SETUP.md`
3. **Set Up Zapier** → See `SETUP_INSTRUCTIONS.md` (Step 3)
4. **Configure Butler** → See `TRELLO_BUTLER_RULES.json`
5. **Invite Testers** → See `SETUP_INSTRUCTIONS.md` (Step 4)
6. **Test End-to-End** → Submit test bug, verify card appears

**Full checklist:** See `CARD_21_COMPLETION_CHECKLIST.md`

---

## Key Decisions (Locked)

✅ **Single feedback source:** Google Form only (no DMs, Slack, email)  
✅ **Single bug board:** Trello (one view of truth)  
✅ **Automation:** Zapier + Butler (no manual card creation)  
✅ **Testing platforms:** TestFlight (iOS) + Google Play Internal (Android)  
✅ **Test cycle:** 1 week (Apr 10–17, 2026)  
✅ **Severity levels:** 5-tier system (Crash, Blocker, Major, Minor, UX)  
✅ **Response time:** P0 (24h), P1 (48h), P2+ (scheduled)  

---

## Success Metrics

### By April 17, 2026:

- ✅ Minimum 5 testers on iOS
- ✅ Minimum 5 testers on Android
- ✅ All testers have playbook link + form link
- ✅ At least 10 bugs reported via form
- ✅ All 10 bugs auto-created as Trello cards
- ✅ 0 bugs lost to side-channel communication
- ✅ Average response time < 24h for critical bugs
- ✅ 100% of critical bugs escalated to CJ within 5 minutes

---

## Deliverables (Completion Gate)

Card #21 is NOT complete unless ALL of these exist and are verifiable:

1. ✅ Tester Playbook (GitHub link)
2. ⏳ Google Form (link + live responses)
3. ⏳ Trello board (5 lists, 12 labels, 8 Butler rules)
4. ⏳ TestFlight invitations (5+ testers)
5. ⏳ Google Play invitations (5+ testers)
6. ⏳ Zapier Zap (tested, working)
7. ⏳ Demo video (2–3 minutes, end-to-end)
8. ⏳ Screenshots (TestFlight, Play, Form, Trello, Zapier)

---

## Important Notes

### For Testers
- **No feature requests** — This is a bug hunt, not a feature wishlist
- **Be specific** — "Doesn't work" is not a bug report
- **Provide proof** — Screenshots or videos are required
- **One bug = one form submission** — Don't bundle multiple bugs
- **Test in both WiFi and cellular** — Network matters

### For Setup Team
- **Follow specs exactly** — No improvisation on form fields or Trello structure
- **Test every automation** — Submit test bug, verify card appears
- **Double-check labels** — Severity auto-labeling must work
- **Verify permissions** — Testers can submit, dev can fix, CJ can manage

### For Dev Team
- **Check board daily** — Pick up bugs from "New" list
- **Triage by severity** — P0 bugs get immediate attention
- **Link commits** — Reference Trello card ID in commit messages
- **Move cards** → "In Progress" (when assigned) → "Ready for Verification" (when fixed) → "Done" (when verified)

---

## Timeline

| Date | Event |
|------|-------|
| Apr 10 | Setup documentation complete |
| Apr 10 | Manual platform setup begins |
| Apr 10 | Google Form created + tested |
| Apr 10 | Trello board created + automated |
| Apr 10 | Zapier Zap created + tested |
| Apr 10 | Testers invited (iOS + Android) |
| Apr 10 | Demo video recorded |
| Apr 10 | Card #21 marked COMPLETE |
| Apr 10–17 | Beta testing active (1 week) |
| Apr 17 | Feedback collection ends |
| Apr 21 | v0.2 release (bugs fixed) |

---

## Contacts

| Role | Email | Platform |
|------|-------|----------|
| Product Authority | cjhadisa@icloud.com | Email |
| Bug Board Owner | [CJ] | Trello |
| Form Admin | [CJ] | Google Forms |
| TestFlight Admin | [CJ] | App Store Connect |
| Play Console Admin | [CJ] | Google Play |

---

## Questions?

Check these files in order:
1. `TESTER_PLAYBOOK.md` — If you're a tester
2. `SETUP_INSTRUCTIONS.md` — If you're setting up
3. `CARD_21_COMPLETION_CHECKLIST.md` — If you need full details

---

**Authority:** CJ H. Adisa, C.H.A. LLC  
**Card:** #21  
**Status:** Documentation complete, manual setup in progress  
**Go-Live:** April 10, 2026
