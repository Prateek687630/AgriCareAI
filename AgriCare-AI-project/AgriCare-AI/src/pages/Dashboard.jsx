import { Link } from 'react-router-dom'
import {
  Activity,
  ArrowRight,
  BookOpenText,
  Bug,
  CalendarDays,
  ChevronRight,
  FileText,
  FlaskConical,
  Lightbulb,
  LifeBuoy,
  ScanLine,
  ShoppingBag,
  ShoppingCart,
} from 'lucide-react'
import WeatherCard from '../components/WeatherCard.jsx'
import { useApp } from '../context/AppContext.jsx'
import { useT } from '../i18n/LanguageContext.jsx'
import { tipOfTheDay } from '../data/tips'
import { formatDate } from '../utils/format'

const MODULES = [
  { to: '/disease-detection', icon: ScanLine, title: 'nav.detect', text: 'dash.modDetect', cls: 'from-green-500 to-emerald-600' },
  { to: '/soil-fertilizer', icon: FlaskConical, title: 'nav.soil', text: 'dash.modSoil', cls: 'from-sky-500 to-blue-600' },
  { to: '/store', icon: ShoppingBag, title: 'nav.store', text: 'dash.modStore', cls: 'from-orange-400 to-orange-600' },
  { to: '/reports', icon: FileText, title: 'nav.reports', text: 'dash.modReports', cls: 'from-violet-500 to-purple-600' },
]

const TOOLS = [
  { to: '/disease-library', icon: BookOpenText, key: 'nav.library', cls: 'bg-emerald-100 text-emerald-700' },
  { to: '/crop-calendar', icon: CalendarDays, key: 'nav.calendar', cls: 'bg-amber-100 text-amber-700' },
  { to: '/help', icon: LifeBuoy, key: 'nav.help', cls: 'bg-rose-100 text-rose-700' },
]

const greetingKey = () => {
  const h = new Date().getHours()
  return h < 12 ? 'dash.morning' : h < 17 ? 'dash.afternoon' : 'dash.evening'
}

