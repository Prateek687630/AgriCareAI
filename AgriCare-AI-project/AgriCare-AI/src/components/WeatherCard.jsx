import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Droplets,
  Loader2,
  MapPin,
  RefreshCw,
  ShieldAlert,
  Sun,
  Wind,
} from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { useT } from '../i18n/LanguageContext.jsx'
import { cropAdvisory, describeWeather, getWeather } from '../services/weatherService'

const ICONS = {
  sun: Sun,
  'cloud-sun': CloudSun,
  cloud: Cloud,
  fog: CloudFog,
  drizzle: CloudDrizzle,
  rain: CloudRain,
  snow: CloudSnow,
  storm: CloudLightning,
}

const RISK_CLS = {
  High: 'bg-red-100 text-red-700',
  Moderate: 'bg-amber-100 text-amber-700',
  Low: 'bg-green-100 text-green-700',
}

export default function WeatherCard() {
  const { profile } = useApp()
  const { t } = useT()
  const [state, setState] = useState({ status: 'loading' })

  const load = useCallback(() => {
    setState({ status: 'loading' })
    getWeather([profile.district, profile.village, profile.state])
      .then((data) => setState({ status: 'ok', data }))
      .catch((e) =>
        setState({ status: 'error', message: navigator.onLine ? e.message : 'You are offline. Weather needs internet.' }),
      )
  }, [profile.district, profile.village, profile.state])

  useEffect(load, [load])

  return (
    <section className="card overflow-hidden" aria-label="Weather">
      <div className="flex items-center justify-between bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-3 text-white">
        <h2 className="font-bold">{t('weather.title')}</h2>
        <button onClick={load} className="rounded-lg p-1.5 hover:bg-white/15" aria-label="Refresh weather">
          <RefreshCw className={`h-4 w-4 ${state.status === 'loading' ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {state.status === 'loading' && (
        <div className="flex items-center justify-center gap-2 p-8 text-sm text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading weather…
        </div>
      )}

      {state.status === 'error' && (
        <div className="p-5 text-sm text-slate-600">
          <p>{state.message}</p>
          <Link to="/profile" className="mt-2 inline-block font-semibold text-green-700 hover:underline">
            Check location in Profile
          </Link>
        </div>
      )}

      {state.status === 'ok' && <WeatherBody data={state.data} />}
    </section>
  )
}

function WeatherBody({ data }) {
  const { current, daily } = data
  const now = describeWeather(current.code)
  const NowIcon = ICONS[now.icon]
  const { risk, advice } = cropAdvisory(data)

  return (
    <div className="p-5">
      <p className="flex items-center gap-1 text-xs text-slate-500">
        <MapPin className="h-3.5 w-3.5" /> {data.place}
      </p>
      <div className="mt-2 flex items-center gap-4">
        <NowIcon className="h-12 w-12 text-sky-500" />
        <div>
          <p className="text-3xl font-extrabold text-slate-900">{Math.round(current.temp)}°C</p>
          <p className="text-sm text-slate-600">{now.label}</p>
        </div>
        <div className="ml-auto space-y-1 text-right text-xs text-slate-600">
          <p className="flex items-center justify-end gap-1">
            <Droplets className="h-3.5 w-3.5 text-sky-500" /> {current.humidity}% humidity
          </p>
          <p className="flex items-center justify-end gap-1">
            <Wind className="h-3.5 w-3.5 text-slate-400" /> {Math.round(current.wind)} km/h
          </p>
        </div>
      </div>

      <ul className="mt-4 grid grid-cols-5 gap-1 text-center">
        {daily.map((d, i) => {
          const Icon = ICONS[describeWeather(d.code).icon]
          return (
            <li key={d.date} className="rounded-lg bg-slate-50 px-1 py-2">
              <p className="text-[11px] font-semibold text-slate-500">
                {i === 0 ? 'Today' : new Date(d.date).toLocaleDateString('en-IN', { weekday: 'short' })}
              </p>
              <Icon className="mx-auto my-1 h-5 w-5 text-sky-500" />
              <p className="text-xs font-semibold text-slate-800">
                {Math.round(d.max)}°<span className="font-normal text-slate-400">/{Math.round(d.min)}°</span>
              </p>
              <p className="text-[10px] text-sky-600">{d.rainChance ?? 0}%</p>
            </li>
          )
        })}
      </ul>

      <div className="mt-4 rounded-xl border border-slate-200 p-3">
        <p className="flex items-center gap-2 text-sm font-bold text-slate-900">
          <ShieldAlert className="h-4 w-4 text-green-600" /> Disease risk
          <span className={`badge ${RISK_CLS[risk]}`}>{risk}</span>
        </p>
        <ul className="mt-2 space-y-1.5">
          {advice.map((a) => (
            <li key={a} className="flex gap-2 text-xs leading-relaxed text-slate-600">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
              {a}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
