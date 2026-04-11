# Card #21 — Documentation Index & Quick Reference

**Authority:** CJ H. Adisa (C.H.A. LLC)  
**Date:** April 10, 2026  
**Status:** Documentation Complete ✅ | Manual Setup Ready ✅  
**Commit:** 441100e  

---

## Quick Links

### For Testers
- **→ [Tester Playbook](beta/TESTER_PLAYBOOK.md)** — What to test, how to report bugs

### For Setup Team
- **→ [Setup Instructions](beta/SETUP_INSTRUCTIONS.md)** — Step-by-step manual setup (6 phases)
- **→ [Completion Checklist](beta/CARD_21_COMPLETION_CHECKLIST.md)** — 50+ item checklist

### For Reference
- **→ [Beta Directory README](beta/README.md)** — Overview and directory guide
- **→ [This File](CARD_21_INDEX.md)** — Quick index (you are here)

---

## All Files in `/beta/` Directory

| File | Purpose | Lines | Audience |
|------|---------|-------|----------|
| `README.md` | Directory overview | 290 | Everyone |
| `TESTER_PLAYBOOK.md` | Tester instructions | 1,000+ | Testers |
| `FEEDBACK_FORM_SETUP.md` | Google Form specs | 400+ | Setup team |
| `TRELLO_BOARD_SETUP.md` | Board structure + automation | 500+ | Setup team |
| `SETUP_INSTRUCTIONS.md` | Manual setup phases | 400+ | Setup team |
| `TRELLO_BUTLER_RULES.json` | Automation rules | JSON | Reference |
| `CARD_21_COMPLETION_CHECKLIST.md` | Full checklist | 1,500+ | Setup team + CJ |

---

## 7 Manual Setup Phases (For CJ)

### Phase 1: Create Google Form (15 min)
**Link:** [FEEDBACK_FORM_SETUP.md](beta/FEEDBACK_FORM_SETUP.md)

- Go to https://forms.google.com
- Create form: "Locali MVP Beta — Bug Report"
- Add 10 fields (specs in file)
- Enable email collection + progress bar
- Test with sample submission

### Phase 2: Create Trello Board (15 min)
**Link:** [TRELLO_BOARD_SETUP.md](beta/TRELLO_BOARD_SETUP.md)

- Go to https://trello.com
- Create board: "Locali — Beta Bugs"
- Create 5 lists (New → Reviewing → In Progress → Ready for Verification → Done)
- Create 12 labels (color-coded by severity)
- Test manually

### Phase 3: Set Up Zapier (25 min)
**Link:** [SETUP_INSTRUCTIONS.md](beta/SETUP_INSTRUCTIONS.md) Step 3

- Go to https://zapier.com
- Create Zap: Google Forms → Trello
- Map all form fields to card description
- Turn on Zap
- Test: Submit bug to form, verify card appears

### Phase 4: Configure Butler (20 min)
**Link:** [TRELLO_BUTLER_RULES.json](beta/TRELLO_BUTLER_RULES.json)

- Go to Trello board → Butler
- Create 8 automation rules
- Test auto-labeling by severity

### Phase 5: Invite Testers (10 min)
**Links:** [SETUP_INSTRUCTIONS.md](beta/SETUP_INSTRUCTIONS.md) Step 4

- TestFlight: Add 5+ testers, send invitations
- Google Play: Add 5+ testers, send invitations
- Share playbook: https://github.com/cha-llc/Locali-App/blob/main/beta/TESTER_PLAYBOOK.md
- Share form link (from Phase 1)

### Phase 6: Record Demo Video (18 min)
**Link:** [SETUP_INSTRUCTIONS.md](beta/SETUP_INSTRUCTIONS.md) Step 6

- Record 2-3 minute video (requirements in file)
- Show: Install → Onboarding → Booking → Form → Trello Card
- Upload to YouTube (unlisted) or Google Drive

### Phase 7: Collect Screenshots (10 min)
**Link:** [CARD_21_COMPLETION_CHECKLIST.md](beta/CARD_21_COMPLETION_CHECKLIST.md)

- Collect 8 screenshots (TestFlight, Play, Form, Responses, Board, Card, Zapier config, Zapier test)
- Save to shared location

---

## What Each Specification Covers

### Tester Playbook
- What this test is (MVP, bugs expected)
- What to test (6 core flows: Login, Onboarding, Booking, Payments, Messaging, Notifications)
- What NOT to report (feature requests, design opinions, duplicates)
- How to report bugs (3-step process)
- Code of conduct (5 do's, 5 don'ts)
- Expected response time (P0: 24h, P1: 48h)

### Google Form Specification
- 10 required fields
- Form response settings (email collection, progress bar, confirmation)
- Zapier integration mapping
- Manual fallback if Zapier fails
- Trello card template

