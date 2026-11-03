import { Droplets, FlaskConical, Leaf, ShieldCheck, ShoppingCart, Sprout, Star, Wrench } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { formatINR } from '../utils/format'

export const CATEGORY_STYLE = {
  Seeds: { icon: Sprout, bg: 'from-lime-100 to-green-200', fg: 'text-green-700' },
  Fertilizers: { icon: FlaskConical, bg: 'from-sky-100 to-blue-200', fg: 'text-blue-700' },
  'Crop Protection': { icon: ShieldCheck, bg: 'from-orange-100 to-amber-200', fg: 'text-orange-700' },
  Organic: { icon: Leaf, bg: 'from-emerald-100 to-teal-200', fg: 'text-emerald-700' },
  Tools: { icon: Wrench, bg: 'from-slate-100 to-slate-200', fg: 'text-slate-700' },
  Irrigation: { icon: Droplets, bg: 'from-cyan-100 to-sky-200', fg: 'text-cyan-700' },
}

export function ProductThumb({ category, className = 'h-36' }) {
  const { icon: Icon, bg, fg } = CATEGORY_STYLE[category] ?? CATEGORY_STYLE.Tools
  return (
    <div className={`grid place-items-center bg-gradient-to-br ${bg} ${className}`}>
      <Icon className={`h-1/3 w-1/3 ${fg}`} strokeWidth={1.5} />
    </div>
  )
}

export default function ProductCard({ product, compact = false }) {
  const { addToCart, showToast } = useApp()
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100)

  const add = () => {
    addToCart(product.id)
    showToast(`${product.name} added to cart`)
  }

  return (
    <article className="card flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative">
        <ProductThumb category={product.category} className={compact ? 'h-24' : 'h-36'} />
        {discount > 0 && (
          <span className="badge absolute left-3 top-3 bg-orange-500 text-white">{discount}% off</span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-green-700">{product.category}</p>
        <h3 className="mt-1 line-clamp-2 font-semibold leading-snug text-slate-900">{product.name}</h3>
        {!compact && <p className="mt-1.5 line-clamp-2 text-sm text-slate-500">{product.description}</p>}
        <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="font-semibold text-slate-700">{product.rating}</span>({product.reviews})<span className="mx-1">·</span>
          {product.unit}
        </div>
        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <div>
            <p className="text-lg font-bold text-slate-900">{formatINR(product.price)}</p>
            {discount > 0 && <p className="text-xs text-slate-400 line-through">{formatINR(product.mrp)}</p>}
          </div>
          <button onClick={add} className="btn-primary px-3 py-2">
            <ShoppingCart className="h-4 w-4" /> Add
          </button>
        </div>
      </div>
    </article>
  )
}
