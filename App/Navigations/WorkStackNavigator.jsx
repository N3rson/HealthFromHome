import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WorkScreen from '../Screens/WorkScreen';
import ScheduleScreen from '../Screens/ScheduleScreen';

const WorkStack = createStackNavigator();

function WorkStackNavigator() {
  return (
    <WorkStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="WorkScreen">
      <WorkStack.Screen name="WorkScreen" component={WorkScreen} />
      <WorkStack.Screen name="ScheduleScreen" component={ScheduleScreen} />
    </WorkStack.Navigator>
  );
}

export default WorkStackNavigator;