### Trello Board Specification
- 5 workflow lists (New, Reviewing, In Progress, Ready for Verification, Done)
- 12 color-coded labels
- 6 Butler automation rules
- Card template format
- Daily workflow and permissions
- Access matrix (CJ: admin, Dev: create/edit, Testers: view/comment)

### Zapier Automation
- Trigger: New Google Form response
- Action: Create Trello card
- Field mapping (all 10 form fields → card description)
- Label assignment (severity-based)
- Testing procedure

### Setup Instructions
- Step-by-step for all 7 phases
- Time estimates for each phase
- Checklists for each phase
- Testing procedures

---

## Completion Gate (8 Deliverables)

✅ **1. Tester Playbook** (DONE)
- GitHub link: https://github.com/cha-llc/Locali-App/blob/main/beta/TESTER_PLAYBOOK.md

⏳ **2. Google Form** (MANUAL)
- Link: [To be created]
- Live responses: [To be verified]

⏳ **3. Trello Board** (MANUAL)
- Name: "Locali — Beta Bugs"
- 5 lists, 12 labels, 8 Butler rules

⏳ **4. TestFlight Invitations** (MANUAL)
- 5+ iOS testers confirmed

⏳ **5. Google Play Invitations** (MANUAL)
- 5+ Android testers confirmed

⏳ **6. Zapier Zap** (MANUAL)
- Tested and working
- Auto-creates cards < 5 min after form submission

⏳ **7. Demo Video** (MANUAL)
- 2-3 minutes, end-to-end flow
- Shows installation, form submission, card creation

⏳ **8. Screenshots** (MANUAL)
- 8 items: TestFlight, Play, Form, Responses, Board, Card, Zapier config, Zapier test

---

## Key Decisions (Locked)

✅ Single feedback source: Google Form only  
✅ Single bug board: Trello  
✅ Automation: Zapier + Butler (no manual card creation)  
✅ Platforms: TestFlight (iOS) + Google Play Internal (Android)  
✅ Test cycle: 1 week (April 10-17, 2026)  
✅ Severity: 5-tier (Crash, Blocker, Major, Minor, UX)  
✅ Response time: P0 (24h), P1 (48h), P2+ (scheduled)  
✅ Tester minimum: 5 per platform  

---

## Timeline

| Date | Event |
|------|-------|
| Apr 10 | Documentation complete ✅ |
| Apr 10 | Manual setup begins (CJ) |
| Apr 10 | All platforms ready |
| Apr 10 | Testers invited |
| Apr 10 | Card #21 marked COMPLETE |
| Apr 10-17 | Beta testing active |
| Apr 17 | Feedback collection ends |
| Apr 21 | v0.2 release with fixes |

---

## Total Execution Time

| Phase | Time |
|-------|------|
| Phase 1 (Google Form) | 15 min |
| Phase 2 (Trello) | 15 min |
| Phase 3 (Zapier) | 25 min |
| Phase 4 (Butler) | 20 min |
| Phase 5 (Testers) | 10 min |
| Phase 6 (Demo) | 18 min |
| Phase 7 (Screenshots) | 10 min |
| **TOTAL** | **~2-3 hours** |

---

## How to Use This Documentation

**If you're a tester:**
1. Read [TESTER_PLAYBOOK.md](beta/TESTER_PLAYBOOK.md)
2. Get form link from CJ
3. Install app and test 6 flows
4. Report bugs via form

**If you're setting up:**
1. Read [SETUP_INSTRUCTIONS.md](beta/SETUP_INSTRUCTIONS.md)
2. Follow each phase step-by-step
3. Use [CARD_21_COMPLETION_CHECKLIST.md](beta/CARD_21_COMPLETION_CHECKLIST.md) to track
4. Collect screenshots and demo video

**If you need details:**
1. Check [README.md](beta/README.md) for overview
2. Check specific specs (FEEDBACK_FORM_SETUP.md, TRELLO_BOARD_SETUP.md, etc.)
3. Check CARD_21_COMPLETION_CHECKLIST.md for full requirements

---

## Key Stats

- **Files:** 7 comprehensive documents
- **Total words:** ~5,000 words of specifications
- **Checklists:** 50+ detailed checklist items
- **Git commits:** 4 (cc9d475, c21df96, 7c07ca1, 441100e)
- **Documentation status:** 100% Complete ✅
- **Manual setup status:** Ready for CJ Execution ⏳

---

## Authority & Status

**Authority:** CJ H. Adisa (C.H.A. LLC)  
**Card:** #21 — Internal Test Group Deployment + Structured Feedback System  
**Status:** Documentation Complete ✅ | Manual Setup Ready ✅ | Awaiting CJ Execution ⏳  
**Date:** April 10, 2026  
**Latest Commit:** 441100e  

---

**Next Step:** CJ reviews SETUP_INSTRUCTIONS.md and executes 7 manual setup phases.  
**Card Complete:** When all 8 deliverables exist and are verified.
