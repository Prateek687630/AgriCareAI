import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'

const STYLES = {
  success: { icon: CheckCircle2, cls: 'text-green-600' },
  error: { icon: AlertTriangle, cls: 'text-red-600' },
  info: { icon: Info, cls: 'text-blue-600' },
}

export default function Toasts() {
  const { toasts, dismissToast } = useApp()
  return (
    <div className="no-print pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4">
      {toasts.map((t) => {
        const { icon: Icon, cls } = STYLES[t.type] ?? STYLES.info
        return (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex w-full max-w-sm animate-fade-in items-start gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-lg"
          >
            <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${cls}`} />
            <p className="flex-1 text-sm text-slate-700">{t.message}</p>
            <button onClick={() => dismissToast(t.id)} className="text-slate-400 hover:text-slate-600" aria-label="Dismiss">
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
