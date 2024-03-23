import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigation from './TabNavigation';
import ProfileScreen from '../Screens/ProfileScreen';
import LoginScreen
 from '../Screens/LoginScreen';
const Stack = createStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={LoginScreen} />
      <Stack.Screen name="MainTabs" component={TabNavigation} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;