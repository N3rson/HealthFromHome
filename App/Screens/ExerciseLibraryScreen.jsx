import { View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import Header from '../Components/Header'
import Slider from '../Components/Slider'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useExercise } from '../Context/ExerciseContext'

export default function ExerciseLibraryScreen() {

  const { exercisesList } = useExercise();
  const [searchTerm, setSearchTerm] = useState('')
  const navigation = useNavigation()

  const filteredExercises = exercisesList.filter(exercise =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <SafeAreaView className="h-full flex bg-gray-900">
        <Header title="Exercise Library"/>
      <ScrollView>
          <View className="flex items-center justify-center py-4">
            <Text className="text-3xl font-bold text-[#fff6e3]">Recommended Exercises</Text>
          </View>
          <Slider/>
          <View className="flex items-center">
          <Text className="text-3xl font-bold text-[#fff6e3] my-4">All Exercises</Text>
            <View className="w-[90%] p-2 px-5 flex flex-row items-center mb-7 bg-[#fff6e3] rounded-full">
              <Ionicons name="search" size={24} color="black" />
              <TextInput 
                placeholder='Search' 
                className="ml-2 text-[16px]"
                onChangeText={(value) => setSearchTerm(value)}
              />
            </View>
            {filteredExercises.length > 0 ? (
              filteredExercises.map((exercise, index) => (
                <TouchableOpacity 
                  key={index} 
                  className="w-[70%] bg-[#fff6e3] py-3 px-4 rounded-full m-3"
                  onPress={() => navigation.navigate('ExerciseInfoScreen', {exerciseId: exercise.id})}>
                  <Text className="text-center text-xl">{exercise.name}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text className="text-xl text-[#fff6e3] text-center">No exercises found with this term.</Text>
            )}
          </View>
      </ScrollView>
    </SafeAreaView>
  )
}