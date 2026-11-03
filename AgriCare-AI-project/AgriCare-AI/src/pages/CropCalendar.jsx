import { useState } from 'react'
import { CalendarDays, Sprout, Wheat } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import { useT } from '../i18n/LanguageContext.jsx'
import { CALENDAR, MONTHS, SEASONS, monthStatus } from '../data/calendar'

const CELL = {
  sow: 'bg-green-500',
  grow: 'bg-green-200',
  harvest: 'bg-amber-400',
}

const SEASON_CLS = {
  Kharif: 'bg-sky-100 text-sky-700',
  Rabi: 'bg-orange-100 text-orange-700',
  Zaid: 'bg-yellow-100 text-yellow-700',
  Annual: 'bg-violet-100 text-violet-700',
}

export default function CropCalendar() {
  const { t } = useT()
  const [season, setSeason] = useState('All')
  const month = new Date().getMonth()
  const rows = CALENDAR.filter((c) => season === 'All' || c.season === season)
  const sowNow = CALENDAR.filter((c) => c.sow.includes(month))
  const harvestNow = CALENDAR.filter((c) => c.harvest.includes(month))

  return (
    <>
      <PageHeader icon={CalendarDays} title={t('nav.calendar')} subtitle={t('calendar.subtitle')} />

      <div className="container-page space-y-6 py-8">
        <div className="grid gap-4 md:grid-cols-2">
          <NowCard
            icon={Sprout}
            title={`Sow in ${MONTHS[month]}`}
            items={sowNow}
            empty="No major crop sowing this month."
            cls="border-green-200 bg-green-50 text-green-800"
            detail={(c) => c.note}
          />
          <NowCard
            icon={Wheat}
            title={`Harvest in ${MONTHS[month]}`}
            items={harvestNow}
            empty="No major harvest this month."
            cls="border-amber-200 bg-amber-50 text-amber-800"
            detail={(c) => `Harvest window: ${c.harvest.map((m) => MONTHS[m]).join(' – ')} · crop duration ${c.duration}`}
          />
        </div>

        <section className="card p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2 overflow-x-auto">
              {['All', ...Object.keys(SEASONS)].map((s) => (
                <button
                  key={s}
                  onClick={() => setSeason(s)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${
                    season === s ? 'bg-green-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="flex gap-4 text-xs text-slate-600">
              <Legend cls="bg-green-500" label="Sowing" />
              <Legend cls="bg-green-200" label="Growing" />
              <Legend cls="bg-amber-400" label="Harvest" />
            </div>
          </div>

          {season !== 'All' && <p className="mt-3 text-sm text-slate-600">{SEASONS[season]}</p>}

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[760px] border-separate border-spacing-y-1 text-sm">
              <thead>
                <tr className="text-xs text-slate-500">
                  <th className="w-44 px-2 py-2 text-left font-semibold">Crop</th>
                  {MONTHS.map((m, i) => (
                    <th key={m} className={`px-0.5 py-2 font-semibold ${i === month ? 'text-green-700' : ''}`}>
                      {m}
                      {i === month && <span className="mx-auto mt-0.5 block h-1 w-1 rounded-full bg-green-600" />}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.crop} className="group">
                    <td className="rounded-l-lg px-2 py-2 group-hover:bg-slate-50">
                      <p className="font-semibold text-slate-800">{c.crop}</p>
                      <span className={`badge mt-0.5 ${SEASON_CLS[c.season]}`}>{c.season}</span>
                      <span className="ml-1 text-[11px] text-slate-500">{c.duration}</span>
                    </td>
                    {MONTHS.map((m, i) => {
                      const st = monthStatus(c, i)
                      return (
                        <td key={m} className={`px-0.5 group-hover:bg-slate-50 ${i === month ? 'bg-green-50/60' : ''}`}>
                          <div
                            className={`h-6 rounded ${st ? CELL[st] : 'bg-slate-100'}`}
                            title={st ? `${c.crop}: ${st} in ${m}` : ''}
                          />
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            General windows for central and north India. Exact dates depend on your region, variety and monsoon arrival – check
            with your local KVK.
          </p>
        </section>
      </div>
    </>
  )
}

function NowCard({ icon: Icon, title, items, empty, cls, detail }) {
  return (
    <section className={`rounded-2xl border p-5 ${cls}`}>
      <h2 className="flex items-center gap-2 font-bold">
        <Icon className="h-5 w-5" /> {title}
      </h2>
      {items.length === 0 ? (
        <p className="mt-2 text-sm opacity-80">{empty}</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.map((c) => (
            <li key={c.crop} className="rounded-xl bg-white/70 p-3 text-sm">
              <p className="font-semibold text-slate-900">{c.crop}</p>
              <p className="text-slate-600">{detail(c)}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function Legend({ cls, label }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-2.5 w-4 rounded-sm ${cls}`} /> {label}
    </span>
  )
}
