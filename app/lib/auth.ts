import { supabase } from './supabase';

export interface UserProfile {
  id: string;
  phone: string;
  role: 'user' | 'provider' | 'admin';
  neighborhood_id: string | null;
  is_verified: boolean;
  created_at: string;
}

export async function signUpWithPhone(phone: string) {
  return supabase.auth.signInWithOtp({ phone });
}

export async function verifyOTP(phone: string, token: string) {
  return supabase.auth.verifyOtp({ phone, token, type: 'sms' });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) return null;
  return data;
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
) {
  return supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
}
