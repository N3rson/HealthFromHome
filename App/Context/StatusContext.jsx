import React, { createContext, useState, useContext } from 'react'

const StatusContext = createContext()

export const StatusProvider = ({ children }) => {
  const [currentStatus, setCurrentStatus] = useState('')
  const [timeUntilNextBreak, setTimeUntilNextBreak] = useState('')
  const [workTimeMessage, setWorkTimeMessage] = useState('')

  const value = {
    currentStatus,
    setCurrentStatus,
    timeUntilNextBreak,
    setTimeUntilNextBreak,
    workTimeMessage,
    setWorkTimeMessage
  }

  return <StatusContext.Provider value={value}>{children}</StatusContext.Provider>
}

export const useStatus = () => useContext(StatusContext)