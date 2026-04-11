import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { supabase } from './supabase';

// ============================================================================
// NOTIFICATION SETUP
// ============================================================================

/**
 * Initialize notifications
 * Call once on app startup
 */
export async function initializeNotifications() {
  try {
    // Set notification handler behavior
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    // Request permissions
    if (Device.isDevice) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Notification permission denied');
        return;
      }

      // Get token
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });

      console.log('Expo push token:', token.data);
      return token.data;
    }
  } catch (err) {
    console.error('Error initializing notifications:', err);
  }
}

/**
 * Store FCM token in Supabase
 */
export async function storeNotificationToken(
  userId: string,
  token: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('users')
      .update({ notification_token: token })
      .eq('id', userId);

    if (error) throw error;

    console.log('Notification token stored');
  } catch (err) {
    console.error('Error storing notification token:', err);
  }
}

/**
 * Handle incoming notifications
 */
export function setupNotificationListeners() {
  // Handle notification when app is in foreground
  const foregroundSubscription = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log('Notification received (foreground):', notification);
    }
  );

  // Handle notification when user taps it
  const responseSubscription =
    Notifications.addNotificationResponseReceivedListener((response) => {
      const { notification } = response;
      const data = notification.request.content.data;

      console.log('Notification tapped:', data);

      // Route based on notification type
      if (data.type === 'booking_confirmed') {
        // Navigate to booking
        console.log('Navigate to booking:', data.bookingId);
      } else if (data.type === 'message') {
        // Navigate to conversation
        console.log('Navigate to conversation:', data.conversationId);
      } else if (data.type === 'booking_status') {
        // Navigate to booking
        console.log('Navigate to booking:', data.bookingId);
      }
    });

  return () => {
    foregroundSubscription.remove();
    responseSubscription.remove();
  };
}

// ============================================================================
// NOTIFICATION TRIGGERS (Client-Side Helpers)
// ============================================================================

/**
 * Send local test notification (for development)
 */
export async function sendTestNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Test Notification',
      body: 'This is a test notification from Locali',
      data: { testId: '123' },
    },
    trigger: null, // Immediately
  });
}

/**
 * Schedule a local notification (for testing)
 */
export async function scheduleNotification(
  title: string,
  body: string,
  delaySeconds: number = 5,
  data: Record<string, any> = {}
) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
    },
    trigger: {
      seconds: delaySeconds,
    },
  });
}

// ============================================================================
// NOTIFICATION DATA STRUCTURES
// ============================================================================

interface NotificationPayload {
  type:
    | 'booking_confirmed'
    | 'booking_cancelled'
    | 'booking_completed'
    | 'message'
    | 'booking_status_changed';
  title: string;
  body: string;
  data: Record<string, any>;
}

/**
 * Build notification payload for booking confirmed
 */
export function buildBookingConfirmedPayload(
  bookingId: string,
  serviceName: string,
  date: string,
  time: string
): NotificationPayload {
  return {
    type: 'booking_confirmed',
    title: 'Booking Confirmed ✓',
    body: `${serviceName} on ${date} at ${time}`,
    data: {
      bookingId,
      action: 'view_booking',
    },
  };
}

/**
 * Build notification payload for new message
 */
export function buildMessagePayload(
  conversationId: string,
  senderName: string,
  messageText: string
): NotificationPayload {
  return {
    type: 'message',
    title: `Message from ${senderName}`,
    body: messageText.substring(0, 100),
    data: {
      conversationId,
      action: 'open_conversation',
    },
  };
}

/**
 * Build notification payload for booking cancelled
 */
export function buildBookingCancelledPayload(
  bookingId: string,
  serviceName: string
): NotificationPayload {
  return {
    type: 'booking_cancelled',
    title: 'Booking Cancelled',
    body: `${serviceName} booking has been cancelled`,
    data: {
      bookingId,
      action: 'view_booking',
    },
  };
}

/**
 * Build notification payload for booking completed
 */
export function buildBookingCompletedPayload(
  bookingId: string,
  serviceName: string
): NotificationPayload {
  return {
    type: 'booking_completed',
    title: 'Booking Completed ✓',
    body: `${serviceName} is complete. Please leave a review!`,
    data: {
      bookingId,
      action: 'view_booking',
    },
  };
}

/**
 * Build notification payload for status change
 */
export function buildStatusChangePayload(
  bookingId: string,
  newStatus: string
): NotificationPayload {
  return {
    type: 'booking_status_changed',
    title: 'Booking Status Updated',
    body: `Status changed to: ${newStatus}`,
    data: {
      bookingId,
      action: 'view_booking',
    },
  };
}
