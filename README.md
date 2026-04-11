# 📱 Locali MVP - Mobile App (Android/Google Play Store)

**Build Path:** React Native (Expo) + Supabase  
**Target:** Android (Google Play Store)  
**Status:** Development  
**Version:** 0.1.0  

---

## 🎯 IMPORTANT: MOBILE FIRST

This is a **mobile application for Android**, not a web app.

**Technology Stack:**
- ✅ React Native (cross-platform mobile)
- ✅ Expo (development & deployment)
- ✅ Supabase (backend, auth, database)
- ✅ React Navigation (mobile navigation)
- ✅ React Native Paper (mobile UI components)

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Android emulator or physical device
- Supabase account

### Setup (5 minutes)

```bash
# 1. Clone repo
git clone https://github.com/cha-llc/Locali-App.git
cd Locali-App

# 2. Install dependencies
npm install

# 3. Configure Supabase
cp .env.example .env.local
# Edit .env.local with your Supabase URL and anon key

# 4. Start development
npm start

# 5. Run on Android
npm run android
```

---

## 📁 Project Structure

```
locali-mvp/
├── app/                          # Main app code
│   ├── screens/                  # Screen components
│   │   ├── auth/
│   │   │   ├── SignUpPhone.tsx
│   │   │   └── VerifyOTP.tsx
│   │   ├── home/
│   │   │   ├── HomeScreen.tsx
│   │   │   └── ProviderSearch.tsx
│   │   ├── booking/
│   │   ├── profile/
│   │   └── messages/
│   ├── components/               # Reusable components
│   │   ├── PhoneInput.tsx
│   │   ├── OTPInput.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ...
│   ├── navigation/               # Navigation stacks
│   │   ├── AuthStack.tsx
│   │   ├── AppStack.tsx
│   │   └── RootNavigator.tsx
│   ├── lib/                      # Utilities
│   │   ├── supabase.ts
│   │   ├── auth.ts
│   │   └── database.ts
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.ts
│   │   └── useDatabase.ts
│   └── types/                    # TypeScript types
├── assets/                       # Images, icons, fonts
├── app.json                      # Expo configuration
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
├── docs/                         # Documentation
├── supabase/                     # Database migrations
│   └── migrations/
└── README.md
```

---

## 🚀 Development

### Run on Android Emulator
```bash
npm run android
```

### Run on Physical Device
```bash
# Start expo
npm start

# Scan QR code with Expo Go app on your phone
```

### Hot Reload
Changes save automatically. Expo hot-reloads the app in development.

---

## 🔐 Authentication (Card #9)

Phone OTP via Supabase:

```typescript
import { useAuth } from '@/hooks/useAuth';

function MyScreen() {
  const { user, loading, logout } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!user) return <SignUpPhone />;

  return (
    <View>
      <Text>Hello, {user.phone}</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
```

---

## 📊 Database (Card #10)

PostgreSQL via Supabase with Row-Level Security:

```typescript
import { getUserProfile, getUserBookings } from '@/lib/database';

async function loadUserData() {
  const user = await getUserProfile(userId);
  const bookings = await getUserBookings(userId);
  return { user, bookings };
}
```

---

## 📱 Mobile Features

- ✅ **Bottom Tab Navigation** – Home, Search, Bookings, Messages, Profile
- ✅ **Stack Navigation** – Auth flows, booking flows
- ✅ **Touch Gestures** – Swipe, tap, long-press
- ✅ **Native Dialogs** – Android system dialogs
- ✅ **Responsive Design** – Adapts to all screen sizes
- ✅ **Performance** – Optimized for mobile hardware

---

## 🛠️ Building for Google Play Store

### 1. Build APK/AAB
```bash
npm run build:android
```

### 2. Configure in app.json
- Package name: `com.chaholdingsltd.locali`
- Version: Increment before each release
- Icons & splash screens in `assets/`

### 3. Create Google Play Account
- Go to https://play.google.com/console
- Create app listing
- Upload APK/AAB

### 4. Submit
```bash
npm run submit:android
```

---

## 📚 Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) – System design
- [`docs/AUTH.md`](docs/AUTH.md) – Authentication guide
- [`docs/data-model.md`](docs/data-model.md) – Database schema
- [`docs/MOBILE.md`](docs/MOBILE.md) – Mobile-specific guide

---

## 🧪 Testing

### Dev Phone (OTP Testing)
```
Phone: +573001234567
OTP: 000000 (auto-approved in test mode)
```

### Device Testing
- Test on Android emulator
- Test on physical Android device
- Test with poor connectivity
- Test offline mode

---

## 🔧 Troubleshooting

### "Metro bundler failed"
```bash
npm start -- --clear
```

### "Cannot connect to Supabase"
- Check `.env.local` has correct keys
- Verify Supabase project is running

### "Android build fails"
```bash
npm start -- --clear
rm -rf node_modules
npm install
npm run android
```

---

## 📦 Dependencies

**Key Libraries:**
- `expo` – Mobile framework
- `react-native` – Mobile SDK
- `@supabase/supabase-js` – Backend
- `@react-navigation/*` – Navigation
- `react-native-paper` – UI components
- `@react-native-async-storage/async-storage` – Local storage

---

## 🎯 Development Roadmap

### Card #8: Infrastructure ✅
- Expo setup
- Supabase configuration
- Project structure
- Build configuration

### Card #9: Authentication (Next)
- Phone OTP sign-up
- Session persistence
- Auth navigation

### Card #10: Data Models
- Database schema
- RLS policies
- Query utilities

### Card #11+: Features
- Provider search
- Service booking
- Real-time messaging
- Reviews & ratings

---

## 📞 Support

**Issues?** Create a GitHub issue with:
- Device/emulator info
- Steps to reproduce
- Error logs

**Build problems?** Check the troubleshooting section above.

---

## 📄 License

MIT – See LICENSE file

---

**Authority:** CJ H. Adisa (C.H.A. LLC)  
**Created:** April 10, 2026  
**Status:** Mobile-First Development  

🚀 **This is a mobile app. Think Android. Build mobile-first.**
