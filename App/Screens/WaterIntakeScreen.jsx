import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AddRemoveButton from '../Components/AddRemoveButton';
import Header from '../Components/Header';
import { app } from './../../firebaseConfig'
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const WaterIntakeScreen = () => {
  const [waterGoal, setWaterGoal] = useState(2000);
  const [waterDrank, setWaterDrank] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const auth = getAuth(app);
  const user = auth.currentUser;
  const db = getFirestore(app)

  // Load stored values from Firestore
  useEffect(() => {
    const loadData = async () => {
      try {
        const docRef = doc(db, "WaterIntake", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setWaterGoal(data.goal);
          setWaterDrank(data.waterDrank);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }
    };

    loadData();
  }, []);

  // Save water drank and goal to Firestore
  useEffect(() => {
    const saveData = async () => {
      try {
        const docRef = doc(db, "WaterIntake", user.uid);
        await setDoc(docRef, { goal: waterGoal, waterDrank: waterDrank }, { merge: true });
      } catch (error) {
        console.error("Error setting document:", error);
      }
    };

    saveData();
  }, [waterDrank, waterGoal]);

  // Update progress animation
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: waterDrank / waterGoal,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [waterDrank, waterGoal]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const adjustWaterIntake = (amount, operation) => {
    setWaterDrank(prev => {
      const nextValue = operation === 'add' ? prev + amount : prev - amount;
      return Math.min(Math.max(nextValue, 0), waterGoal);
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <ScrollView>
        <Header title="Hydration"/>
        <View className="mx-5 mt-5 bg-gray-800 py-2 px-4 rounded-3xl">
          <Text className="text-3xl font-bold text-[#fff6e3] text-center border-b-[2px]">Goal: {waterGoal} mL</Text>
          <View className="flex-row items-center justify-between mx-20">
            <TouchableOpacity onPress={() => setWaterGoal(Math.max(waterGoal - 250, 0))}>
              <Ionicons name="remove-circle" size={24} color="#FF6262" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setWaterGoal(waterGoal + 250)}>
              <Ionicons name="add-circle" size={24} color="#375BFF" />
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-between items-center mx-4 my-4">
            <Text className="text-white text-lg">You have drunk {'\n'}
            <Text className="text-blue-500 text-3xl">
              {waterDrank} mL {'\n'}</Text>of water today. </Text>
            <View className="w-10 h-48 bg-gray-700 rounded-xl overflow-hidden border-[1px]">
              <Animated.View style={{
                width: '100%',
                height: progressWidth,
                backgroundColor: 'lightblue',
                position: 'absolute',
                bottom: 0,
              }} />
            </View>
          </View>
          <View className="flex-row justify-around">
            {[250, 500, 750, 1000].map((amount) => (
              <AddRemoveButton key={`add_${amount}`} amount={amount} adjustWaterIntake={adjustWaterIntake} operation="add" />
            ))}
          </View>
          <View className="flex-row justify-around mt-4">
            {[250, 500, 750, 1000].map((amount) => (
              <AddRemoveButton key={`remove_${amount}`} amount={amount} adjustWaterIntake={adjustWaterIntake} operation="remove" />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default WaterIntakeScreen