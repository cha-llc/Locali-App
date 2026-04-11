# Locali MVP Beta — Trello Board Setup & Automation

## Board Configuration

**Board Name:** Locali — Beta Bugs  
**Team:** C.H.A. LLC  
**Purpose:** Centralized bug tracking + automated intake from feedback form  

## List Structure

Create the following lists (in order):

1. **New** — Bugs just submitted (from form)
2. **Reviewing** — Being investigated
3. **In Progress** — Being fixed
4. **Ready for Verification** — Fixed, awaiting tester confirmation
5. **Done** — Verified fixed, closed

## Card Template

Every bug card must follow this exact format:

```
TITLE:
[Beta][Platform] Short description
Example: [Beta][iOS] Crash on login with special characters

DESCRIPTION:
Environment
- Platform: iOS or Android
- Device: [exact model, e.g., iPhone 14 Pro]
- App Version: [e.g., 0.1.0]
- OS Version: [e.g., iOS 17.2]
- Build Date: [e.g., Apr 10, 2026]

Steps to Reproduce
1. [First step]
2. [Second step]
3. [etc.]

Expected Behavior
[What should happen]

Actual Behavior
[What actually happens]

Severity
[Crash | Blocker | Major | Minor | UX]

LABELS (Applied Automatically):
- 🔴 Crash (if severity = Crash)
- 🟠 Blocker (if severity = Blocker)
- 🟡 Major (if severity = Major)
- 🟢 Minor (if severity = Minor)
- 💙 UX (if severity = UX)
- Priority-Critical (Crash + Blocker)
- Priority-High (Blocker)
- Priority-Medium (Major)
- Priority-Low (Minor + UX)
- Beta
- iOS or Android

CUSTOM FIELDS:
- Tester Name: [from form]
- Tester Email: [from form]
- Submitted: [date]
- First Seen: [earliest occurrence]
- Resolved: [date fixed, if applicable]

ATTACHMENT:
- Screenshots
- Videos
- Links to form submission
```

## Trello Butler Automation Rules

Create the following Butler rules (one per action):

### Rule 1: New Form Submission → Create Card + Notify CJ

**Trigger:** Card created with label "Beta"  
**Action:** 
```
Add comment: "@CJ New bug report: {Card Name}"
```

### Rule 2: Auto-Label by Severity

**Trigger:** Card created  
**Condition:** Card description contains "Severity: Crash"  
**Action:** Add label "🔴 Crash", "Priority-Critical"

**Repeat for:**
- "Severity: Blocker" → "🟠 Blocker", "Priority-High"
- "Severity: Major" → "🟡 Major", "Priority-Medium"
- "Severity: Minor" → "🟢 Minor", "Priority-Low"
- "Severity: UX" → "💙 UX", "Priority-Low"

### Rule 3: Critical Bugs Escalation

**Trigger:** Label added is "🔴 Crash" OR "Priority-Critical"  
**Action:** 
```
Add comment: "@CJ CRITICAL: {Card Name}"
Send notification: CJ email
```

### Rule 4: Move to "In Progress" When Assigned

**Trigger:** Card assigned to a member  
**Action:** Move card to "In Progress" list

### Rule 5: Auto-Move to "Ready for Verification"

**Trigger:** Status updated to "Fixed"  
**Action:** Move card to "Ready for Verification"

### Rule 6: Close When Verified

**Trigger:** Status updated to "Verified"  
**Action:** Move card to "Done", mark as complete

## Zapier Integration (Form → Trello)

### Step-by-Step Zapier Setup

1. **Go to zapier.com** and create new Zap
2. **Trigger:** Google Forms → New Response
3. **Select your Locali Beta feedback form**
4. **Action:** Trello → Create Card
5. **Map Fields:**

```
Card Name: [Beta][{Platform}] {Bug Type} — {Expected Behavior}

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

Severity
{Bug Type}

List: Locali — Beta Bugs → New
Board: Locali — Beta Bugs

Labels:
- Beta
- {Platform}
- (Auto-label based on severity via Butler)

Custom Fields:
- Tester Name: {Tester Name}
- Tester Email: {Tester Email}
- Submitted: {Today}
```

6. **Test:** Submit a test bug through the feedback form
7. **Verify:** Check Trello board for new card

## Manual Fallback (If Zapier Not Connected)

If Zapier automation fails:

1. **Designate a person** to check form responses daily
2. **Manually create Trello card** from response
3. **Copy all fields** from form into card description
4. **Apply labels** according to severity
5. **Add comment:** Link to original form response
6. **Set priority:** Based on severity

## Board Access & Permissions

| Role | Access |
|------|--------|
| CJ (Admin) | Full access, can close bugs |
| Dev Team | Can create, edit, assign cards |
| QA/Testers | Can view, add comments, attach screenshots |
| Viewers | Read-only |

## Daily Workflow

**Every morning:**
1. Check "New" list for overnight submissions
2. Triage by severity
3. Assign P0 (Crash) bugs immediately
4. Assign P1 (Blocker) bugs within 2 hours

**Every fix:**
1. Move to "In Progress"
2. Link to branch/commit
3. When merged, move to "Ready for Verification"

**Verification:**
1. Tester confirms fix
2. Move to "Done"
3. Close card

---

**Board Status:** Ready to Create  
**Automation:** Ready to Deploy  
**Go-Live:** April 10, 2026
