import 'react-native-url-polyfill/auto';
import React from 'react';
import { AuthProvider } from './app/providers/AuthProvider';
import RootNavigator from './app/navigation/RootNavigator';

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
