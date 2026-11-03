import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { loadState, saveState, clearAllState } from '../utils/storage'
import { uid } from '../utils/format'
import { DEFAULT_PROFILE, SEED_REPORTS } from '../data/seed'
import { getProductById } from '../data/products'

const AppContext = createContext(null)
const MAX_REPORTS = 50

function usePersistentState(key, fallback) {
  const [value, setValue] = useState(() => loadState(key, fallback))
  useEffect(() => {
    saveState(key, value)
  }, [key, value])
  return [value, setValue]
}

export function AppProvider({ children }) {
  const [profile, setProfile] = usePersistentState('profile', DEFAULT_PROFILE)
  const [reports, setReports] = usePersistentState('reports', SEED_REPORTS)
  const [cart, setCart] = usePersistentState('cart', [])
  const [orders, setOrders] = usePersistentState('orders', [])
  const [toasts, setToasts] = useState([])
  const toastTimers = useRef({})

  // ---------- Toasts ----------
  const dismissToast = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id))
    clearTimeout(toastTimers.current[id])
    delete toastTimers.current[id]
  }, [])

  const showToast = useCallback(
    (message, type = 'success') => {
      const id = uid('toast')
      setToasts((t) => [...t.slice(-2), { id, message, type }])
      toastTimers.current[id] = setTimeout(() => dismissToast(id), 3500)
    },
    [dismissToast],
  )

  // ---------- Profile ----------
  const updateProfile = useCallback((data) => setProfile((p) => ({ ...p, ...data })), [setProfile])

  // ---------- Reports ----------
  const addReport = useCallback(
    (report) => {
      const full = { id: uid('rep'), date: new Date().toISOString(), ...report }
      setReports((list) => {
        let next = [full, ...list].slice(0, MAX_REPORTS)
        // If storage is full, drop image thumbnails from older reports first
        if (!saveState('reports', next)) {
          next = next.map((r, i) => (i === 0 ? r : { ...r, thumbnail: null }))
        }
        return next
      })
      return full
    },
    [setReports],
  )

  const deleteReport = useCallback((id) => setReports((list) => list.filter((r) => r.id !== id)), [setReports])
  const clearReports = useCallback(() => setReports([]), [setReports])

  // ---------- Cart ----------
  const addToCart = useCallback(
    (productId, qty = 1) => {
      setCart((items) => {
        const existing = items.find((i) => i.id === productId)
        if (existing) return items.map((i) => (i.id === productId ? { ...i, qty: Math.min(i.qty + qty, 99) } : i))
        return [...items, { id: productId, qty }]
      })
    },
    [setCart],
  )

  const updateCartQty = useCallback(
    (productId, qty) => {
      setCart((items) =>
        qty <= 0 ? items.filter((i) => i.id !== productId) : items.map((i) => (i.id === productId ? { ...i, qty: Math.min(qty, 99) } : i)),
      )
    },
    [setCart],
  )

  const clearCart = useCallback(() => setCart([]), [setCart])

  const cartItems = useMemo(
    () =>
      cart
        .map((i) => ({ ...i, product: getProductById(i.id) }))
        .filter((i) => i.product),
    [cart],
  )
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0)
  const cartTotal = cartItems.reduce((s, i) => s + i.qty * i.product.price, 0)

  const placeOrder = useCallback(
    (details) => {
      const order = {
        id: `ORD${Date.now().toString().slice(-8)}`,
        date: new Date().toISOString(),
        items: cartItems.map((i) => ({ id: i.id, name: i.product.name, qty: i.qty, price: i.product.price })),
        total: cartTotal,
        status: 'Placed (demo)',
        ...details,
      }
      setOrders((o) => [order, ...o])
      setCart([])
      return order
    },
    [cartItems, cartTotal, setOrders, setCart],
  )

  const resetDemoData = useCallback(() => {
    clearAllState()
    setProfile(DEFAULT_PROFILE)
    setReports(SEED_REPORTS)
    setCart([])
    setOrders([])
  }, [setProfile, setReports, setCart, setOrders])

  const value = {
    profile,
    updateProfile,
    reports,
    addReport,
    deleteReport,
    clearReports,
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    updateCartQty,
    clearCart,
    orders,
    placeOrder,
    resetDemoData,
    toasts,
    showToast,
    dismissToast,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}
