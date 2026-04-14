import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ServiceSelectionScreen from '@/screens/booking/ServiceSelectionScreen';
import AvailabilitySelectionScreen from '@/screens/booking/AvailabilitySelectionScreen';
import BookingConfirmationScreen from '@/screens/booking/BookingConfirmationScreen';

const Stack = createNativeStackNavigator();

export default function BookingStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#fff' },
      }}
    >
      <Stack.Screen
        name="ServiceSelection"
        component={ServiceSelectionScreen}
        options={{ animation: 'none' }}
      />
      <Stack.Screen
        name="AvailabilitySelection"
        component={AvailabilitySelectionScreen}
      />
      <Stack.Screen
        name="BookingConfirmation"
        component={BookingConfirmationScreen}
      />
    </Stack.Navigator>
  );
}
