import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Header({ title, showBack = false, onBackPress  }) {
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View className="flex-row items-center justify-between w-full px-4 bg-gray-900 pb-2 border-b-[3px] border-blue-500"> 
      {showBack ? (
        <TouchableOpacity onPress={handleBackPress} className="flex-row items-center z-10">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      ) : (
        <View className="opacity-0">
          <Ionicons name="notifications-outline" size={24} color="transparent" />
        </View>
      )}

      <Text className="text-2xl font-bold absolute w-full text-center ml-4 text-white">{title}</Text>

      <View className="flex-row items-center">
        <TouchableOpacity className="mt-2">
          <Ionicons name="notifications" size={24} color="white"/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image
            source={require('./../../assets/images/profile.png')}
            className="rounded-full w-10 h-10 ml-7 mt-1"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}