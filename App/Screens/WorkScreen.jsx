import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { getFirestore } from 'firebase/firestore';
import { app } from './../../firebaseConfig';
import Header from '../Components/Header';
import { useStatus } from '../Context/StatusContext';
import { getAuth } from 'firebase/auth'

export default function WorkScreen() {
  const navigation = useNavigation();
  const auth = getAuth(app);
  const user = auth.currentUser;
  const db = getFirestore(app);
  const { currentStatus, setCurrentStatus, timeUntilNextBreak, workTimeMessage } = useStatus();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [workStatuses, setWorkStatuses] = useState([]);

  useEffect(() => {
    const fetchWorkStatuses = async () => {
      const querySnapshot = await getDocs(collection(db, "WorkStatus"));
      const statuses = querySnapshot.docs.map(doc => doc.data().name);
      setWorkStatuses(statuses);
    };

    fetchWorkStatuses();
  }, []);

  const updateStatus = async (newStatus) => {
    const userRef = doc(db, "UserStatus", user.uid);
    try {
      await setDoc(userRef, {
        status: newStatus,
      });
      setCurrentStatus(newStatus);
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error updating status: ", error);
    }
  };

  return (
    <SafeAreaView className="flex h-full bg-gray-900">
        <Header title="Work"/>
          <ScrollView>
        <View className="bg-gray-800 py-2 px-4 rounded-3xl my-5 mx-5">
          <Text className="text-3xl font-bold text-[#fff6e3] text-center mb-2 border-b-[2px]">Work Status</Text>
          <Text className="text-2xl text-[#fff6e3] my-2">Status: {currentStatus}</Text>
          <Text className="text-2xl text-[#fff6e3] my-2">{timeUntilNextBreak}</Text>
          <Text className="text-2xl text-[#fff6e3] my-2">{workTimeMessage}</Text>
          
          <TouchableOpacity 
            className="bg-[#fff6e3] py-2 px-4 rounded-full mx-5 my-5"
            onPress={() => setIsModalVisible(true)}>
            <Text className="text-lg text-center">Change status</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-[#fff6e3] py-2 px-4 rounded-full mx-5 my-2">
            <Text className="text-lg text-center">Timetable (Disabled)</Text>
          </TouchableOpacity>
        </View>

        <View className="flex">
          <TouchableOpacity className="bg-[#fff6e3] py-2 px-4 rounded-full mx-10 my-2"
            onPress={() => navigation.navigate('ScheduleScreen')}>
            <Text className="text-lg text-center">Set up work schedule</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(!isModalVisible)}
      >
        <View className="m-10 bg-white rounded-lg p-8 shadow-lg">
          <Text className="text-xl font-bold text-center mb-4">Change Work Status</Text>
          
          {workStatuses.map((status, index) => (
            <TouchableOpacity key={index} 
              className="bg-blue-500 py-2 rounded-full mb-4"
              onPress={() => updateStatus(status)}>
              <Text className="text-center text-white text-lg">{status}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity 
            className="bg-gray-300 py-2 rounded-full"
            onPress={() => setIsModalVisible(!isModalVisible)}>
            <Text className="text-center">Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  )
}