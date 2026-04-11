import { supabase } from './supabase';
import type { ProviderProfile } from './database';

// ============================================================================
// ADMIN ACCESS CONTROL
// ============================================================================

export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) return false;
    return user?.role === 'admin';
  } catch (err) {
    console.error('Error checking admin status:', err);
    return false;
  }
}

// ============================================================================
// PROVIDER VERIFICATION QUEUE
// ============================================================================

export async function getPendingProviders(): Promise<ProviderProfile[]> {
  try {
    const { data: providers, error } = await supabase
      .from('providers')
      .select('*')
      .eq('verification_status', 'pending')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return providers || [];
  } catch (err) {
    console.error('Error fetching pending providers:', err);
    return [];
  }
}

export async function getAllProviders(): Promise<ProviderProfile[]> {
  try {
    const { data: providers, error } = await supabase
      .from('providers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return providers || [];
  } catch (err) {
    console.error('Error fetching all providers:', err);
    return [];
  }
}

// ============================================================================
// VERIFICATION ACTIONS
// ============================================================================

export async function approveProvider(
  providerId: string,
  userId: string
): Promise<void> {
  try {
    // Update provider verification status
    const { error: providerError } = await supabase
      .from('providers')
      .update({
        verification_status: 'approved',
        updated_at: new Date().toISOString(),
      })
      .eq('id', providerId);

    if (providerError) throw providerError;

    // Update associated user verification
    const { error: userError } = await supabase
      .from('users')
      .update({
        verification_status: 'approved',
        is_verified: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (userError) throw userError;

    console.log(`Provider ${providerId} approved by admin`);
  } catch (err) {
    console.error('Error approving provider:', err);
    throw err;
  }
}

export async function rejectProvider(
  providerId: string,
  userId: string,
  reason: string = ''
): Promise<void> {
  try {
    // Update provider verification status
    const { error: providerError } = await supabase
      .from('providers')
      .update({
        verification_status: 'rejected',
        rejection_reason: reason || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', providerId);

    if (providerError) throw providerError;

    // Update associated user verification
    const { error: userError } = await supabase
      .from('users')
      .update({
        verification_status: 'rejected',
        is_verified: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (userError) throw userError;

    console.log(`Provider ${providerId} rejected by admin. Reason: ${reason}`);
  } catch (err) {
    console.error('Error rejecting provider:', err);
    throw err;
  }
}

// ============================================================================
// MANUAL OVERRIDES
// ============================================================================

export async function disableProvider(providerId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('providers')
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', providerId);

    if (error) throw error;
    console.log(`Provider ${providerId} disabled`);
  } catch (err) {
    console.error('Error disabling provider:', err);
    throw err;
  }
}

export async function enableProvider(providerId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('providers')
      .update({
        is_active: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', providerId);

    if (error) throw error;
    console.log(`Provider ${providerId} enabled`);
  } catch (err) {
    console.error('Error enabling provider:', err);
    throw err;
  }
}

// ============================================================================
// VERIFICATION DOCUMENT ACCESS
// ============================================================================

export async function getVerificationDocumentUrl(
  userId: string
): Promise<string | null> {
  try {
    // Get document path from user record
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('verification_document_path')
      .eq('id', userId)
      .single();

    if (userError || !user?.verification_document_path) {
      return null;
    }

    // Generate signed URL for secure access
    const { data, error: urlError } = await supabase.storage
      .from('verifications')
      .createSignedUrl(user.verification_document_path, 3600); // 1 hour

    if (urlError) throw urlError;
    return data?.signedUrl || null;
  } catch (err) {
    console.error('Error getting verification document URL:', err);
    return null;
  }
}

// ============================================================================
// AUDIT LOGGING
// ============================================================================

export async function logAdminAction(
  adminId: string,
  action: string,
  targetId: string,
  details: Record<string, any> = {}
): Promise<void> {
  try {
    const { error } = await supabase
      .from('admin_logs')
      .insert([
        {
          admin_id: adminId,
          action,
          target_id: targetId,
          details: JSON.stringify(details),
          created_at: new Date().toISOString(),
        },
      ]);

    if (error) throw error;
  } catch (err) {
    console.error('Error logging admin action:', err);
  }
}
