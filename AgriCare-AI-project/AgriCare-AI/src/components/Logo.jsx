import { Leaf } from 'lucide-react'

export default function Logo({ light = false }) {
  return (
    <span className="flex items-center gap-2">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-700 text-white shadow-sm">
        <Leaf className="h-5 w-5" />
      </span>
      <span className={`text-lg font-extrabold tracking-tight ${light ? 'text-white' : 'text-slate-900'}`}>
        AgriCare <span className="text-green-600">AI</span>
      </span>
    </span>
  )
}
