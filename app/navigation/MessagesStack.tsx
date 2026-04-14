import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MessagesScreen from '@/screens/messages/MessagesScreen';
import ConversationScreen from '@/screens/messages/ConversationScreen';

const Stack = createNativeStackNavigator();

export default function MessagesNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MessagesList" component={MessagesScreen} />
      <Stack.Screen name="Conversation" component={ConversationScreen} />
    </Stack.Navigator>
  );
}
