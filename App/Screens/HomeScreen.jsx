import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native'
import { useEffect, useState } from 'react'
import Header from '../Components/Header'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { app } from './../../firebaseConfig'
import { collection, doc, getDoc, getDocs, getFirestore, onSnapshot } from 'firebase/firestore'
import { useStatus } from '../Context/StatusContext'
import { useExercise } from '../Context/ExerciseContext'
import { getAuth } from 'firebase/auth'

export default function HomeScreen() {

  const [loading, setLoading] = useState(true)
  const [myExercisesList, setMyExercisesList] = useState([])
  const navigation = useNavigation()
  const auth = getAuth(app);
  const user = auth.currentUser;
  const db = getFirestore(app)
  const { currentStatus, setCurrentStatus, timeUntilNextBreak, setTimeUntilNextBreak, workTimeMessage, setWorkTimeMessage } = useStatus();
  const { setExercisesList } = useExercise();

  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(collection(db, "myExercises", user.uid, "UserExercises"), (querySnapshot) => {
        const exercisesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMyExercisesList(exercisesData);
        setLoading(false);
      });
  
      return () => unsubscribe();
    }
  }, [user, db]);

  useEffect(() => {
    getExercises()
    const fetchAndCalculateTimes = async () => {
    fetchScheduleAndStatus();
    }
    fetchAndCalculateTimes();

    const intervalId = setInterval(() => {
      fetchAndCalculateTimes()
  }, 60000)

  return () => clearInterval(intervalId);
  }, []);

  const fetchScheduleAndStatus = async () => {

    const scheduleSnapshot = await getDocs(collection(db, "Schedules", user.uid, "UserSchedule"));
    if (!scheduleSnapshot.empty) {
      const scheduleData = scheduleSnapshot.docs[0].data();
      const today = new Date();
      const workStartTime = new Date(scheduleData.startWorkTime.toDate());
      const workEndTime = new Date(scheduleData.endWorkTime.toDate());
      // Adjust start and end times to today
      workStartTime.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
      workEndTime.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
      
      const breaksData = scheduleData.breaks.map(b => ({
        startBreakTime: new Date(b.startBreakTime.toDate()),
        endBreakTime: new Date(b.endBreakTime.toDate())
      })).map(b => {
        // Adjust break times to today
        const start = new Date(b.startBreakTime);
        const end = new Date(b.endBreakTime);
        start.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
        end.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
        return { startBreakTime: start, endBreakTime: end };
      });

      setWorkTimeMessage(calculateWorkTimeMessage(today, workStartTime, workEndTime));
      calculateBreaks(today, breaksData, workStartTime, workEndTime);
    }

    const statusRef = doc(db, "UserStatus", user.uid);
    const statusSnap = await getDoc(statusRef);
    if (statusSnap.exists()) {
      setCurrentStatus(statusSnap.data().status);
    }
  };

  const calculateWorkTimeMessage = (now, start, end) => {
    if (now < start) {
      return `Work starts in: ${formatTimeDiff(start - now)}`;
    } else if (now >= start && now <= end) {
      return `Work ends in: ${formatTimeDiff(end - now)}`;
    } else {
      return "Work has ended for today.";
    }
  };

  const calculateBreaks = (now, breaks, workStartTime, workEndTime) => {
    if (now < workStartTime || now > workEndTime) {
      setTimeUntilNextBreak("No breaks scheduled");
      return;
    }

    const upcomingBreak = breaks.find(b => now < b.startBreakTime);
    if (upcomingBreak) {
      setTimeUntilNextBreak(`Break in: ${formatTimeDiff(upcomingBreak.startBreakTime - now)}`);
    } else {
      setTimeUntilNextBreak("No breaks scheduled");
    }
  };

  const formatTimeDiff = (diff) => {
    const hours = Math.floor(diff / (3600 * 1000));
    const minutes = Math.floor((diff % (3600 * 1000)) / (60 * 1000));
    return `${hours}h ${minutes}m`;
  };

  const getExercises = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "exercises"))
      const exercisesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setExercisesList(exercisesData)
    } catch (error) {
      console.error("Error getting exercises:", error)
    }
  }

  return (
    <SafeAreaView className="h-full flex bg-gray-900">
        <Header title="Home"/>
        {loading ? (
          <View className="flex items-center justify-center h-full">
            <Text className="text-xl text-[#fff6e3] my-2">Loading</Text>
            <ActivityIndicator color="#fff6e3" />
          </View>
        ) : (
        <ScrollView>
          <View className="bg-gray-800 py-2 px-4 rounded-3xl my-5 mx-5">
            <Text className="text-3xl font-bold text-[#fff6e3] text-center mb-2">Work Status</Text>
            <Text className="text-2xl text-[#fff6e3] my-2">Status: {currentStatus}</Text>
            <Text className="text-2xl text-[#fff6e3] my-2">{timeUntilNextBreak}</Text>
            <Text className="text-2xl text-[#fff6e3] my-2">{workTimeMessage}</Text>
            </View>

            <View className="bg-gray-800 py-2 px-4 rounded-3xl my-5 mx-5">
            <Text className="text-3xl font-bold text-[#fff6e3] text-center mb-2">Health Tip</Text>
            <Text className="text-2xl text-[#fff6e3] my-2">Random Tip</Text>
            </View>

          <View className="flex items-center rounded-3xl bg-gray-800 py-2 px-4 my-5 mx-5">
            <Text className="text-3xl font-bold text-[#fff6e3] text-center mb-2">My Exercises</Text>
            {myExercisesList.map((exercise, index) => (
              <TouchableOpacity 
                key={index} 
                className="w-[70%] bg-[#fff6e3] py-3 px-4 rounded-full m-3"
                onPress={() => navigation.navigate('ExerciseLibrary', {
                  screen: 'ExerciseInfoScreen',
                  params: {exerciseId: exercise.exerciseId},
                })}>
                <Text className="text-center text-xl">{exercise.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          </ScrollView>
        )}
    </SafeAreaView>
  )
}