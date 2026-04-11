import { supabase } from './supabase';

// ============================================================================
// TYPES
// ============================================================================

export interface UserProfile {
  id: string;
  phone: string;
  role: 'user' | 'provider' | 'admin';
  neighborhood_id: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProviderProfile {
  id: string;
  user_id: string;
  services_offered: string[];
  pricing: Record<string, number>;
  availability: Record<string, any>;
  verification_status: 'pending' | 'approved' | 'rejected';
  rating_avg: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  provider_id: string;
  name: string;
  category: string;
  base_price: number;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  provider_id: string;
  service_id: string;
  booking_date: string;
  booking_time: string;
  duration_minutes: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
  location_address: string | null;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  booking_id: string;
  user_id: string;
  provider_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface Conversation {
  id: string;
  booking_id: string;
  user_id: string;
  provider_id: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  text: string;
  message_type: 'user' | 'system';
  is_read: boolean;
  created_at: string;
}

// ============================================================================
// USERS
// ============================================================================

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }

  return data;
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('users')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user:', error);
    return null;
  }

  return data;
}

// ============================================================================
// PROVIDERS
// ============================================================================

export async function getProviderProfile(providerId: string): Promise<ProviderProfile | null> {
  const { data, error } = await supabase
    .from('providers')
    .select('*')
    .eq('id', providerId)
    .single();

  if (error) {
    console.error('Error fetching provider:', error);
    return null;
  }

  return data;
}

export async function getVerifiedProviders(): Promise<ProviderProfile[]> {
  const { data, error } = await supabase
    .from('providers')
    .select('*')
    .eq('verification_status', 'approved');

  if (error) {
    console.error('Error fetching providers:', error);
    return [];
  }

  return data || [];
}

// ============================================================================
// SERVICES
// ============================================================================

export async function getServices(providerId?: string): Promise<Service[]> {
  let query = supabase.from('services').select('*').eq('is_active', true);

  if (providerId) {
    query = query.eq('provider_id', providerId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching services:', error);
    return [];
  }

  return data || [];
}

// ============================================================================
// BOOKINGS
// ============================================================================

export async function getUserBookings(userId: string): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', userId)
    .order('booking_date', { ascending: false });

  if (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }

  return data || [];
}

export async function getProviderBookings(providerId: string): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('provider_id', providerId)
    .order('booking_date', { ascending: false });

  if (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }

  return data || [];
}

// ============================================================================
// REVIEWS
// ============================================================================

export async function getProviderReviews(providerId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('provider_id', providerId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }

  return data || [];
}

// ============================================================================
// CONVERSATIONS & MESSAGES
// ============================================================================

export async function getUserConversations(userId: string): Promise<Conversation[]> {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .or(`user_id.eq.${userId},provider_id.eq.${userId}`)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }

  return data || [];
}

export async function getConversationMessages(conversationId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }

  return data || [];
}
