import { supabase } from './supabase';
import type { Conversation, Message } from './database';

// ============================================================================
// CONVERSATION QUERIES
// ============================================================================

export async function getUserConversations(userId: string): Promise<Conversation[]> {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .or(`user_id.eq.${userId},provider_id.eq.${userId}`)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getOrCreateConversation(
  bookingId: string,
  userId: string,
  providerId: string
): Promise<Conversation | null> {
  try {
    const { data: existing, error: fetchError } = await supabase
      .from('conversations')
      .select('*')
      .eq('booking_id', bookingId)
      .single();

    if (!fetchError && existing) {
      return existing;
    }

    const { data: newConversation, error: createError } = await supabase
      .from('conversations')
      .insert([
        {
          booking_id: bookingId,
          user_id: userId,
          provider_id: providerId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (createError) throw createError;

    await sendSystemMessage(
      newConversation.id,
      'Conversation started. You can now message the provider.'
    );

    return newConversation;
  } catch (err) {
    console.error('Error getting/creating conversation:', err);
    throw err;
  }
}

// ============================================================================
// MESSAGE OPERATIONS
// ============================================================================

export async function sendMessage(
  conversationId: string,
  senderId: string,
  text: string
): Promise<Message | null> {
  if (!text.trim()) throw new Error('Message cannot be empty');

  const { data, error } = await supabase
    .from('messages')
    .insert([
      {
        conversation_id: conversationId,
        sender_id: senderId,
        text: text.trim(),
        message_type: 'user',
        is_read: false,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) throw error;

  await supabase
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId);

  return data;
}

export async function sendSystemMessage(
  conversationId: string,
  text: string
): Promise<Message | null> {
  const { data, error } = await supabase
    .from('messages')
    .insert([
      {
        conversation_id: conversationId,
        sender_id: null,
        text,
        message_type: 'system',
        is_read: false,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getConversationMessages(
  conversationId: string
): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function markConversationAsRead(conversationId: string): Promise<void> {
  const { error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('conversation_id', conversationId);

  if (error) throw error;
}

// ============================================================================
// REAL-TIME SUBSCRIPTIONS (Supabase JS v2)
// ============================================================================

export function subscribeToMessages(
  conversationId: string,
  onNewMessage: (message: Message) => void
) {
  const channel = supabase
    .channel(`messages-${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        onNewMessage(payload.new as Message);
      }
    )
    .subscribe();

  return {
    unsubscribe: () => supabase.removeChannel(channel),
  };
}

// ============================================================================
// BOOKING-LINKED SYSTEM MESSAGES
// ============================================================================

export async function sendBookingConfirmedMessage(
  conversationId: string,
  serviceName: string,
  date: string,
  time: string
): Promise<void> {
  await sendSystemMessage(
    conversationId,
    `Booking confirmed for ${serviceName} on ${date} at ${time}`
  );
}

export async function sendBookingCancelledMessage(
  conversationId: string
): Promise<void> {
  await sendSystemMessage(conversationId, 'Booking has been cancelled');
}

export async function sendBookingCompletedMessage(
  conversationId: string
): Promise<void> {
  await sendSystemMessage(
    conversationId,
    'Booking completed. Please leave a review!'
  );
}
