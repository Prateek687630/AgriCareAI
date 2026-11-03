export default function PageHeader({ icon: Icon, title, subtitle, children }) {
  return (
    <div className="border-b border-slate-200 bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="container-page flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          {Icon && (
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-green-600 text-white shadow-sm">
              <Icon className="h-6 w-6" />
            </span>
          )}
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
            {subtitle && <p className="mt-1 max-w-2xl text-sm text-slate-600 sm:text-base">{subtitle}</p>}
          </div>
        </div>
        {children && <div className="no-print flex flex-wrap gap-2">{children}</div>}
      </div>
    </div>
  )
}
