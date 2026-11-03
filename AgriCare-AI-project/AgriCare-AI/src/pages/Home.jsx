import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  FileText,
  FlaskConical,
  ImageUp,
  ScanLine,
  ShoppingBag,
  SlidersHorizontal,
  Smartphone,
} from 'lucide-react'
import { useT } from '../i18n/LanguageContext.jsx'

const FEATURES = [
  {
    to: '/disease-detection',
    icon: ScanLine,
    title: 'Disease Detection',
    text: 'Upload or capture a leaf photo and get an instant diagnosis with symptoms, management and prevention.',
    color: 'bg-green-100 text-green-700',
  },
  {
    to: '/soil-fertilizer',
    icon: FlaskConical,
    title: 'Soil & Fertilizer',
    text: 'Enter crop, area and soil N, P, K, pH values to get a fertilizer plan with quantity, bags and cost.',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    to: '/store',
    icon: ShoppingBag,
    title: 'Agri Store',
    text: 'Browse seeds, fertilizers, crop protection, organic inputs, tools and irrigation products.',
    color: 'bg-orange-100 text-orange-700',
  },
  {
    to: '/reports',
    icon: FileText,
    title: 'My Reports',
    text: 'Every diagnosis and fertilizer plan is saved to your history so you can review or download it later.',
    color: 'bg-purple-100 text-purple-700',
  },
]

const WORKFLOW = [
  { icon: ImageUp, title: 'Plant Image', text: 'Farmer captures or uploads a leaf photo' },
  { icon: SlidersHorizontal, title: 'Preprocessing', text: 'Image resized to 224×224 and normalised' },
  { icon: Brain, title: 'CNN / Deep Learning', text: 'Model classifies crop and disease' },
  { icon: CheckCircle2, title: 'Disease Result', text: 'Diagnosis with confidence and advice' },
]

const STATS = [
  { value: '54,306', label: 'Leaf images in PlantVillage' },
  { value: '14', label: 'Crop species' },
  { value: '38', label: 'Crop–disease classes' },
  { value: '99.35%', label: 'Accuracy reported (lab images)' },
]

