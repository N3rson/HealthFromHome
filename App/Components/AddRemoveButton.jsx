import React, { useRef, useEffect } from 'react'
import { TouchableOpacity, Text, Animated, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const AddRemoveButton = ({ amount, adjustWaterIntake, operation }) => {

  const shakeAnimation = useRef(new Animated.Value(0)).current

  useEffect(() => {
    shakeAnimation.setValue(0)
  }, [])

  const startShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const onPress = () => {
    adjustWaterIntake(amount, operation)
    startShake()
  }

  return (
    <TouchableOpacity
      className="items-center justify-center m-2"
      onPress={onPress}
    >
      <Animated.View
        className={`w-12 h-12 rounded-full items-center justify-center ${operation === 'add' ? 'bg-blue-500' : 'bg-red-500'}`}
        style={{ transform: [{ translateX: shakeAnimation }] }}
      >
        <Ionicons name={operation === 'add' ? 'add-circle-outline' : 'remove-circle-outline'} size={24} color="white" />
      </Animated.View>
      <Text className="text-white mt-2">{amount} mL</Text>
    </TouchableOpacity>
  )
}

export default AddRemoveButton