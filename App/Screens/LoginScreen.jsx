import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { auth } from '../../firebaseConfig'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigation } from '@react-navigation/native'



export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('MainTabs');
    } catch (error) {
      Alert.alert("Login failed", error.message);
    }
  };

  return (
    <SafeAreaView className="flex h-full bg-gray-900 px-4">
      <View className="mt-10 mb-10">
      <Text className="text-5xl font-bold text-blue-300 text-left ml-20">Health</Text>
      <Text className="text-5xl font-bold text-[#fff6e3] text-center">From</Text>
      <Text className="text-5xl font-bold text-blue-300 text-right mb-8 mr-20">Home</Text>
      <Text className="text-2xl text-[#fff6e3] text-center border-t-[2px] border-blue-300 ">The best wellbeing app for</Text>
      <Text className="text-2xl text-[#fff6e3] text-center border-b-[2px] border-blue-300 font-bold ">WFH workers!</Text>
      </View>
      <Text className="text-3xl font-bold text-[#fff6e3] text-center mb-8">Login</Text>
      <TextInput
        className="bg-[#fff6e3] text-xl rounded-full px-4 py-2 mb-4"
        placeholder="Email"
        placeholderTextColor="#000"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        className="bg-[#fff6e3] text-xl rounded-full px-4 py-2 mb-6"
        placeholder="Password"
        placeholderTextColor="#000"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        className="bg-[#fff6e3] py-2 rounded-full"
        onPress={handleLogin}
      >
        <Text className="text-center text-xl">Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}