export default function Home() {
  const { t } = useT()
  const [before, after] = t('home.title').split('AI')
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-700 via-green-600 to-emerald-700 text-white">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-lime-300/20 blur-3xl" />
        <div className="container-page relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div className="animate-fade-in">
            <span className="badge bg-white/15 px-3 py-1 text-sm text-white ring-1 ring-white/25">
              <Smartphone className="h-4 w-4" /> {t('home.badge')}
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              {before}
              <span className="text-lime-300">AI</span>
              {after}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-green-50">
              {t('home.subtitle')}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/disease-detection" className="btn bg-white px-5 py-3 text-green-700 hover:bg-green-50">
                <ScanLine className="h-5 w-5" /> {t('home.ctaDetect')}
              </Link>
              <Link to="/dashboard" className="btn border border-white/40 px-5 py-3 text-white hover:bg-white/10">
                {t('home.ctaDashboard')} <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Preview card */}
          <div className="animate-fade-in lg:justify-self-end" style={{ animationDelay: '120ms' }}>
            <div className="w-full max-w-md rounded-3xl bg-white p-5 text-slate-800 shadow-2xl">
              <div className="relative h-48 overflow-hidden rounded-2xl bg-gradient-to-br from-green-200 via-lime-200 to-green-400">
                <LeafIllustration />
                <div className="absolute inset-x-0 h-0.5 animate-scan bg-lime-500 shadow-[0_0_12px_2px_rgba(132,204,22,0.8)]" />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">Tomato · Detected</p>
                  <p className="text-lg font-bold">Early Blight</p>
                </div>
                <span className="badge bg-amber-100 text-amber-700">Moderate</span>
              </div>
              <div className="mt-3">
                <div className="mb-1 flex justify-between text-xs text-slate-500">
                  <span>Confidence</span>
                  <span className="font-semibold text-slate-700">91.4%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div className="h-2 w-[91%] rounded-full bg-green-500" />
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-600">
                Remove infected lower leaves and spray a recommended fungicide at 7–10 day intervals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container-page py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Everything a farmer needs</h2>
          <p className="mt-3 text-slate-600">Four modules designed to be simple, fast and mobile-friendly.</p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ to, icon: Icon, title, text, color }) => (
            <Link key={to} to={to} className="card group p-6 transition hover:-translate-y-1 hover:shadow-md">
              <span className={`grid h-12 w-12 place-items-center rounded-xl ${color}`}>
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-green-700">
                Open <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Workflow */}
      <section className="bg-white py-16">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">How disease detection works</h2>
            <p className="mt-3 text-slate-600">A simplified image-based detection workflow inspired by the base paper.</p>
          </div>
          <ol className="mt-10 grid gap-4 md:grid-cols-4">
            {WORKFLOW.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="relative">
                <div className="h-full rounded-2xl border-2 border-green-200 bg-green-50/60 p-5 text-center">
                  <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-green-600 text-white">
                    <Icon className="h-6 w-6" />
                  </span>
                  <p className="mt-3 text-xs font-bold uppercase tracking-wider text-green-700">Step {i + 1}</p>
                  <h3 className="mt-1 font-bold text-slate-900">{title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{text}</p>
                </div>
                {i < WORKFLOW.length - 1 && (
                  <ArrowRight className="absolute -right-4 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 text-green-600 md:block" />
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Base paper */}
      <section className="container-page py-16">
        <div className="card overflow-hidden lg:grid lg:grid-cols-5">
          <div className="bg-slate-900 p-8 text-white lg:col-span-2">
            <BookOpen className="h-8 w-8 text-lime-300" />
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-lime-300">Research foundation</p>
            <h2 className="mt-2 text-2xl font-bold">Using Deep Learning for Image-Based Plant Disease Detection</h2>
            <p className="mt-2 text-sm text-slate-400">Mohanty, Hughes &amp; Salathé · Frontiers in Plant Science, 2016</p>
            <Link to="/about" className="btn mt-6 bg-lime-400 text-slate-900 hover:bg-lime-300">
              Read project details <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="p-8 lg:col-span-3">
            <div className="grid grid-cols-2 gap-4">
              {STATS.map((s) => (
                <div key={s.label} className="rounded-xl bg-green-50 p-4">
                  <p className="text-2xl font-extrabold text-green-700 sm:text-3xl">{s.value}</p>
                  <p className="mt-1 text-sm text-slate-600">{s.label}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm leading-relaxed text-slate-600">
              <b className="text-slate-800">Lesson for AgriCare AI:</b> accuracy dropped on real-field images, so our future
              model will be evaluated on diverse field photos – not only controlled lab images.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page">
        <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-10 text-white md:flex-row">
          <div>
            <h2 className="text-2xl font-bold">Have a sick plant?</h2>
            <p className="mt-1 text-green-50">Take a clear photo of one leaf and get a diagnosis in seconds.</p>
          </div>
          <Link to="/disease-detection" className="btn bg-white px-6 py-3 text-green-700 hover:bg-green-50">
            <ScanLine className="h-5 w-5" /> Start diagnosis
          </Link>
        </div>
      </section>
    </>
  )
}

function LeafIllustration() {
  return (
    <svg viewBox="0 0 200 120" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <path d="M30 100 C 40 30, 140 10, 175 25 C 170 70, 110 110, 30 100 Z" fill="#16a34a" />
      <path d="M30 100 C 80 75, 130 45, 175 25" stroke="#bbf7d0" strokeWidth="2.5" fill="none" />
      {[
        [70, 70, 7],
        [105, 52, 9],
        [130, 66, 6],
        [92, 82, 5],
        [145, 42, 5],
      ].map(([cx, cy, r]) => (
        <g key={`${cx}-${cy}`}>
          <circle cx={cx} cy={cy} r={r + 3} fill="#facc15" opacity="0.6" />
          <circle cx={cx} cy={cy} r={r} fill="#78350f" />
          <circle cx={cx} cy={cy} r={r / 2} fill="none" stroke="#a16207" strokeWidth="1" />
        </g>
      ))}
    </svg>
  )
}
