import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CheckCircle2, Minus, PackageSearch, Plus, Search, ShoppingBag, ShoppingCart, Trash2, X } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import ProductCard, { ProductThumb } from '../components/ProductCard.jsx'
import Modal from '../components/Modal.jsx'
import { useApp } from '../context/AppContext.jsx'
import { useT } from '../i18n/LanguageContext.jsx'
import { CATEGORIES, PRODUCTS } from '../data/products'
import { formatINR } from '../utils/format'

const SORTS = {
  popular: { label: 'Most popular', fn: (a, b) => b.reviews - a.reviews },
  'price-asc': { label: 'Price: low to high', fn: (a, b) => a.price - b.price },
  'price-desc': { label: 'Price: high to low', fn: (a, b) => b.price - a.price },
  rating: { label: 'Top rated', fn: (a, b) => b.rating - a.rating },
}

export default function AgriStore() {
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('popular')
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [order, setOrder] = useState(null)
  const { cartCount } = useApp()
  const { t } = useT()

  const cartOpen = params.get('cart') === 'open'
  const setCartOpen = (open) => setParams(open ? { cart: 'open' } : {}, { replace: true })

  const products = useMemo(() => {
    const q = query.trim().toLowerCase()
    return PRODUCTS.filter((p) => category === 'All' || p.category === category)
      .filter((p) => !q || `${p.name} ${p.description} ${p.category}`.toLowerCase().includes(q))
      .sort(SORTS[sort].fn)
  }, [query, category, sort])

  return (
    <>
      <PageHeader
        icon={ShoppingBag}
        title={t('nav.store')}
        subtitle={t('store.subtitle')}
      >
        <button onClick={() => setCartOpen(true)} className="btn-primary">
          <ShoppingCart className="h-4 w-4" /> Cart ({cartCount})
        </button>
      </PageHeader>

      <div className="container-page py-8">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              className="input pl-10"
              placeholder="Search products, e.g. fungicide, urea, seeds…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search products"
            />
          </div>
          <select className="input md:w-56" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products">
            {Object.entries(SORTS).map(([k, s]) => (
              <option key={k} value={k}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                category === c ? 'bg-green-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <p className="mt-4 text-sm text-slate-500">{products.length} products</p>

        {products.length === 0 ? (
          <div className="card mt-4 flex flex-col items-center p-12 text-center">
            <PackageSearch className="h-12 w-12 text-slate-300" />
            <p className="mt-3 font-semibold text-slate-700">No products found</p>
            <button
              className="btn-secondary mt-4"
              onClick={() => {
                setQuery('')
                setCategory('All')
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      {cartOpen && (
        <CartDrawer
          onClose={() => setCartOpen(false)}
          onCheckout={() => {
            setCartOpen(false)
            setCheckoutOpen(true)
          }}
        />
      )}

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onPlaced={(o) => {
          setCheckoutOpen(false)
          setOrder(o)
        }}
      />

      <Modal
        open={!!order}
        onClose={() => setOrder(null)}
        title="Order placed"
        size="sm"
        footer={
          <button className="btn-primary" onClick={() => setOrder(null)}>
            Continue shopping
          </button>
        }
      >
        {order && (
          <div className="text-center">
            <CheckCircle2 className="mx-auto h-16 w-16 text-green-600" />
            <p className="mt-3 text-lg font-bold text-slate-900">Thank you, {order.name}!</p>
            <p className="mt-1 text-sm text-slate-600">
              Order <b>{order.id}</b> for {formatINR(order.total)} has been placed ({order.payment}).
            </p>
            <p className="mt-3 rounded-lg bg-amber-50 p-2 text-xs text-amber-800">
              This is a demo order. No payment was taken and nothing will be shipped.
            </p>
          </div>
        )}
      </Modal>
    </>
  )
}

function CartDrawer({ onClose, onCheckout }) {
  const { cartItems, cartTotal, updateCartQty, clearCart } = useApp()

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50" onMouseDown={onClose}>
      <aside
        className="flex h-full w-full max-w-md animate-slide-in flex-col bg-white shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <ShoppingCart className="h-5 w-5 text-green-600" /> Your cart
          </h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100" aria-label="Close cart">
            <X className="h-5 w-5" />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <ShoppingCart className="h-14 w-14 text-slate-300" />
            <p className="mt-3 font-semibold text-slate-700">Your cart is empty</p>
            <button onClick={onClose} className="btn-primary mt-5">
              Browse products
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-slate-100 overflow-y-auto px-5">
              {cartItems.map(({ id, qty, product }) => (
                <li key={id} className="flex gap-3 py-4">
                  <ProductThumb category={product.category} className="h-16 w-16 shrink-0 rounded-xl" />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-semibold text-slate-900">{product.name}</p>
                    <p className="text-xs text-slate-500">{product.unit}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center rounded-lg ring-1 ring-slate-200">
                        <button
                          onClick={() => updateCartQty(id, qty - 1)}
                          className="grid h-8 w-8 place-items-center text-slate-600 hover:bg-slate-50"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                        <button
                          onClick={() => updateCartQty(id, qty + 1)}
                          className="grid h-8 w-8 place-items-center text-slate-600 hover:bg-slate-50"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="font-bold text-slate-900">{formatINR(product.price * qty)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateCartQty(id, 0)}
                    className="self-start rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="space-y-3 border-t border-slate-200 p-5">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Delivery</span>
                <span className="font-medium text-green-700">{cartTotal >= 999 ? 'Free' : formatINR(49)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatINR(cartTotal + (cartTotal >= 999 ? 0 : 49))}</span>
              </div>
              <button onClick={onCheckout} className="btn-primary w-full py-3">
                Proceed to checkout
              </button>
              <button onClick={clearCart} className="btn-ghost w-full text-red-600">
                Clear cart
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}

function CheckoutModal({ open, onClose, onPlaced }) {
  const { profile, cartItems, cartTotal, placeOrder } = useApp()
  const [form, setForm] = useState({})
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (open) {
      setForm({
        name: profile.name,
        phone: profile.phone,
        address: [profile.village, profile.district, profile.state].filter(Boolean).join(', '),
        pincode: '',
        payment: 'Cash on delivery',
      })
      setErrors({})
    }
  }, [open, profile])

  const delivery = cartTotal >= 999 ? 0 : 49
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.name?.trim()) errs.name = 'Name is required'
    if (!/^[6-9]\d{9}$/.test(form.phone ?? '')) errs.phone = 'Enter a valid 10-digit mobile number'
    if (!form.address?.trim()) errs.address = 'Address is required'
    if (!/^\d{6}$/.test(form.pincode ?? '')) errs.pincode = 'Enter a valid 6-digit PIN code'
    setErrors(errs)
    if (Object.keys(errs).length) return
    const order = placeOrder({ ...form, delivery })
    onPlaced({ ...order, total: order.total + delivery })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Checkout"
      footer={
        <>
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" type="submit" form="checkout-form" disabled={!cartItems.length}>
            Place order · {formatINR(cartTotal + delivery)}
          </button>
        </>
      }
    >
      <form id="checkout-form" onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" error={errors.name}>
          <input className={`input ${errors.name ? 'input-error' : ''}`} value={form.name ?? ''} onChange={set('name')} />
        </Field>
        <Field label="Mobile number" error={errors.phone}>
          <input
            className={`input ${errors.phone ? 'input-error' : ''}`}
            inputMode="numeric"
            maxLength={10}
            value={form.phone ?? ''}
            onChange={set('phone')}
          />
        </Field>
        <Field label="Delivery address" error={errors.address} className="sm:col-span-2">
          <textarea
            rows={2}
            className={`input ${errors.address ? 'input-error' : ''}`}
            value={form.address ?? ''}
            onChange={set('address')}
          />
        </Field>
        <Field label="PIN code" error={errors.pincode}>
          <input
            className={`input ${errors.pincode ? 'input-error' : ''}`}
            inputMode="numeric"
            maxLength={6}
            placeholder="e.g. 462003"
            value={form.pincode ?? ''}
            onChange={set('pincode')}
          />
        </Field>
        <Field label="Payment method">
          <select className="input" value={form.payment ?? ''} onChange={set('payment')}>
            <option>Cash on delivery</option>
            <option>UPI (demo)</option>
          </select>
        </Field>
        <div className="rounded-xl bg-slate-50 p-4 text-sm sm:col-span-2">
          <p className="font-semibold text-slate-900">Order summary</p>
          <ul className="mt-2 space-y-1 text-slate-600">
            {cartItems.map((i) => (
              <li key={i.id} className="flex justify-between gap-4">
                <span className="truncate">
                  {i.product.name} × {i.qty}
                </span>
                <span className="shrink-0">{formatINR(i.product.price * i.qty)}</span>
              </li>
            ))}
            <li className="flex justify-between">
              <span>Delivery</span>
              <span>{delivery ? formatINR(delivery) : 'Free'}</span>
            </li>
          </ul>
        </div>
      </form>
    </Modal>
  )
}

function Field({ label, error, className = '', children }) {
  return (
    <label className={`block ${className}`}>
      <span className="label">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  )
}
