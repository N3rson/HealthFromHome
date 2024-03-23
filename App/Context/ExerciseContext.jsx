import React, { createContext, useState, useContext } from 'react'

const ExerciseContext = createContext()

export const ExerciseProvider = ({ children }) => {

const [exercisesList, setExercisesList] = useState([])

  const value = {
    exercisesList,
    setExercisesList
  }

  return <ExerciseContext.Provider value={value}>{children}</ExerciseContext.Provider>
}

export const useExercise = () => useContext(ExerciseContext)