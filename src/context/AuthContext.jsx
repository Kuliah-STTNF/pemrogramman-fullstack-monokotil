import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const STORAGE_KEY = 'tixflow_auth'
const USERS_KEY = 'tixflow_users'
const ORDERS_KEY = 'tixflow_orders'
const ADMIN_EVENTS_KEY = 'tixflow_admin_events'
const CATEGORIES_KEY = 'tixflow_categories'
const REFUNDS_KEY = 'tixflow_refunds'
const CHATS_KEY = 'tixflow_chats'
const VOUCHERS_KEY = 'tixflow_vouchers'

const DEFAULT_VOUCHERS = [
  { code: 'WELCOME20', type: 'percentage', value: 20, minPurchase: 50, maxUses: 100, usedCount: 0, description: '20% off your first order' },
  { code: 'MONORA10', type: 'percentage', value: 10, minPurchase: 0, maxUses: 500, usedCount: 0, description: '10% off any order' },
  { code: 'SAVE15', type: 'percentage', value: 15, minPurchase: 100, maxUses: 200, usedCount: 0, description: '15% off orders above $100' },
  { code: 'FLAT25', type: 'flat', value: 25, minPurchase: 75, maxUses: 150, usedCount: 0, description: '$25 off orders above $75' },
  { code: 'FEST30', type: 'percentage', value: 30, minPurchase: 150, maxUses: 50, usedCount: 0, description: '30% off orders above $150' },
]

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
  const [refunds, setRefunds] = useState(() => loadFromStorage(REFUNDS_KEY, []))
  const [chats, setChats] = useState(() => loadFromStorage(CHATS_KEY, []))
  const [vouchers, setVouchers] = useState(() => loadFromStorage(VOUCHERS_KEY, DEFAULT_VOUCHERS))

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

  useEffect(() => {
    saveToStorage(REFUNDS_KEY, refunds)
  }, [refunds])

  useEffect(() => {
    saveToStorage(CHATS_KEY, chats)
  }, [chats])

  useEffect(() => {
    saveToStorage(VOUCHERS_KEY, vouchers)
  }, [vouchers])

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

  // ─── Voucher Functions ───
  const validateVoucher = (code, orderTotal) => {
    const voucher = vouchers.find(v => v.code === code.toUpperCase())
    if (!voucher) return { valid: false, message: 'Invalid voucher code' }
    if (voucher.usedCount >= voucher.maxUses) return { valid: false, message: 'Voucher has been fully redeemed' }
    if (orderTotal < voucher.minPurchase) return { valid: false, message: `Minimum purchase $${voucher.minPurchase} required` }
    const discount = voucher.type === 'percentage'
      ? Math.round(orderTotal * voucher.value / 100 * 100) / 100
      : Math.min(voucher.value, orderTotal)
    return { valid: true, voucher, discount, message: `${voucher.description} — You save $${discount.toFixed(2)}` }
  }

  const useVoucher = (code) => {
    setVouchers(prev => prev.map(v =>
      v.code === code.toUpperCase() ? { ...v, usedCount: v.usedCount + 1 } : v
    ))
  }

  const addVoucher = (voucherData) => {
    const code = voucherData.code.trim().toUpperCase()
    if (vouchers.find(v => v.code === code)) return { success: false, message: 'Voucher code already exists' }
    const newVoucher = {
      code,
      type: voucherData.type || 'percentage',
      value: Number(voucherData.value) || 0,
      minPurchase: Number(voucherData.minPurchase) || 0,
      maxUses: Number(voucherData.maxUses) || 100,
      usedCount: 0,
      description: voucherData.description || '',
    }
    setVouchers(prev => [...prev, newVoucher])
    return { success: true }
  }

  const updateVoucher = (code, updates) => {
    setVouchers(prev => prev.map(v =>
      v.code === code ? { ...v, ...updates } : v
    ))
  }

  const deleteVoucher = (code) => {
    setVouchers(prev => prev.filter(v => v.code !== code))
  }

  const setEventDiscount = (eventId, discount) => {
    setAdminEvents(prev => prev.map(e =>
      e.id === eventId ? { ...e, discount, updatedAt: new Date().toISOString() } : e
    ))
  }

  const removeEventDiscount = (eventId) => {
    setAdminEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        const { discount, ...rest } = e
        return { ...rest, updatedAt: new Date().toISOString() }
      }
      return e
    }))
  }

  // ─── Refund Functions ───
  const requestRefund = (orderId, reason) => {
    const existing = refunds.find(r => r.orderId === orderId)
    if (existing) return { success: false, message: 'Refund already requested for this order' }
    const refund = {
      id: `REF-${Date.now()}`,
      orderId,
      userId: user?.id,
      reason,
      status: 'pending',
      requestedAt: new Date().toISOString(),
      processedAt: null,
    }
    setRefunds(prev => [refund, ...prev])
    return { success: true, refund }
  }

  const getRefundByOrderId = (orderId) => {
    return refunds.find(r => r.orderId === orderId) || null
  }

  const getAllRefunds = () => refunds

  const updateRefundStatus = (refundId, newStatus) => {
    setRefunds(prev => prev.map(r =>
      r.id === refundId ? { ...r, status: newStatus, processedAt: new Date().toISOString() } : r
    ))
    // If approved, update order status too
    if (newStatus === 'approved') {
      const refund = refunds.find(r => r.id === refundId)
      if (refund) updateOrderStatus(refund.orderId, 'refunded')
    }
  }

  // ─── Chat Functions ───
  const sendMessage = (eventId, eventTitle, organizerName, messageText, sender = 'customer') => {
    const chatKey = `${user?.id}-${eventId}`
    const message = {
      id: Date.now(),
      text: messageText,
      sender,
      timestamp: new Date().toISOString(),
    }
    setChats(prev => {
      const existing = prev.find(c => c.chatKey === chatKey)
      if (existing) {
        return prev.map(c => c.chatKey === chatKey
          ? { ...c, messages: [...c.messages, message], updatedAt: new Date().toISOString() }
          : c
        )
      }
      return [...prev, {
        chatKey,
        userId: user?.id,
        userName: user?.name,
        eventId,
        eventTitle,
        organizerName,
        messages: [message],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }]
    })
    // Simulate organizer auto-reply after a short delay
    if (sender === 'customer') {
      setTimeout(() => {
        const replies = [
          `Thanks for reaching out about ${eventTitle}! How can we help you?`,
          'We appreciate your interest! Let us know if you have any questions.',
          'Hello! Our team is here to help. What would you like to know?',
          `Excited that you're interested in ${eventTitle}! Feel free to ask anything.`,
          'Thanks for your message! We\'ll get back to you with more details shortly.',
        ]
        const autoReply = {
          id: Date.now() + 1,
          text: replies[Math.floor(Math.random() * replies.length)],
          sender: 'organizer',
          timestamp: new Date().toISOString(),
        }
        setChats(prev => prev.map(c => c.chatKey === chatKey
          ? { ...c, messages: [...c.messages, autoReply], updatedAt: new Date().toISOString() }
          : c
        ))
      }, 1500)
    }
  }

  const getChatMessages = (eventId) => {
    const chatKey = `${user?.id}-${eventId}`
    const chat = chats.find(c => c.chatKey === chatKey)
    return chat ? chat.messages : []
  }

  const getUserChats = () => {
    if (!user) return []
    return chats.filter(c => c.userId === user.id)
  }

  // Admin: send reply to a specific chat (organizer → customer)
  const sendAdminReply = (chatKey, messageText) => {
    const message = {
      id: Date.now(),
      text: messageText,
      sender: 'organizer',
      timestamp: new Date().toISOString(),
    }
    setChats(prev => prev.map(c =>
      c.chatKey === chatKey
        ? { ...c, messages: [...c.messages, message], updatedAt: new Date().toISOString() }
        : c
    ))
  }

  // Event admin: get all chats related to my events
  const getEventChats = (eventId) => {
    return chats.filter(c => c.eventId === eventId || c.eventId === Number(eventId))
  }

  // App admin: get all chats on the platform
  const getAllChats = () => chats

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
      // Vouchers
      validateVoucher,
      useVoucher,
      addVoucher,
      updateVoucher,
      deleteVoucher,
      vouchers,
      // Discounts
      setEventDiscount,
      removeEventDiscount,
      // Refunds
      requestRefund,
      getRefundByOrderId,
      getAllRefunds,
      updateRefundStatus,
      refunds,
      // Chat
      sendMessage,
      getChatMessages,
      getUserChats,
      sendAdminReply,
      getEventChats,
      getAllChats,
      chats,
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
