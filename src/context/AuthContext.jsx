import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const STORAGE_KEY = 'tixflow_auth'
const USERS_KEY = 'tixflow_users'
const ORDERS_KEY = 'tixflow_orders'
const ADMIN_EVENTS_KEY = 'tixflow_admin_events'

// Roles: 'customer' | 'event_admin' | 'app_admin'

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
  const [adminEvents, setAdminEvents] = useState(() => loadFromStorage(ADMIN_EVENTS_KEY, []))

  useEffect(() => {
    saveToStorage(STORAGE_KEY, user)
  }, [user])

  useEffect(() => {
    saveToStorage(ORDERS_KEY, orders)
  }, [orders])

  useEffect(() => {
    saveToStorage(ADMIN_EVENTS_KEY, adminEvents)
  }, [adminEvents])

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
      role: userData.role || 'customer',
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

  // ─── Event Admin Functions ───
  const addAdminEvent = (eventData) => {
    const newEvent = {
      ...eventData,
      id: Date.now(),
      createdBy: user?.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'published',
      totalSold: 0,
      totalRevenue: 0,
    }
    const updated = [newEvent, ...adminEvents]
    setAdminEvents(updated)
    return newEvent
  }

  const updateAdminEvent = (eventId, eventData) => {
    const updated = adminEvents.map(e =>
      e.id === eventId ? { ...e, ...eventData, updatedAt: new Date().toISOString() } : e
    )
    setAdminEvents(updated)
  }

  const deleteAdminEvent = (eventId) => {
    setAdminEvents(adminEvents.filter(e => e.id !== eventId))
  }

  const getMyEvents = () => {
    if (!user) return []
    if (user.role === 'app_admin') return adminEvents
    return adminEvents.filter(e => e.createdBy === user.id)
  }

  const getEventOrders = (eventId) => {
    return orders.filter(o => {
      if (!o.items) return false
      return o.items.some(item => item.eventId === eventId || item.eventId === String(eventId))
    })
  }

  const getAllOrders = () => orders

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
      // Event admin
      adminEvents,
      addAdminEvent,
      updateAdminEvent,
      deleteAdminEvent,
      getMyEvents,
      getEventOrders,
      getAllOrders,
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
