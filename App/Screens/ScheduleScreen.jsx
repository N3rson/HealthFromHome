import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { collection, doc, getDocs, setDoc, Timestamp } from "firebase/firestore"
import { getFirestore } from 'firebase/firestore'
import { app } from './../../firebaseConfig'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../Components/Header'
import { getAuth } from 'firebase/auth'
import { useNavigation } from '@react-navigation/native'
import { useStatus } from '../Context/StatusContext';

const ScheduleScreen = () => {

  const [startWorkTime, setStartWorkTime] = useState(new Date())
  const [showStartWorkPicker, setShowStartWorkPicker] = useState(false)

  const [endWorkTime, setEndWorkTime] = useState(new Date())
  const [showEndWorkPicker, setShowEndWorkPicker] = useState(false)

  const [breaks, setBreaks] = useState([{ startBreakTime: new Date(), endBreakTime: new Date(), showStartBreakPicker: false, showEndBreakPicker: false }])

  const [selectedDays, setSelectedDays] = useState([])
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const auth = getAuth(app)
  const user = auth.currentUser
  const db = getFirestore(app)
  const navigation = useNavigation()
  const { setTimeUntilNextBreak, setWorkTimeMessage } = useStatus();
  
  useEffect(() => {
    if (user) {
      fetchSchedule()
    }
  }, [user])

  const fetchSchedule = async () => {
    const userScheduleRef = collection(db, "Schedules", user.uid, "UserSchedule")
    const querySnapshot = await getDocs(userScheduleRef)
    if (!querySnapshot.empty) {
      const scheduleData = querySnapshot.docs[0].data()
      setStartWorkTime(scheduleData.startWorkTime.toDate())
      setEndWorkTime(scheduleData.endWorkTime.toDate())
      setBreaks(scheduleData.breaks.map(b => ({
        startBreakTime: b.startBreakTime.toDate(),
        endBreakTime: b.endBreakTime.toDate(),
      })))
      setSelectedDays(scheduleData.selectedDays)
    }
  }

  const handleSaveSchedule = async () => {
    const userScheduleRef = doc(db, "Schedules", user.uid, "UserSchedule", "current") // Assuming "current" as the ID for the current schedule.
    try {
      await setDoc(userScheduleRef, {
        startWorkTime: Timestamp.fromDate(startWorkTime),
        endWorkTime: Timestamp.fromDate(endWorkTime),
        breaks: breaks.map(b => ({
          startBreakTime: Timestamp.fromDate(b.startBreakTime),
          endBreakTime: Timestamp.fromDate(b.endBreakTime),
        })),
        selectedDays,
      }, { merge: true })
      updateStatusContext();
      alert("Schedule Saved!")
      navigation.navigate('WorkScreen')
    } catch (e) {
      console.error("Error saving schedule: ", e)
    }
  }

  const toggleDay = (day) => {
    setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])
  }

  const formatTime = (date) => `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`

  const addBreak = () => {
    setBreaks([...breaks, { startBreakTime: new Date(), endBreakTime: new Date(), showStartBreakPicker: false, showEndBreakPicker: false }])
  }

  const removeBreak = (index) => {
    setBreaks(breaks.filter((_, i) => i !== index))
  }

  const showDatePicker = (index, isStart) => {
    setBreaks(breaks.map((breakItem, i) => {
      if (i === index) {
        return {
          ...breakItem,
          [isStart ? 'showStartBreakPicker' : 'showEndBreakPicker']: true,
        }
      }
      return breakItem
    }))
  }

  const handleDateChange = (event, selectedDate, index, isStart) => {
    const newState = breaks.map((breakItem, i) => {
        if (i === index) {
            return {
                ...breakItem,
                [isStart ? 'startBreakTime' : 'endBreakTime']: selectedDate || breakItem[isStart ? 'startBreakTime' : 'endBreakTime'],
                [isStart ? 'showStartBreakPicker' : 'showEndBreakPicker']: false,
            }
        }
        return breakItem
    })
    setBreaks(newState)
}
const updateStatusContext = () => {
  const now = new Date();

  // Assuming workStartTime and workEndTime are your start and end times for work
  const workStartTime = new Date(startWorkTime.setFullYear(now.getFullYear(), now.getMonth(), now.getDate()));
  const workEndTime = new Date(endWorkTime.setFullYear(now.getFullYear(), now.getMonth(), now.getDate()));

  // Calculate Work Time Message
  let message;
  if (now < workStartTime) {
    message = `Work starts in: ${formatTimeDiff(workStartTime - now)}`;
  } else if (now >= workStartTime && now <= workEndTime) {
    message = `Work ends in: ${formatTimeDiff(workEndTime - now)}`;
  } else {
    message = "Work has ended for today.";
  }
  setWorkTimeMessage(message);

  // Calculate Time Until Next Break
  const nextBreak = breaks.map(b => ({
    startBreakTime: new Date(b.startBreakTime.setFullYear(now.getFullYear(), now.getMonth(), now.getDate())),
    endBreakTime: new Date(b.endBreakTime.setFullYear(now.getFullYear(), now.getMonth(), now.getDate()))
  })).sort((a, b) => a.startBreakTime - b.startBreakTime)
    .find(b => now < b.startBreakTime);

  if (nextBreak) {
    setTimeUntilNextBreak(`Break in: ${formatTimeDiff(nextBreak.startBreakTime - now)}`);
  } else {
    setTimeUntilNextBreak("No breaks scheduled");
  }
};

