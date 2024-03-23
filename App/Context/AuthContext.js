import { createContext, useContext, useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { app } from '../../firebaseConfig'
const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [initializing, setInitializing] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const auth = getAuth(app)
    const subscriber = onAuthStateChanged(auth, (user) => {
      setUser(user)
      if (initializing) setInitializing(false)
    })

    return subscriber
  }, [])

  return (
    <AuthContext.Provider value={{ user, initializing }}>
      {!initializing && children}
    </AuthContext.Provider>
  )
}