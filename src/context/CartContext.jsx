import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext(null)

const STORAGE_KEY = 'tixflow_cart'

function loadCartFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : { items: [], total: 0 }
  } catch {
    return { items: [], total: 0 }
  }
}

function saveCartToStorage(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch { /* silently fail */ }
}

function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

function cartReducer(state, action) {
  let newState

  switch (action.type) {
    case 'ADD_TICKET': {
      const existing = state.items.find(
        item => item.id === action.payload.id && item.itemType === 'ticket'
      )
      if (existing) {
        const items = state.items.map(item =>
          item.id === action.payload.id && item.itemType === 'ticket'
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        )
        newState = { ...state, items, total: calculateTotal(items) }
      } else {
        const items = [...state.items, { ...action.payload, itemType: 'ticket' }]
        newState = { ...state, items, total: calculateTotal(items) }
      }
      break
    }

    case 'ADD_MERCH': {
      const key = `${action.payload.id}-${action.payload.size || 'default'}-${action.payload.color || 'default'}`
      const existing = state.items.find(
        item => item.cartKey === key && item.itemType === 'merch'
      )
      if (existing) {
        const items = state.items.map(item =>
          item.cartKey === key && item.itemType === 'merch'
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        )
        newState = { ...state, items, total: calculateTotal(items) }
      } else {
        const items = [...state.items, { ...action.payload, cartKey: key, itemType: 'merch' }]
        newState = { ...state, items, total: calculateTotal(items) }
      }
      break
    }

    case 'UPDATE_QUANTITY': {
      const items = state.items.map(item => {
        const matchKey = action.payload.cartKey || action.payload.id
        const itemKey = item.cartKey || item.id
        if (itemKey === matchKey && item.itemType === action.payload.itemType) {
          return { ...item, quantity: Math.max(0, action.payload.quantity) }
        }
        return item
      }).filter(item => item.quantity > 0)
      newState = { ...state, items, total: calculateTotal(items) }
      break
    }

    case 'REMOVE_ITEM': {
      const matchKey = action.payload.cartKey || action.payload.id
      const items = state.items.filter(item => {
        const itemKey = item.cartKey || item.id
        return !(itemKey === matchKey && item.itemType === action.payload.itemType)
      })
      newState = { ...state, items, total: calculateTotal(items) }
      break
    }

    case 'CLEAR_CART':
      newState = { items: [], total: 0 }
      break

    default:
      return state
  }

  saveCartToStorage(newState)
  return newState
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, null, loadCartFromStorage)

  useEffect(() => {
    saveCartToStorage(state)
  }, [state])

  const addTicket = (ticket) => dispatch({ type: 'ADD_TICKET', payload: ticket })
  const addMerch = (merch) => dispatch({ type: 'ADD_MERCH', payload: merch })
  const updateQuantity = (id, itemType, quantity, cartKey) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, itemType, quantity, cartKey } })
  const removeItem = (id, itemType, cartKey) =>
    dispatch({ type: 'REMOVE_ITEM', payload: { id, itemType, cartKey } })
  const clearCart = () => dispatch({ type: 'CLEAR_CART' })

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{
      items: state.items,
      total: state.total,
      itemCount,
      addTicket,
      addMerch,
      updateQuantity,
      removeItem,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