const formatTimeDiff = (diff) => {
  const hours = Math.floor(diff / (3600 * 1000));
  const minutes = Math.floor((diff % (3600 * 1000)) / (60 * 1000));
  return `${hours}h ${minutes}m`;
};
  return (
    <SafeAreaView className="flex-1 bg-gray-900 p-4">
      <ScrollView>
        <Header title="Schedule" showBack={true}/>
        
        <Text className="text-white text-2xl my-4 font-bold text-center">Work Time</Text>
        <View className="my-2 flex-row items-center justify-start">
          <Text className="text-white text-xl mr-4">Start: {formatTime(startWorkTime)}</Text>
          <TouchableOpacity className="bg-blue-500 py-2 px-4 rounded-md"
            onPress={() => setShowStartWorkPicker(true)}>
            <Text className="text-center text-white">Choose</Text>
          </TouchableOpacity>
        {showStartWorkPicker && (
          <DateTimePicker
            value={startWorkTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={(event, selectedDate) => {
              setShowStartWorkPicker(Platform.OS === 'ios')
              if (selectedDate) {
                setStartWorkTime(selectedDate)
              }
            }}
          />
        )}
        </View>

        <View className="my-2 flex-row items-center justify-start">
          <Text className="text-white text-xl mr-4">End: {formatTime(endWorkTime)}</Text>
          <TouchableOpacity className="bg-blue-500 py-2 px-4 rounded-md"
            onPress={() => setShowEndWorkPicker(true)}>
            <Text className="text-center text-white">Choose</Text>
          </TouchableOpacity>
        {showEndWorkPicker && (
          <DateTimePicker
            value={endWorkTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={(event, selectedDate) => {
              setShowEndWorkPicker(Platform.OS === 'ios')
              if (selectedDate) {
                setEndWorkTime(selectedDate)
              }
            }}
          />
        )}
        </View>

        <Text className="text-white text-2xl mt-4 font-bold text-center">Break Time</Text>
        {breaks.map((breakTime, index) => (
          <View key={index}>
              <Text className="text-white text-xl my-4 font-bold">Break {index + 1}:</Text>
              
              <View className="my-2 flex-row items-center justify-start">
                  <Text className="text-white text-xl mr-4">Start: {formatTime(breakTime.startBreakTime)}</Text>
                  <TouchableOpacity className="bg-blue-500 py-2 px-4 rounded-md"
                      onPress={() => showDatePicker(index, true)}>
                      <Text className="text-center text-white">Choose</Text>
                  </TouchableOpacity>
                  {breakTime.showStartBreakPicker && (
                      <DateTimePicker
                          value={breakTime.startBreakTime}
                          mode="time"
                          is24Hour={true}
                          display="default"
                          onChange={(event, selectedDate) => handleDateChange(event, selectedDate, index, true)}
                      />
                  )}
              </View>

              <View className="my-2 flex-row items-center justify-start">
                  <Text className="text-white text-xl mr-4">End: {formatTime(breakTime.endBreakTime)}</Text>
                  <TouchableOpacity className="bg-blue-500 py-2 px-4 rounded-md"
                      onPress={() => showDatePicker(index, false)}>
                      <Text className="text-center text-white">Choose</Text>
                  </TouchableOpacity>
                  {breakTime.showEndBreakPicker && (
                      <DateTimePicker
                          value={breakTime.endBreakTime}
                          mode="time"
                          is24Hour={true}
                          display="default"
                          onChange={(event, selectedDate) => handleDateChange(event, selectedDate, index, false)}
                      />
                  )}
              </View>
              {breaks.length > 1 && (
                  <TouchableOpacity className="bg-red-500 py-2 px-4 rounded-md my-2"
                      onPress={() => removeBreak(index)}>
                      <Text className="text-center text-white">Remove Break {index + 1}</Text>
                  </TouchableOpacity>
              )}
          </View>
        ))}
        <TouchableOpacity className="bg-green-500 py-2 px-4 rounded-md my-2"
            onPress={addBreak}>
            <Text className="text-center text-white">Add Another Break</Text>
        </TouchableOpacity>


        <View className="my-4">
          <Text className="text-xl text-white mb-2">Select Working Days:</Text>
          {daysOfWeek.map((day, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => toggleDay(day)}
              className={`my-1 px-4 py-2 rounded-md ${selectedDays.includes(day) ? 'bg-blue-500' : 'bg-gray-700'}`}>
              <Text className="text-white text-center text-lg">{day}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity onPress={handleSaveSchedule} className="bg-blue-500 py-3 px-4 rounded-md my-2">
          <Text className="text-center text-white text-lg">Save Schedule</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ScheduleScreen