export default function Dashboard() {
  const { profile, reports, cartCount } = useApp()
  const { t, lang } = useT()
  const diseaseReports = reports.filter((r) => r.type === 'disease')
  const diseasedCount = diseaseReports.filter((r) => !r.healthy).length
  const soilCount = reports.filter((r) => r.type === 'soil').length

  const stats = [
    { label: 'dash.statDiagnoses', value: diseaseReports.length, icon: Activity, cls: 'bg-green-100 text-green-700' },
    { label: 'dash.statDiseases', value: diseasedCount, icon: Bug, cls: 'bg-red-100 text-red-700' },
    { label: 'dash.statPlans', value: soilCount, icon: FlaskConical, cls: 'bg-blue-100 text-blue-700' },
    { label: 'dash.statCart', value: cartCount, icon: ShoppingCart, cls: 'bg-orange-100 text-orange-700' },
  ]

  return (
    <div className="container-page py-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-slate-500">
            {new Date().toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
            {t(greetingKey())}, {profile.name.split(' ')[0] || 'Farmer'} 👋
          </h1>
          <p className="mt-1 text-slate-600">
            {[profile.village, profile.district].filter(Boolean).join(', ')} · {profile.landSize} {profile.landUnit} ·{' '}
            {profile.mainCrops}
          </p>
        </div>
        <Link to="/disease-detection" className="btn-primary self-start sm:self-auto">
          <ScanLine className="h-4 w-4" /> {t('dash.newDiagnosis')}
        </Link>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, cls }) => (
          <div key={label} className="card p-5">
            <span className={`grid h-10 w-10 place-items-center rounded-xl ${cls}`}>
              <Icon className="h-5 w-5" />
            </span>
            <p className="mt-3 text-3xl font-extrabold text-slate-900">{value}</p>
            <p className="text-sm text-slate-500">{t(label)}</p>
          </div>
        ))}
      </div>

      {/* Modules */}
      <h2 className="mt-10 text-lg font-bold text-slate-900">{t('dash.modules')}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MODULES.map(({ to, icon: Icon, title, text, cls }) => (
          <Link
            key={to}
            to={to}
            className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${cls} p-6 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg`}
          >
            <Icon className="absolute -bottom-4 -right-4 h-28 w-28 opacity-15" />
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/20">
              <Icon className="h-6 w-6" />
            </span>
            <h3 className="mt-4 text-lg font-bold">{t(title)}</h3>
            <p className="text-sm text-white/85">{t(text)}</p>
            <ArrowRight className="mt-4 h-5 w-5 transition group-hover:translate-x-1" />
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="min-w-0 space-y-6 lg:col-span-2">
          {/* Recent activity */}
          <section className="card min-w-0 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">{t('dash.recent')}</h2>
              <Link to="/reports" className="text-sm font-semibold text-green-700 hover:underline">
                {t('dash.viewAll')}
              </Link>
            </div>
            {reports.length === 0 ? (
              <div className="py-10 text-center text-sm text-slate-500">
                No reports yet.{' '}
                <Link to="/disease-detection" className="font-semibold text-green-700">
                  Run your first diagnosis
                </Link>
              </div>
            ) : (
              <ul className="mt-4 divide-y divide-slate-100">
                {reports.slice(0, 5).map((r) => (
                  <li key={r.id}>
                    <Link to={`/reports?view=${r.id}`} className="flex items-center gap-4 rounded-lg py-3 hover:bg-slate-50">
                      <ReportIcon report={r} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-slate-900">{r.title}</p>
                        <p className="text-xs text-slate-500">
                          {formatDate(r.date)} · {r.type === 'disease' ? `${r.confidence}% confidence` : 'Fertilizer plan'}
                        </p>
                      </div>
                      {r.type === 'disease' && (
                        <span className={`badge ${r.healthy ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {r.healthy ? t('common.healthy') : t('common.diseased')}
                        </span>
                      )}
                      <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <CropHealthChart reports={diseaseReports} />
        </div>

        <div className="min-w-0 space-y-6">
          <WeatherCard />

          <section className="card bg-amber-50 p-6 ring-1 ring-amber-200">
            <h2 className="flex items-center gap-2 font-bold text-amber-900">
              <Lightbulb className="h-5 w-5" /> {t('dash.tip')}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-amber-900/80">{tipOfTheDay()}</p>
          </section>

          <section className="card p-6">
            <h2 className="font-bold text-slate-900">{t('dash.tools')}</h2>
            <ul className="mt-3 space-y-1">
              {TOOLS.map(({ to, icon: Icon, key, cls }) => (
                <li key={to}>
                  <Link to={to} className="flex items-center gap-3 rounded-xl p-2 hover:bg-slate-50">
                    <span className={`grid h-9 w-9 place-items-center rounded-lg ${cls}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="flex-1 text-sm font-medium text-slate-800">{t(key)}</span>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}

function CropHealthChart({ reports }) {
  const { t } = useT()
  const byCrop = Object.entries(
    reports.reduce((acc, r) => {
      acc[r.crop] ??= { healthy: 0, diseased: 0 }
      acc[r.crop][r.healthy ? 'healthy' : 'diseased']++
      return acc
    }, {}),
  ).sort((a, b) => b[1].healthy + b[1].diseased - (a[1].healthy + a[1].diseased))
  const max = Math.max(1, ...byCrop.map(([, c]) => c.healthy + c.diseased))

  return (
    <section className="card p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-bold text-slate-900">{t('dash.health')}</h2>
        <div className="flex gap-4 text-xs text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-green-500" /> {t('common.healthy')}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-red-500" /> {t('common.diseased')}
          </span>
        </div>
      </div>
      {byCrop.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500">Diagnose plants to see crop health here.</p>
      ) : (
        <ul className="mt-5 space-y-4">
          {byCrop.map(([crop, c]) => (
            <li key={crop}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-medium text-slate-800">{crop}</span>
                <span className="text-slate-500">
                  {c.healthy + c.diseased} scan{c.healthy + c.diseased > 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex h-3 overflow-hidden rounded-full bg-slate-100">
                <div className="bg-green-500" style={{ width: `${(c.healthy / max) * 100}%` }} title={`${c.healthy} healthy`} />
                <div className="bg-red-500" style={{ width: `${(c.diseased / max) * 100}%` }} title={`${c.diseased} diseased`} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export function ReportIcon({ report, size = 'h-12 w-12' }) {
  if (report.thumbnail) {
    return <img src={report.thumbnail} alt="" className={`${size} shrink-0 rounded-xl object-cover`} />
  }
  const isSoil = report.type === 'soil'
  const Icon = isSoil ? FlaskConical : ScanLine
  return (
    <span
      className={`grid ${size} shrink-0 place-items-center rounded-xl ${
        isSoil ? 'bg-blue-100 text-blue-700' : report.healthy ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`}
    >
      <Icon className="h-6 w-6" />
    </span>
  )
}
