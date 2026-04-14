import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import HomeScreen from '@/screens/home/HomeScreen';
import BookingsScreen from '@/screens/bookings/BookingsScreen';
import ProfileScreen from '@/screens/profile/ProfileScreen';
import BookingStack from './BookingStack';
import MessagesNavigator from './MessagesStack';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home';
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'NewBooking') iconName = 'magnify';
          else if (route.name === 'Bookings') iconName = 'calendar-check';
          else if (route.name === 'Messages') iconName = 'message-text';
          else if (route.name === 'Profile') iconName = 'account-circle';

          return (
            <MaterialCommunityIcons
              name={iconName as any}
              size={size}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: '#38A169',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: { backgroundColor: '#fff', borderTopColor: '#E0E0E0' },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="NewBooking"
        component={BookingStack}
        options={{ tabBarLabel: 'Book' }}
      />
      <Tab.Screen name="Bookings" component={BookingsScreen} />
      <Tab.Screen name="Messages" component={MessagesNavigator} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={HomeTabs} />
    </Stack.Navigator>
  );
}
