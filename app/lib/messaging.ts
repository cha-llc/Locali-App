import { supabase } from './supabase';
import type { Conversation, Message } from './database';

// ============================================================================
// CHAT MANAGEMENT
// ============================================================================

/**
 * Get or create a conversation for a booking
 * Ensures only one conversation exists per booking
 */
export async function getOrCreateConversation(
  bookingId: string,
  userId: string,
  providerId: string
): Promise<Conversation | null> {
  try {
    // Check if conversation already exists
    const { data: existing, error: fetchError } = await supabase
      .from('conversations')
      .select('*')
      .eq('booking_id', bookingId)
      .single();

    if (!fetchError && existing) {
      console.log('Conversation already exists:', existing.id);
      return existing;
    }

    // Create new conversation
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

    console.log('Conversation created:', newConversation.id);

    // Create system message for conversation started
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

/**
 * Send a user message
 */
export async function sendMessage(
  conversationId: string,
  senderId: string,
  text: string
): Promise<Message | null> {
  try {
    if (!text.trim()) {
      throw new Error('Message cannot be empty');
    }

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

    // Update conversation updated_at
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    console.log('Message sent:', data.id);
    return data;
  } catch (err) {
    console.error('Error sending message:', err);
    throw err;
  }
}

/**
 * Send a system message (booking confirmed, cancelled, etc.)
 */
export async function sendSystemMessage(
  conversationId: string,
  text: string
): Promise<Message | null> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          conversation_id: conversationId,
          sender_id: null, // System messages have no sender
          text,
          message_type: 'system',
          is_read: false,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    console.log('System message sent:', data.id);
    return data;
  } catch (err) {
    console.error('Error sending system message:', err);
    throw err;
  }
}

/**
 * Get all messages for a conversation
 */
export async function getConversationMessages(
  conversationId: string
): Promise<Message[]> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (err) {
    console.error('Error fetching messages:', err);
    throw err;
  }
}

/**
 * Mark message as read
 */
export async function markMessageAsRead(messageId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', messageId);

    if (error) throw error;
  } catch (err) {
    console.error('Error marking message as read:', err);
    throw err;
  }
}

/**
 * Mark all messages in conversation as read
 */
export async function markConversationAsRead(conversationId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('conversation_id', conversationId);

    if (error) throw error;
  } catch (err) {
    console.error('Error marking conversation as read:', err);
    throw err;
  }
}

// ============================================================================
// REAL-TIME SUBSCRIPTIONS
// ============================================================================

/**
 * Subscribe to new messages in a conversation
 * Calls callback whenever a new message is added
 */
export function subscribeToMessages(
  conversationId: string,
  onNewMessage: (message: Message) => void
) {
  try {
    const subscription = supabase
      .from(`messages:conversation_id=eq.${conversationId}`)
      .on('*', (payload) => {
        if (payload.eventType === 'INSERT') {
          const newMessage = payload.new as Message;
          onNewMessage(newMessage);
        }
      })
      .subscribe((status) => {
        console.log(`Subscription status for ${conversationId}:`, status);
      });

    return subscription;
  } catch (err) {
    console.error('Error subscribing to messages:', err);
    throw err;
  }
}

/**
 * Subscribe to conversation updates
 */
export function subscribeToConversation(
  conversationId: string,
  onUpdate: (conversation: Conversation) => void
) {
  try {
    const subscription = supabase
      .from(`conversations:id=eq.${conversationId}`)
      .on('UPDATE', (payload) => {
        const updated = payload.new as Conversation;
        onUpdate(updated);
      })
      .subscribe();

    return subscription;
  } catch (err) {
    console.error('Error subscribing to conversation:', err);
    throw err;
  }
}

// ============================================================================
// BOOKING-LINKED MESSAGING
// ============================================================================

/**
 * Send booking confirmation message
 */
export async function sendBookingConfirmedMessage(
  conversationId: string,
  serviceName: string,
  date: string,
  time: string
): Promise<void> {
  await sendSystemMessage(
    conversationId,
    `📅 Booking confirmed for ${serviceName} on ${date} at ${time}`
  );
}

/**
 * Send booking cancelled message
 */
export async function sendBookingCancelledMessage(
  conversationId: string
): Promise<void> {
  await sendSystemMessage(
    conversationId,
    '❌ Booking has been cancelled'
  );
}

/**
 * Send booking completed message
 */
export async function sendBookingCompletedMessage(
  conversationId: string
): Promise<void> {
  await sendSystemMessage(
    conversationId,
    '✅ Booking completed. Please leave a review!'
  );
}
