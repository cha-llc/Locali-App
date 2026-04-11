import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '@/hooks/useAuth';
import { getUserProfile } from '@/lib/database';

import AuthStack from './AuthStack';
import AppStack from './AppStack';
import OnboardingStack from './OnboardingStack';
import SplashScreen from '@/screens/SplashScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user, loading } = useAuth();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user?.id) {
        setCheckingOnboarding(false);
        return;
      }

      try {
        const profile = await getUserProfile(user.id);
        
        // Need onboarding if:
        // - User has no profile yet
        // - Missing required fields
        // - Onboarding not completed
        const needsFlow =
          !profile ||
          !profile.first_name ||
          !profile.last_name ||
          !profile.neighborhood_id ||
          !profile.onboarding_completed;

        setNeedsOnboarding(needsFlow);
      } catch (err) {
        console.error('Error checking onboarding:', err);
        // Default to showing onboarding if we can't check
        setNeedsOnboarding(true);
      } finally {
        setCheckingOnboarding(false);
      }
    };

    checkOnboardingStatus();
  }, [user?.id]);

  if (loading || checkingOnboarding) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : needsOnboarding ? (
          <Stack.Screen
            name="Onboarding"
            component={() => <OnboardingStack userId={user.id} />}
          />
        ) : (
          <Stack.Screen name="App" component={AppStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
