import { Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from './../Screens/HomeScreen'
import GoalsScreen from '../Screens/GoalsScreen'
import WaterIntakeScreen from '../Screens/WaterIntakeScreen'
import { Ionicons } from '@expo/vector-icons'
import ExerciseStackNavigator from './ExerciseStackNavigator'
import WorkStackNavigator from './WorkStackNavigator'

const Tab = createBottomTabNavigator()

export default function TabNavigation() {


  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarInactiveTintColor: '#fff6e3',
        tabBarStyle: { backgroundColor: '#1F2937' },
      }}
    >
        <>
          <Tab.Screen name="Home" component={HomeScreen} options={{
            tabBarLabel: ({ color }) => <Text style={{ color }}>Home</Text>,
            tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
          }} />
          <Tab.Screen
            name="ExerciseLibrary"
            component={ExerciseStackNavigator}
            options={{
              tabBarLabel: ({ color }) => <Text style={{ color }}>Exercises</Text>,
              tabBarIcon: ({ color, size }) => <Ionicons name="library" size={size} color={color} />,
            }}
            listeners={({ navigation }) => ({
              tabPress: e => {
                e.preventDefault();
                navigation.navigate('ExerciseLibrary');
              },
            })}
          />
          <Tab.Screen name="Work" component={WorkStackNavigator} options={{
            tabBarLabel: ({ color }) => <Text style={{ color }}>Work</Text>,
            tabBarIcon: ({ color, size }) => <Ionicons name="briefcase" size={size} color={color} />,
          }}/>
          <Tab.Screen name="Goals" component={GoalsScreen} options={{
            tabBarLabel: ({ color }) => <Text style={{ color }}>Goals</Text>,
            tabBarIcon: ({ color, size }) => <Ionicons name="trophy" size={size} color={color} />,
          }}/>
          <Tab.Screen name="WaterIntake" component={WaterIntakeScreen} options={{
            tabBarLabel: ({ color }) => <Text style={{ color }}>Hydration</Text>,
            tabBarIcon: ({ color, size }) => <Ionicons name="water" size={size} color={color} />,
          }}/>
        </>
    </Tab.Navigator>
  )
}

