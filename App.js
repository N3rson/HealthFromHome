import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native'
import RootNavigator from './App/Navigations/RootNavigator'
import { SafeAreaView } from 'react-native-safe-area-context'
import 'react-native-gesture-handler'
import { StatusProvider } from './App/Context/StatusContext'
import { ExerciseProvider } from './App/Context/ExerciseContext' 
import { AuthProvider } from './App/Context/AuthContext'

export default function App() {
  return (
    <AuthProvider>
    <SafeAreaView className="flex-1 bg-gray-900">
      <StatusBar style="auto" />
      <StatusProvider>
        <ExerciseProvider>
      <NavigationContainer>
        <RootNavigator/>  
      </NavigationContainer>  
      </ExerciseProvider>
      </StatusProvider>    
    </SafeAreaView>
    </AuthProvider>
  )
}

