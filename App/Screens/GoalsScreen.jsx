import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../Components/Header'
import { collection, getDocs, updateDoc, doc, getFirestore, addDoc, deleteDoc } from "firebase/firestore"
import { app } from './../../firebaseConfig'
import { getAuth } from 'firebase/auth'

export default function GoalsScreen() {
  const [goals, setGoals] = useState([])
  const auth = getAuth(app)
  const user = auth.currentUser
  const db = getFirestore(app)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [newGoalName, setNewGoalName] = useState("")

  useEffect(() => {
    if (user) {
      fetchGoals()
    }
  }, [user])

  const fetchGoals = async () => {
    if (!user) return
    const goalsRef = collection(db, "Goals", user.uid, "UserGoals")
    const querySnapshot = await getDocs(goalsRef)
    const goalsData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    setGoals(goalsData)
  }

  const addGoal = async () => {
    if (!user) return
    try {
      await addDoc(collection(db, "Goals", user.uid, "UserGoals"), {
        name: newGoalName,
        count: 0,
        checked: false,
      })
      setNewGoalName("")
      fetchGoals()
      setIsModalVisible(false)
    } catch (error) {
      console.error("Error adding document: ", error)
    }
  }

  const updateGoal = async (goalId, currentCount, checked) => {
    if (!user) return
    const newCount = checked ? Math.max(currentCount - 1, 0) : currentCount + 1
    const goalRef = doc(db, "Goals", user.uid, "UserGoals", goalId)
    await updateDoc(goalRef, {
      count: newCount,
      checked: !checked
    })
    fetchGoals()
  }

  const deleteGoal = async (goalId) => {
    if (!user) return
    try {
      await deleteDoc(doc(db, "Goals", user.uid, "UserGoals", goalId))
      fetchGoals()
    } catch (error) {
      console.error("Error deleting document: ", error)
    }
  }
  
  return (
    <SafeAreaView className="flex h-full bg-gray-900">
      <ScrollView>
        <Header title="Goals"/>
        <View className=" bg-gray-800 py-2 px-4 rounded-3xl my-5 mx-5">
          <Text className="text-3xl font-bold text-[#fff6e3] text-center mb-2 border-b-[2px]">March 2024</Text>
          <Text className="text-2xl text-[#fff6e3] mb-5">You've got 21 working days this month!</Text>
          <Text className="text-2xl text-[#fff6e3] mb-5">Did you finish your goals today?</Text>
          {goals.map((goal, index) => (
            <View key={index}>
              <Text className="text-2xl text-blue-300 text-center">{goal.name} {goal.count}/21</Text>
              <TouchableOpacity
                className={`${goal.checked ? 'bg-green-300' : 'bg-red-300'} py-3 px-4 rounded-full mx-5 mb-5`}
                onPress={() => updateGoal(goal.id, goal.count, goal.checked)}
              >
                <Text className="text-lg text-center">{goal.checked ? 'Good job!' : 'Press to finish'}</Text>
              </TouchableOpacity>
            </View>
          ))}
          
          <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => setIsModalVisible(!isModalVisible)}
          >
            <View className="m-10 bg-white rounded-lg p-8 shadow-lg">
              <Text className="text-xl font-bold text-center mb-4">Manage Your Goals</Text>
              
              <TextInput
                className="border border-gray-300 p-2 mb-4 rounded"
                placeholder="New Goal Name"
                value={newGoalName}
                onChangeText={setNewGoalName}
              />
              
              <TouchableOpacity 
                className="bg-blue-500 py-2 rounded-full mb-4"
                onPress={addGoal}>
                <Text className="text-center text-white text-lg">Add Goal</Text>
              </TouchableOpacity>

              {goals.map((goal, index) => (
                <View key={index} className="flex-row justify-between items-center mb-4">
                  <Text className="text-lg my-3">{goal.name}</Text>
                  <TouchableOpacity 
                    className="bg-red-500 py-1 px-3 rounded-full"
                    onPress={() => deleteGoal(goal.id)}>
                    <Text className="text-white text-lg">Delete</Text>
                  </TouchableOpacity>
                </View>
              ))}

              <TouchableOpacity 
                className="bg-gray-300 py-2 rounded-full"
                onPress={() => setIsModalVisible(!isModalVisible)}>
                <Text className="text-center">Close</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
        <TouchableOpacity className="bg-[#fff6e3] py-2 rounded-full mx-10 my-5" onPress={() => setIsModalVisible(true)}>
          <Text className="text-lg text-center">Change your goals</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}