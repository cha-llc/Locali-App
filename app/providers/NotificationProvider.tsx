import React, { useEffect } from 'react';
import { useAuth } from './AuthProvider';
import {
  initializeNotifications,
  storeNotificationToken,
  setupNotificationListeners,
} from '@/lib/notifications';

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    const initNotifications = async () => {
      try {
        // Initialize notification handlers
        const token = await initializeNotifications();

        // Store token in database
        if (token) {
          await storeNotificationToken(user.id, token);
        }

        // Setup listeners for incoming notifications
        const unsubscribe = setupNotificationListeners();

        return unsubscribe;
      } catch (err) {
        console.error('Error initializing notifications:', err);
      }
    };

    return initNotifications().then((unsub) => unsub);
  }, [user?.id]);

  return <>{children}</>;
};
