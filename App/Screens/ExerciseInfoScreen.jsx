import React, { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../Components/Header'
import { useNavigation, useRoute } from '@react-navigation/native'
import { doc, getDoc, addDoc, deleteDoc, collection, query, where, getDocs, getFirestore } from 'firebase/firestore'
import { app } from './../../firebaseConfig'
import { getAuth } from 'firebase/auth'

export default function ExerciseInfoScreen() {

  const navigation = useNavigation();
  const [exerciseDetails, setExerciseDetails] = useState(null)
  const [isAddedToMyExercises, setIsAddedToMyExercises] = useState(false)
  const [loading, setLoading] = useState(true)
  const route = useRoute()
  const { exerciseId } = route.params
  const auth = getAuth(app);
  const user = auth.currentUser;
  const db = getFirestore(app)

  useEffect(() => {
    const fetchExerciseDetails = async () => {
      try {
        const docRef = doc(db, "exercises", exerciseId)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          setExerciseDetails(docSnap.data())
          setLoading(false)
        } else {
          console.log("No such document!")
        }
      } catch (error) {
          console.log("Error getting document: ", error)
      }
    }
    fetchExerciseDetails()
    checkIfExerciseAdded()
  }, [exerciseId, db])

  const checkIfExerciseAdded = async () => {
    if (user) {
      const myExercisesRef = collection(db, "myExercises", user.uid, "UserExercises");
      const q = query(myExercisesRef, where("exerciseId", "==", exerciseId));
      const querySnapshot = await getDocs(q);
      setIsAddedToMyExercises(!querySnapshot.empty);
    }
  };
  
  const addToMyExercises = async () => {
    if (user) {
      try {
        await addDoc(collection(db, "myExercises", user.uid, "UserExercises"), {
          name: exerciseDetails.name,
          exerciseId: exerciseId,
        });
        setIsAddedToMyExercises(true);
        alert("Exercise added to My Exercises");
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };
  
  const removeFromMyExercises = async () => {
    if (user) {
      const myExercisesRef = collection(db, "myExercises", user.uid, "UserExercises");
      const q = query(myExercisesRef, where("exerciseId", "==", exerciseId));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (document) => {
        await deleteDoc(doc(db, "myExercises", user.uid, "UserExercises", document.id));
      });
  
      setIsAddedToMyExercises(false);
      alert("Exercise removed from My Exercises");
    }
  };

  const customBackPress = () => {
    navigation.navigate('ExerciseLibraryScreen');
  };

  return (
    <SafeAreaView className="flex h-full bg-gray-900">
      <ScrollView>
        <Header title="Exercise Info" showBack={true} onBackPress={customBackPress} />
        {loading ? (
          <View className="flex items-center justify-center h-full">
            <ActivityIndicator color="#fff6e3" />
          </View>
        ) : (
          <View className="p-4">
            {exerciseDetails ? (
              <>
                <View className="bg-gray-700 py-4 px-6 rounded-3xl my-5">
                  <Text className="text-3xl font-bold text-[#fff6e3] mb-2 text-center border-b-[2px]">{exerciseDetails.name}</Text>
                  <Text className="text-xl text-blue-400 mb-2 text-center font-bold">Description</Text>
                  <Text className="text-xl text-[#fff6e3] mb-2">{exerciseDetails.description}</Text>
                  <Text className="text-xl text-blue-400 mb-2 text-center font-bold">Instruction</Text>
                  <Text className="text-xl text-[#fff6e3]">{exerciseDetails.instruction}</Text>
                </View>
                {
                  isAddedToMyExercises ? (
                    <TouchableOpacity
                      className="bg-red-500 py-3 px-4 rounded-full m-3"
                      onPress={removeFromMyExercises}
                    >
                      <Text className="text-center text-xl text-[#fff6e3]">Remove from My Exercises</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      className="bg-blue-500 py-3 px-4 rounded-full m-3"
                      onPress={addToMyExercises}
                    >
                      <Text className="text-center text-xl text-[#fff6e3]">Add to My Exercises</Text>
                    </TouchableOpacity>
                  )
                }
                  <Text className="text-xl text-[#fff6e3] mb-2 mt-10 text-center">Space for videos/images</Text>
              </>
            ) : (
              <Text className="text-[#fff6e3] text-center">No Exercise Details Found</Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}