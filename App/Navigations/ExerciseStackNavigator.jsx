import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ExerciseLibraryScreen from '../Screens/ExerciseLibraryScreen';
import ExerciseInfoScreen from '../Screens/ExerciseInfoScreen';

const ExerciseStack = createStackNavigator();

function ExerciseStackNavigator() {
  return (
    <ExerciseStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="ExerciseLibraryScreen">
      <ExerciseStack.Screen name="ExerciseLibraryScreen" component={ExerciseLibraryScreen} />
      <ExerciseStack.Screen name="ExerciseInfoScreen" component={ExerciseInfoScreen} />
    </ExerciseStack.Navigator>
  );
}

export default ExerciseStackNavigator;