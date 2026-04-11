# 📊 Card #8: Backend Infrastructure (React Native + Supabase)

**Status:** ✅ Complete  
**Platform:** Android (React Native / Expo)  
**Date:** April 10, 2026  

---

## 🎯 Overview

Card #8 establishes the complete backend infrastructure for Locali MVP using:

- **React Native (Expo)** – Cross-platform mobile framework
- **Supabase PostgreSQL** – Backend database
- **Supabase Auth** – Phone OTP authentication
- **Expo Router** – Navigation and file-based routing
- **React Navigation** – Mobile navigation patterns
- **TypeScript** – Type-safe development

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    LOCALI MOBILE APP                    │
├─────────────────────────────────────────────────────────┤
│ MOBILE (React Native / Expo - Android)                  │
│ ├── app/screens/        (UI screens)                    │
│ ├── app/components/      (Reusable components)          │
│ ├── app/navigation/      (Navigation stacks)            │
│ ├── app/lib/             (Utilities)                    │
│ ├── app/hooks/           (Custom hooks)                 │
│ └── app/types/           (TypeScript types)             │
└─────────────────────────────────────────────────────────┘
                            │
                    ┌───────▼────────┐
                    │   Supabase     │
                    ├────────────────┤
                    │ PostgreSQL DB  │
                    │ Auth (Phone)   │
                    │ Real-time      │
                    │ Storage        │
                    └────────────────┘
```

---

## 📁 Project Structure

```
locali-mvp/
├── app/                              # Main app code
│   ├── _layout.tsx                   # Root layout
│   ├── providers/
│   │   └── AuthProvider.tsx          # Auth context
│   ├── screens/                      # Screen components
│   │   ├── SplashScreen.tsx
│   │   ├── auth/
│   │   │   ├── SignUpPhone.tsx
│   │   │   └── VerifyOTP.tsx
│   │   ├── home/
│   │   │   └── HomeScreen.tsx
│   │   ├── search/
│   │   ├── bookings/
│   │   ├── messages/
│   │   └── profile/
│   ├── navigation/                   # Navigation stacks
│   │   ├── RootNavigator.tsx
│   │   ├── AuthStack.tsx
│   │   └── AppStack.tsx
│   ├── lib/                          # Utilities
│   │   ├── supabase.ts              # Supabase client
│   │   ├── auth.ts                  # Auth functions
│   │   └── database.ts              # Database queries
│   ├── hooks/                        # Custom hooks
│   │   └── useAuth.ts               # Auth state hook
│   ├── components/                   # Reusable components
│   └── types/                        # TypeScript types
├── assets/                           # Images, icons, fonts
├── supabase/                         # Database
│   └── migrations/                   # SQL migrations
│       └── 001_initial_schema.sql
├── docs/                             # Documentation
│   └── ARCHITECTURE.md
├── app.json                          # Expo config
├── package.json
├── tsconfig.json
├── .env.example
├── index.js                          # Expo entry point
├── README.md
└── .gitignore
```

---

## 🚀 Key Features

### 1. **Mobile-First Architecture**
- React Native for Android (Google Play Store)
- Responsive, touch-optimized UI
- Bottom tab navigation
- Stack navigation for flows

### 2. **Supabase Backend**
- PostgreSQL database
- Phone OTP authentication
- Row-Level Security (RLS)
- Real-time subscriptions
- File storage

### 3. **Type Safety**
- Full TypeScript
- Type definitions for all data models
- Strict mode enabled

### 4. **Navigation System**
- Root Navigator handles auth state
- AuthStack for login/signup flows
- AppStack with bottom tabs (Home, Search, Bookings, Messages, Profile)
- Stack navigation within each tab

---

## 🔧 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React Native | Cross-platform mobile |
| **Framework** | Expo | Development & deployment |
| **Router** | Expo Router + React Navigation | Navigation |
| **Language** | TypeScript | Type safety |
| **Backend** | Supabase | Database & auth |
| **Database** | PostgreSQL | Data storage |
| **Auth** | Supabase Phone OTP | Phone login |
| **Real-time** | Supabase Realtime | Live updates |
| **Target** | Android | Google Play Store |

---

## 📱 Navigation Flow

```
RootNavigator
├── Auth (if not logged in)
│   └── AuthStack
│       ├── SignUpPhone
│       └── VerifyOTP
└── App (if logged in)
    └── AppStack
        └── HomeTabs
            ├── Home (HomeScreen)
            ├── Search (SearchScreen)
            ├── Bookings (BookingsScreen)
            ├── Messages (MessagesScreen)
            └── Profile (ProfileScreen)
```

---

## 🔐 Authentication Flow

```
1. User enters phone → SignUpPhone
2. System sends OTP to phone
3. User enters 6-digit code → VerifyOTP
4. Supabase verifies OTP
5. Session created
6. Redirect to Home (AppStack)
7. On app restart:
   - Check session
   - If valid → Home
   - If expired → SignUpPhone
```

---

## 📊 Database Schema

**7 Tables:**
1. `users` – User profiles
2. `providers` – Service providers
3. `services` – Service offerings
4. `bookings` – Service bookings
5. `reviews` – Ratings & feedback
6. `conversations` – Message threads
7. `messages` – Individual messages

**All with:**
- Row-Level Security (RLS)
- Indexes for performance
- Foreign key relationships
- Timestamp tracking

---

## 🛠️ Configuration Files

### `app.json` (Expo Config)
```json
{
  "expo": {
    "name": "Locali",
    "slug": "locali-mvp",
    "version": "0.1.0",
    "android": {
      "package": "com.chaholdingsltd.locali",
      "targetSdkVersion": 34
    }
  }
}
```

### `tsconfig.json`
- Target: ES2020
- Module: ESNext
- Strict mode enabled
- Path aliases (@/, @screens/, etc.)

### `.env.example`
```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

---

## 🔌 Supabase Configuration

### Client Setup (`app/lib/supabase.ts`)
- Creates Supabase client
- Auto-refresh tokens
- AsyncStorage for persistence
- Handles auth state

### Auth (`app/lib/auth.ts`)
- `signUpWithPhone()` – Send OTP
- `verifyOTP()` – Verify code
- `signOut()` – Logout
- User profile functions

### Database (`app/lib/database.ts`)
- CRUD operations for all tables
- Type-safe queries
- Error handling

---

## 🎯 Next Steps

**Card #9:** User Authentication
- Implement Phone OTP screens
- Session persistence
- Route protection
- Testing

**Card #10:** Data Models
- Deploy database schema
- Create test data
- Document access rules

---

## ✅ Deliverables

✅ Expo project structure  
✅ React Navigation setup  
✅ TypeScript configuration  
✅ Supabase client initialization  
✅ Auth utilities  
✅ Database queries  
✅ Auth screens (placeholder)  
✅ App navigation stacks  
✅ Complete documentation  

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Configure Supabase
cp .env.example .env.local
# Edit .env.local with your credentials

# Start development
npm start

# Run on Android
npm run android
```

---

**Status:** ✅ Card #8 Complete  
**Authority:** CJ H. Adisa (C.H.A. LLC)  
**Platform:** Android (React Native / Expo)  

🚀 Ready for Card #9: User Authentication
