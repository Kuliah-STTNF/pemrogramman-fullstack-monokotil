import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const STORAGE_KEY = 'tixflow_auth'
const USERS_KEY = 'tixflow_users'
const ORDERS_KEY = 'tixflow_orders'

function loadFromStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch { /* silently fail */ }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadFromStorage(STORAGE_KEY, null))
  const [orders, setOrders] = useState(() => loadFromStorage(ORDERS_KEY, []))

  useEffect(() => {
    saveToStorage(STORAGE_KEY, user)
  }, [user])

  useEffect(() => {
    saveToStorage(ORDERS_KEY, orders)
  }, [orders])

  const register = (userData) => {
    const users = loadFromStorage(USERS_KEY, [])
    const exists = users.find(u => u.email === userData.email)
    if (exists) return { success: false, message: 'Email already registered' }

    const newUser = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phone: userData.phone || '',
      createdAt: new Date().toISOString(),
    }
    users.push(newUser)
    saveToStorage(USERS_KEY, users)

    const { password, ...safeUser } = newUser
    setUser(safeUser)
    return { success: true }
  }

  const login = (email, password) => {
    const users = loadFromStorage(USERS_KEY, [])
    const found = users.find(u => u.email === email && u.password === password)
    if (!found) return { success: false, message: 'Invalid email or password' }

    const { password: _, ...safeUser } = found
    setUser(safeUser)
    return { success: true }
  }

  const logout = () => {
    setUser(null)
  }

  const addOrder = (order) => {
    const newOrder = {
      ...order,
      id: `ORD-${Date.now()}`,
      userId: user?.id,
      date: new Date().toISOString(),
      status: 'confirmed',
    }
    const updated = [newOrder, ...orders]
    setOrders(updated)
    return newOrder
  }

  const getUserOrders = () => {
    if (!user) return []
    return orders.filter(o => o.userId === user.id)
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      register,
      login,
      logout,
      addOrder,
      getUserOrders,
      orders,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
