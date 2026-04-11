import { supabase } from './supabase';

// ============================================================================
// TYPES
// ============================================================================

export type PaymentProvider = 'stripe' | 'mercadopago';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface PaymentIntent {
  id: string;
  bookingId: string;
  userId: string;
  providerId: string;
  amount: number;
  currency: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  providerPaymentId?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// ENVIRONMENT CONFIGURATION
// ============================================================================

const STRIPE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
const MERCADOPAGO_KEY = process.env.EXPO_PUBLIC_MERCADOPAGO_PUBLIC_KEY || '';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

// ============================================================================
// PAYMENT PROVIDER SELECTION
// ============================================================================

/**
 * Determine payment provider based on user country
 * US → Stripe
 * Colombia → MercadoPago
 * Default → Stripe
 */
export function getPaymentProvider(userCountry?: string): PaymentProvider {
  const country = (userCountry || '').toUpperCase();
  
  if (country === 'CO' || country === 'COLOMBIA') {
    return 'mercadopago';
  }
  
  // Default to Stripe for US and others
  return 'stripe';
}

// ============================================================================
// STRIPE INTEGRATION
// ============================================================================

/**
 * Create Stripe payment intent
 * Calls backend to create intent (server-side secret handling)
 */
export async function createStripePaymentIntent(
  bookingId: string,
  userId: string,
  providerId: string,
  amount: number,
  currency: string = 'usd'
): Promise<PaymentIntent | null> {
  try {
    // Call backend to create payment intent (handles secret key)
    const response = await fetch(`${API_BASE_URL}/api/payments/stripe/create-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRIPE_KEY}`,
      },
      body: JSON.stringify({
        bookingId,
        userId,
        providerId,
        amount: Math.round(amount * 100), // Convert to cents
        currency,
      }),
    });

    if (!response.ok) {
      throw new Error(`Stripe error: ${response.statusText}`);
    }

    const data = await response.json();

    // Store payment intent in Supabase
    const { data: paymentIntent, error } = await supabase
      .from('payments')
      .insert([
        {
          booking_id: bookingId,
          user_id: userId,
          provider_id: providerId,
          amount,
          currency,
          provider: 'stripe',
          status: 'pending',
          provider_payment_id: data.clientSecret,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return {
      id: paymentIntent.id,
      bookingId: paymentIntent.booking_id,
      userId: paymentIntent.user_id,
      providerId: paymentIntent.provider_id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      provider: 'stripe',
      status: 'pending',
      providerPaymentId: data.clientSecret,
      createdAt: paymentIntent.created_at,
      updatedAt: paymentIntent.updated_at,
    };
  } catch (err) {
    console.error('Error creating Stripe payment intent:', err);
    throw err;
  }
}

// ============================================================================
// MERCADOPAGO INTEGRATION
// ============================================================================

/**
 * Create MercadoPago payment preference
 * Calls backend to create preference (server-side secret handling)
 */
export async function createMercadoPagoPreference(
  bookingId: string,
  userId: string,
  providerId: string,
  amount: number,
  currency: string = 'COP'
): Promise<PaymentIntent | null> {
  try {
    // Call backend to create preference (handles secret key)
    const response = await fetch(`${API_BASE_URL}/api/payments/mercadopago/create-preference`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MERCADOPAGO_KEY}`,
      },
      body: JSON.stringify({
        bookingId,
        userId,
        providerId,
        amount,
        currency,
      }),
    });

    if (!response.ok) {
      throw new Error(`MercadoPago error: ${response.statusText}`);
    }

    const data = await response.json();

    // Store payment preference in Supabase
    const { data: paymentIntent, error } = await supabase
      .from('payments')
      .insert([
        {
          booking_id: bookingId,
          user_id: userId,
          provider_id: providerId,
          amount,
          currency,
          provider: 'mercadopago',
          status: 'pending',
          provider_payment_id: data.preferenceId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return {
      id: paymentIntent.id,
      bookingId: paymentIntent.booking_id,
      userId: paymentIntent.user_id,
      providerId: paymentIntent.provider_id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      provider: 'mercadopago',
      status: 'pending',
      providerPaymentId: data.preferenceId,
      createdAt: paymentIntent.created_at,
      updatedAt: paymentIntent.updated_at,
    };
  } catch (err) {
    console.error('Error creating MercadoPago preference:', err);
    throw err;
  }
}

// ============================================================================
// PAYMENT OPERATIONS
// ============================================================================

/**
 * Create payment intent based on user country
 */
export async function createPaymentIntent(
  bookingId: string,
  userId: string,
  providerId: string,
  amount: number,
  userCountry?: string,
  currency?: string
): Promise<PaymentIntent | null> {
  const provider = getPaymentProvider(userCountry);

  if (provider === 'mercadopago') {
    return createMercadoPagoPreference(bookingId, userId, providerId, amount, currency || 'COP');
  }

  return createStripePaymentIntent(bookingId, userId, providerId, amount, currency || 'usd');
}

/**
 * Update payment status
 */
export async function updatePaymentStatus(
  paymentId: string,
  status: PaymentStatus,
  providerPaymentId?: string
): Promise<PaymentIntent | null> {
  try {
    const { data, error } = await supabase
      .from('payments')
      .update({
        status,
        provider_payment_id: providerPaymentId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', paymentId)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      bookingId: data.booking_id,
      userId: data.user_id,
      providerId: data.provider_id,
      amount: data.amount,
      currency: data.currency,
      provider: data.provider,
      status: data.status,
      providerPaymentId: data.provider_payment_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (err) {
    console.error('Error updating payment status:', err);
    throw err;
  }
}

/**
 * Get payment by booking ID
 */
export async function getPaymentByBookingId(bookingId: string): Promise<PaymentIntent | null> {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('booking_id', bookingId)
      .single();

    if (error) return null;

    return {
      id: data.id,
      bookingId: data.booking_id,
      userId: data.user_id,
      providerId: data.provider_id,
      amount: data.amount,
      currency: data.currency,
      provider: data.provider,
      status: data.status,
      providerPaymentId: data.provider_payment_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (err) {
    console.error('Error fetching payment:', err);
    return null;
  }
}

/**
 * Mark booking as paid after successful payment
 */
export async function markBookingAsPaid(
  bookingId: string,
  paymentId: string,
  provider: PaymentProvider
): Promise<void> {
  try {
    const { error } = await supabase
      .from('bookings')
      .update({
        payment_status: 'paid',
        payment_id: paymentId,
        payment_provider: provider,
        paid_at: new Date().toISOString(),
      })
      .eq('id', bookingId);

    if (error) throw error;
  } catch (err) {
    console.error('Error marking booking as paid:', err);
    throw err;
  }
}
