import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BasicProfileScreen from '@/screens/onboarding/BasicProfileScreen';
import NeighborhoodVerificationScreen from '@/screens/onboarding/NeighborhoodVerificationScreen';
import OnboardingCompleteScreen from '@/screens/onboarding/OnboardingCompleteScreen';

const Stack = createNativeStackNavigator();

export default function OnboardingStack({ userId }: { userId: string }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#fff' },
      }}
    >
      <Stack.Screen
        name="BasicProfile"
        component={BasicProfileScreen}
        initialParams={{ userId }}
      />
      <Stack.Screen
        name="NeighborhoodVerification"
        component={NeighborhoodVerificationScreen}
      />
      <Stack.Screen
        name="OnboardingComplete"
        component={OnboardingCompleteScreen}
      />
    </Stack.Navigator>
  );
}
