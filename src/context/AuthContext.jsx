import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const STORAGE_KEY = 'tixflow_auth'
const USERS_KEY = 'tixflow_users'
const ORDERS_KEY = 'tixflow_orders'
const ADMIN_EVENTS_KEY = 'tixflow_admin_events'
const CATEGORIES_KEY = 'tixflow_categories'

const DEFAULT_CATEGORIES = [
  { id: 1, name: 'Concerts', icon: 'IoMusicalNotes', gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)' },
  { id: 2, name: 'Sports', icon: 'IoFootball', gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)' },
  { id: 3, name: 'Comedy', icon: 'IoHappy', gradient: 'linear-gradient(135deg, #f97316, #ea580c)' },
  { id: 4, name: 'Festivals', icon: 'IoSparkles', gradient: 'linear-gradient(135deg, #ec4899, #db2777)' },
]

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
  const [categories, setCategories] = useState(() => loadFromStorage(CATEGORIES_KEY, DEFAULT_CATEGORIES))

  useEffect(() => {
    saveToStorage(STORAGE_KEY, user)
  }, [user])

  useEffect(() => {
    saveToStorage(ORDERS_KEY, orders)
  }, [orders])

  useEffect(() => {
    saveToStorage(ADMIN_EVENTS_KEY, adminEvents)
  }, [adminEvents])

  useEffect(() => {
    saveToStorage(CATEGORIES_KEY, categories)
  }, [categories])

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

  const updateOrderStatus = (orderId, newStatus) => {
    const updated = orders.map(o =>
      o.id === orderId ? { ...o, status: newStatus } : o
    )
    setOrders(updated)
  }

  // ─── App Admin Functions ───
  const getAllUsers = () => {
    return loadFromStorage(USERS_KEY, []).map(({ password, ...u }) => u)
  }

  const updateUserRole = (userId, newRole) => {
    const users = loadFromStorage(USERS_KEY, [])
    const updated = users.map(u => u.id === userId ? { ...u, role: newRole } : u)
    saveToStorage(USERS_KEY, updated)
    if (user?.id === userId) setUser(prev => ({ ...prev, role: newRole }))
  }

  const toggleUserStatus = (userId) => {
    const users = loadFromStorage(USERS_KEY, [])
    const updated = users.map(u => u.id === userId ? { ...u, isActive: u.isActive === false ? true : false } : u)
    saveToStorage(USERS_KEY, updated)
  }

  const deleteUser = (userId) => {
    const users = loadFromStorage(USERS_KEY, [])
    saveToStorage(USERS_KEY, users.filter(u => u.id !== userId))
  }

  const getAllAdminEvents = () => adminEvents

  // ─── Category Functions ───
  const getCategories = () => categories

  const addCategory = (categoryData) => {
    const newCat = { ...categoryData, id: Date.now() }
    setCategories(prev => [...prev, newCat])
    return newCat
  }

  const updateCategory = (catId, data) => {
    setCategories(prev => prev.map(c => c.id === catId ? { ...c, ...data } : c))
  }

  const deleteCategory = (catId) => {
    setCategories(prev => prev.filter(c => c.id !== catId))
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
      // Event admin
      adminEvents,
      addAdminEvent,
      updateAdminEvent,
      deleteAdminEvent,
      getMyEvents,
      getEventOrders,
      getAllOrders,
      updateOrderStatus,
      // App admin
      getAllUsers,
      updateUserRole,
      toggleUserStatus,
      deleteUser,
      getAllAdminEvents,
      // Categories
      categories,
      getCategories,
      addCategory,
      updateCategory,
      deleteCategory,
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
