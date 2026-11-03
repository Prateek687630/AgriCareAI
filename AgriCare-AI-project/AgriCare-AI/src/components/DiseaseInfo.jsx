import { useState } from 'react'
import { ListChecks, ShieldCheck, Stethoscope } from 'lucide-react'

const TABS = [
  { key: 'symptoms', label: 'Symptoms', icon: Stethoscope },
  { key: 'management', label: 'Management', icon: ListChecks },
  { key: 'prevention', label: 'Prevention', icon: ShieldCheck },
]

export function SeverityBadge({ severity }) {
  const cls =
    {
      High: 'bg-red-100 text-red-700',
      Moderate: 'bg-amber-100 text-amber-700',
      Low: 'bg-yellow-100 text-yellow-700',
      None: 'bg-green-100 text-green-700',
    }[severity] ?? 'bg-slate-100 text-slate-700'
  return <span className={`badge ${cls}`}>{severity === 'None' ? 'No risk' : `${severity} severity`}</span>
}

// Symptoms / management / prevention tabs. printAll renders every section (used in reports).
export default function DiseaseInfo({ disease, printAll = false }) {
  const [tab, setTab] = useState('symptoms')

  if (printAll) {
    return (
      <div className="space-y-5">
        {TABS.map(({ key, label, icon: Icon }) => (
          <section key={key}>
            <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-900">
              <Icon className="h-4 w-4 text-green-600" />
              {label}
            </h4>
            <InfoList items={disease[key]} />
          </section>
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="flex gap-1 rounded-xl bg-slate-100 p-1" role="tablist">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold transition sm:text-sm ${
              tab === key ? 'bg-white text-green-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Icon className="hidden h-4 w-4 sm:block" />
            {label}
          </button>
        ))}
      </div>
      <div className="mt-4 animate-fade-in" key={tab}>
        <InfoList items={disease[tab]} />
      </div>
    </div>
  )
}

function InfoList({ items }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-slate-700">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
          {item}
        </li>
      ))}
    </ul>
  )
}
