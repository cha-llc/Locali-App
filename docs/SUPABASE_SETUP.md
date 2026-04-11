# Supabase Setup Guide

## Project Created

**Project ID:** `vzzzqsmqqaoilkmskadl`  
**Organization:** `flctwcmxlxkiwirhjlrm`  
**Region:** us-east-1  
**Status:** Active

## Getting Credentials

1. Go to https://app.supabase.com/dashboard
2. Select "Locali MVP" project
3. Go to Settings → API
4. Copy your credentials to `.env`:

```bash
cp .env.example .env
```

Then fill in:
- `EXPO_PUBLIC_SUPABASE_URL` → Project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` → Anon public key
- `SUPABASE_SERVICE_ROLE_KEY` → Service role secret

## Database Schema

All migrations have been applied:
- ✅ Migration 001: Initial schema (users, providers, services, bookings, reviews, conversations, messages)
- ✅ Migration 002: Storage bucket (verifications)
- ✅ Migration 004: Payments table (Stripe + MercadoPago)

## Adding Stripe Keys

1. Go to https://dashboard.stripe.com
2. Get your test keys
3. Add to `.env`:
```
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
```

## Adding MercadoPago Keys

1. Go to https://www.mercadopago.com/developers/en/dashboard
2. Get your sandbox keys
3. Add to `.env`:
```
EXPO_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR_xxx
MERCADOPAGO_ACCESS_TOKEN=APP_USR_xxx
```

## Start the App

```bash
npm start
# Scan QR code with Expo Go
```

## Test Credentials

### Stripe Test Cards
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

### MercadoPago Test Cards
- Success: `4111 1111 1111 1111`
- Use in sandbox mode

## Next Steps

1. Fill in `.env` with actual credentials
2. Start the app: `npm start`
3. Test login and booking flow
4. Build for testing: `eas build --platform android --profile preview`
