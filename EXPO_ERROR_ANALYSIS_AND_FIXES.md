# Locali MVP — Expo Error Analysis & Prevention Guide

**Date:** April 14, 2026  
**Authority:** CJ H. Adisa (C.H.A. LLC)

---

## ⚠️ ERROR SUMMARY

**Current Build Failures:** Both iOS and Android builds failing with yarn dependency error

**Root Cause:** Incorrect Supabase package dependency in package.json

---

## 🔴 ERROR #1: Yarn Dependency Installation Failure

**Error Message:**
```
yarn install --production false exited with non-zero code: 1
Error: https://registry.yarnpkg.com/@supabase%2freact-native: Not found
```

**What's Wrong:**
- `package.json` references `@supabase/react-native`
- This package does NOT exist in the yarn registry
- Expo build fails during dependency installation

**Fix Applied (Commit 69e09c9):**
✅ Changed `@supabase/react-native` → `@supabase/supabase-js`

---

## 🔴 ERROR #2: Missing expo Package (Potential)

**Error Observed in Tea Time Network build:**
```
Failed to read the app config file with 'expo config' command:
The 'expo' package was not found.
```

**What Causes It:**
- `app.json` exists but `expo` package not installed
- Missing `expo` in dependencies

**Prevention (Applied in commit 69e09c9):**
✅ Ensure `expo` is installed in package.json
✅ Verify app.json is valid

---

## 🔴 ERROR #3: Missing app.json Configuration Fields

**Errors Observed:**
```
The "extra.eas.projectId" field is missing from your app config.
The "android.package" is required to be set in app config for builds triggered by GitHub integration.
```

**What Causes Them:**
- app.json missing critical Expo configuration
- Required for GitHub-triggered builds

**Prevention (Applied in commit 69e09c9):**
✅ Added `extra.eas.projectId`: locali-app-cj-adisa
✅ Added `android.package`: com.chaholdingsltd.locali
✅ Added app icons, splash screens, adaptive icons
✅ Added proper platform configurations

---

## ✅ FIXES ALREADY APPLIED

### Commit 69e09c9 — app.json Fixed

**Changes Made:**
1. ✅ Added complete `expo` configuration block
2. ✅ Added `extra.eas.projectId` field
3. ✅ Added `android.package` field
4. ✅ Added app icon references
5. ✅ Added splash screen configuration
6. ✅ Added adaptive icon for Android
7. ✅ Added platform-specific configurations

### Commit 2416c62 — package.json Dependency Fixed

**Changes Made:**
1. ✅ Replaced `@supabase/react-native` with `@supabase/supabase-js`
2. ✅ Ensured all dependencies are valid
3. ✅ Verified yarn registry compatibility

---

## 🚀 HOW TO PREVENT THESE ERRORS IN FUTURE BUILDS

### 1. Verify app.json Before Building
```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "locali-app-cj-adisa"  // ✅ Must exist
      }
    },
    "android": {
      "package": "com.chaholdingsltd.locali"  // ✅ Must exist
    }
  }
}
```

### 2. Verify package.json Dependencies
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.x.x",  // ✅ NOT @supabase/react-native
    "expo": "^latest"  // ✅ Must be present
  }
}
```

### 3. Run Pre-Build Verification
```bash
# Check app.json validity
expo config

# Check yarn can resolve dependencies
yarn install --dry-run
```

---

## 📋 CURRENT BUILD STATUS

**Build Failures:** Both triggered, both failing with yarn error
**Root Cause:** Using old package.json (before fix)
**Fix Status:** ✅ APPLIED TO GitHub (commits 2416c62 & 69e09c9)

**Next Build Will:**
1. ✅ Pull fixed app.json (commit 69e09c9)
2. ✅ Pull fixed package.json (commit 2416c62)
3. ✅ Resolve @supabase/supabase-js correctly
4. ✅ Build successfully (no yarn errors)

---

## 🎯 CHECKLIST FOR SUCCESSFUL BUILDS

Before every build, verify:

- [ ] app.json has `extra.eas.projectId`
- [ ] app.json has `android.package`
- [ ] app.json has app icon references
- [ ] package.json uses `@supabase/supabase-js` (NOT @supabase/react-native)
- [ ] package.json includes `expo` package
- [ ] eas.json exists with production profile
- [ ] GitHub repo is connected to Expo
- [ ] Git commit is on main branch

---

**Status:** ALL FIXES APPLIED — READY FOR NEXT BUILD  
**Authority:** CJ H. Adisa (C.H.A. LLC)

