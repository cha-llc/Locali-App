import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignUpPhoneScreen from '@/screens/auth/SignUpPhone';
import VerifyOTPScreen from '@/screens/auth/VerifyOTP';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignUpPhone" component={SignUpPhoneScreen} />
      <Stack.Screen name="VerifyOTP" component={VerifyOTPScreen} />
    </Stack.Navigator>
  );
}
