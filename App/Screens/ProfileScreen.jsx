import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import Header from '../Components/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function ProfileScreen() {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      });
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <Header title="Profile" showBack={true} />
      <View className="flex-1 justify-center items-center px-4">
        <Text className="text-3xl font-bold text-[#fff6e3] mb-4 text-center">Profile Screen</Text>
        <TouchableOpacity
          className="bg-[#fff6e3] py-3 px-6 rounded-full"
          onPress={handleLogout}
        >
          <Text className="text-center text-xl">Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}