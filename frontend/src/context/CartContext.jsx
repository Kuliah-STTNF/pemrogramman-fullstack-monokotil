import { createContext, useContext, useReducer, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

const BLANK_CART = { items: [], total: 0 }
const ANONYMOUS_CART_KEY = 'tixflow_cart_guest'

/* ── Storage & Calculation Helpers ──────────────────── */

const fetchStoredCart = (key) => {
  if (!key) return BLANK_CART
  try {
    const rawData = localStorage.getItem(key)
    return rawData ? JSON.parse(rawData) : BLANK_CART
  } catch {
    return BLANK_CART
  }
}

const persistCartData = (key, dataState) => {
  if (!key) return
  try {
    localStorage.setItem(key, JSON.stringify(dataState))
  } catch { /* fail silently */ }
}

const computeGrandTotal = (cartItems) => 
  cartItems.reduce((acc, current) => acc + current.price * current.quantity, 0)

/* ── Cart Reducer Core Logic ────────────────────────── */

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_TICKET': {
      const targetIndex = state.items.findIndex(
        item => item.id === action.payload.id && item.itemType === 'ticket'
      )
      
      let updatedItems = [...state.items]
      if (targetIndex > -1) {
        const targetItem = updatedItems[targetIndex]
        updatedItems[targetIndex] = { ...targetItem, quantity: targetItem.quantity + action.payload.quantity }
      } else {
        updatedItems.push({ ...action.payload, itemType: 'ticket' })
      }

      return { ...state, items: updatedItems, total: computeGrandTotal(updatedItems) }
    }

    case 'ADD_MERCH': {
      const generatedKey = `${action.payload.id}-${action.payload.size || 'default'}-${action.payload.color || 'default'}`
      const targetIndex = state.items.findIndex(
        item => item.cartKey === generatedKey && item.itemType === 'merch'
      )

      let updatedItems = [...state.items]
      if (targetIndex > -1) {
        const targetItem = updatedItems[targetIndex]
        updatedItems[targetIndex] = { ...targetItem, quantity: targetItem.quantity + action.payload.quantity }
      } else {
        updatedItems.push({ ...action.payload, cartKey: generatedKey, itemType: 'merch' })
      }

      return { ...state, items: updatedItems, total: computeGrandTotal(updatedItems) }
    }

    case 'UPDATE_QUANTITY': {
      const modifiedItems = state.items
        .map(item => {
          const incomingKey = action.payload.cartKey || action.payload.id
          const currentKey = item.cartKey || item.id
          
          if (currentKey === incomingKey && item.itemType === action.payload.itemType) {
            return { ...item, quantity: Math.max(0, action.payload.quantity) }
          }
          return item
        })
        .filter(item => item.quantity > 0)

      return { ...state, items: modifiedItems, total: computeGrandTotal(modifiedItems) }
    }

    case 'REMOVE_ITEM': {
      const incomingKey = action.payload.cartKey || action.payload.id
      const filteredItems = state.items.filter(item => {
        const currentKey = item.cartKey || item.id
        return !(currentKey === incomingKey && item.itemType === action.payload.itemType)
      })

      return { ...state, items: filteredItems, total: computeGrandTotal(filteredItems) }
    }

    case 'CLEAR_CART':
      return { items: [], total: 0 }

    case 'REMOVE_SELECTED_ITEMS': {
      const blacklistedKeys = new Set(action.payload)
      const remainingItems = state.items.filter(item => {
        const currentKey = item.cartKey || `${item.itemType}-${item.id}`
        return !blacklistedKeys.has(currentKey)
      })

      return { ...state, items: remainingItems, total: computeGrandTotal(remainingItems) }
    }

    case 'SET_STATE':
      return action.payload

    default:
      return state
  }
}

/* ── Provider Component ──────────────────────────────── */

export function CartProvider({ children }) {
  const { user, isAuthenticated } = useAuth()
  const currentStorageKey = isAuthenticated && user?.id ? `tixflow_cart_${user.id}` : ANONYMOUS_CART_KEY
  
  const [state, dispatch] = useReducer(cartReducer, BLANK_CART)
  const [activeSyncKey, setActiveSyncKey] = useState(null)

  useEffect(() => {
    const initializedCart = fetchStoredCart(currentStorageKey)

    // Logika sinkronisasi data dari guest cart saat user melakukan login
    if (currentStorageKey !== ANONYMOUS_CART_KEY && initializedCart.items.length === 0) {
      const temporaryGuestCart = fetchStoredCart(ANONYMOUS_CART_KEY)
      if (temporaryGuestCart.items.length > 0) {
        dispatch({ type: 'SET_STATE', payload: temporaryGuestCart })
        persistCartData(currentStorageKey, temporaryGuestCart)
        localStorage.removeItem(ANONYMOUS_CART_KEY)
        setActiveSyncKey(currentStorageKey)
        return
      }
    }

    dispatch({ type: 'SET_STATE', payload: initializedCart })
    setActiveSyncKey(currentStorageKey)
  }, [currentStorageKey])

  useEffect(() => {
    if (activeSyncKey !== currentStorageKey) return
    persistCartData(currentStorageKey, state)
  }, [currentStorageKey, state, activeSyncKey])

  /* ── Action Dispatcers ──────────────────────────────── */
  const addTicket = (ticketItem) => dispatch({ type: 'ADD_TICKET', payload: ticketItem })
  const addMerch = (merchItem) => dispatch({ type: 'ADD_MERCH', payload: merchItem })
  
  const updateQuantity = (id, itemType, quantity, cartKey) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, itemType, quantity, cartKey } })
    
  const removeItem = (id, itemType, cartKey) =>
    dispatch({ type: 'REMOVE_ITEM', payload: { id, itemType, cartKey } })
    
  const clearCart = () => dispatch({ type: 'CLEAR_CART' })
  
  const removeSelectedItems = (selectedItemsList) => dispatch({
    type: 'REMOVE_SELECTED_ITEMS',
    payload: selectedItemsList.map(item => item.cartKey || `${item.itemType}-${item.id}`),
  })

  const totalQuantityCount = state.items.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <CartContext.Provider value={{
      items: state.items,
      total: state.total,
      itemCount: totalQuantityCount,
      addTicket,
      addMerch,
      updateQuantity,
      removeItem,
      clearCart,
      removeSelectedItems,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const cartContextInstance = useContext(CartContext)
  if (!cartContextInstance) {
    throw new Error('useCart must be used within CartProvider')
  }
  return cartContextInstance
}