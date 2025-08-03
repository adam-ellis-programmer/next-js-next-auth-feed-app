'use client'
import { createContext, useContext, useState } from 'react'

const AlertContext = createContext({})

export const useAlert = () => {
  const context = useContext(AlertContext)
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider')
  }
  return context
}

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({
    show: false,
    message: '',
    type: 'error', // 'error', 'success', 'warning', 'info'
  })

  const showAlert = (message, type = 'error', duration = 5000) => {
    setAlert({
      show: true, // ← FIXED: This was set to false!
      message,
      type,
    })

    // Auto-hide after duration
    if (duration > 0) {
      setTimeout(() => {
        hideAlert()
      }, duration)
    }
  }

  const hideAlert = () => {
    setAlert((prev) => ({
      ...prev,
      show: false,
    }))
  }

  // Specific method for demo user alerts
  const showDemoAlert = () => {
    showAlert('You cannot perform this action as a demo user', 'error', 4000)
  }

  const value = {
    alert,
    showAlert,
    hideAlert,
    showDemoAlert,
  }

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>
}
