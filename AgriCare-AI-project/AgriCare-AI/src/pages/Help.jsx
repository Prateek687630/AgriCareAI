import { useState } from 'react'
import { ChevronDown, ExternalLink, LifeBuoy, MessageSquare, Phone, Send, Sprout } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import { useApp } from '../context/AppContext.jsx'
import { useT } from '../i18n/LanguageContext.jsx'
import { loadState, saveState } from '../utils/storage'

const FAQ = [
  {
    q: 'How accurate is the disease detection?',
    a: 'The app runs a MobileNetV2 CNN trained on the PlantVillage dataset, the same dataset as the base paper. It is about 95% accurate on PlantVillage test photos. Like the base paper, accuracy is lower on field photos with busy backgrounds, and it cannot recognise crops it was not trained on – then it shows an "Uncertain" result. Always confirm with an expert before treatment.',
  },
  {
    q: 'How do I take a good photo for diagnosis?',
    a: 'Photograph one affected leaf in daylight, filling most of the frame, on a plain background. Hold the phone steady. The app warns you if the photo is too dark, overexposed or blurry.',
  },
  {
    q: 'Which crops are supported?',
    a: 'Tomato, Potato, Corn (Maize), Apple, Grape, Bell Pepper, Cherry, Orange, Peach, Strawberry, Squash, Soybean, Blueberry and Raspberry – all 38 disease/healthy classes of the PlantVillage dataset. See the Disease Library for all of them.',
  },
  {
    q: 'How are fertilizer quantities calculated?',
    a: 'Your soil N, P and K values are rated Low, Medium or High. The crop’s recommended dose is increased by 25% for Low and reduced by 25% for High. Phosphorus is supplied by DAP, the remaining nitrogen by Urea and potassium by MOP.',
  },
  {
    q: 'Where is my data stored?',
    a: 'In this prototype, your profile, reports, cart and orders are stored only in your own browser (localStorage). Nothing is uploaded to a server. Clearing browser data or using “Reset demo data” in Profile removes it.',
  },
  {
    q: 'Are Agri Store orders real?',
    a: 'No. The store is a demo – no payment is taken and nothing is shipped. Real ordering is planned for a later report.',
  },
  {
    q: 'Does the app work without internet?',
    a: 'While the app is open, disease detection, fertilizer plans, reports and the store keep working without internet because all processing and data stay on your device. Only the weather card needs internet.',
  },
]

export default function Help() {
  const { t } = useT()
  const { showToast } = useApp()
  const [open, setOpen] = useState(0)
  const [form, setForm] = useState({ topic: 'Suggestion', message: '' })
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (form.message.trim().length < 10) {
      setError('Please write at least 10 characters.')
      return
    }
    const all = loadState('feedback', [])
    saveState('feedback', [{ ...form, date: new Date().toISOString() }, ...all])
    setForm({ topic: 'Suggestion', message: '' })
    setError('')
    showToast('Thank you! Your feedback has been saved.')
  }

  return (
    <>
      <PageHeader icon={LifeBuoy} title={t('nav.help')} subtitle={t('help.subtitle')} />

      <div className="container-page grid gap-6 py-8 lg:grid-cols-3">
        <div className="space-y-6">
          <section className="card overflow-hidden">
            <div className="bg-gradient-to-br from-green-600 to-emerald-700 p-6 text-white">
              <Phone className="h-8 w-8" />
              <p className="mt-3 text-sm text-green-100">Kisan Call Centre (toll-free)</p>
              <a href="tel:18001801551" className="mt-1 block text-2xl font-extrabold tracking-wide hover:underline">
                1800-180-1551
              </a>
              <p className="mt-2 text-sm text-green-100">Free expert advice from agriculture specialists in your language.</p>
            </div>
            <ul className="divide-y divide-slate-100 text-sm">
              <li className="p-4">
                <a
                  href="https://soilhealth.dac.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between font-semibold text-green-700 hover:underline"
                >
                  Soil Health Card portal <ExternalLink className="h-4 w-4" />
                </a>
                <p className="mt-1 text-slate-500">Get your soil test values to use in Soil &amp; Fertilizer.</p>
              </li>
              <li className="flex gap-3 p-4">
                <Sprout className="h-5 w-5 shrink-0 text-green-600" />
                <p className="text-slate-600">
                  For field visits and lab diagnosis, contact your nearest <b>Krishi Vigyan Kendra (KVK)</b> or block agriculture
                  officer.
                </p>
              </li>
            </ul>
          </section>

          <form onSubmit={submit} noValidate className="card p-6">
            <h2 className="flex items-center gap-2 font-bold text-slate-900">
              <MessageSquare className="h-5 w-5 text-green-600" /> Send feedback
            </h2>
            <label className="mt-4 block">
              <span className="label">Topic</span>
              <select className="input" value={form.topic} onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))}>
                <option>Suggestion</option>
                <option>Wrong diagnosis</option>
                <option>Problem / bug</option>
                <option>Other</option>
              </select>
            </label>
            <label className="mt-4 block">
              <span className="label">Message</span>
              <textarea
                rows={4}
                className={`input ${error ? 'input-error' : ''}`}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                placeholder="Tell us what we can improve…"
              />
              {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
            </label>
            <button type="submit" className="btn-primary mt-4 w-full">
              <Send className="h-4 w-4" /> Submit feedback
            </button>
          </form>
        </div>

        <section className="card p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-900">Frequently asked questions</h2>
          <ul className="mt-4 divide-y divide-slate-100">
            {FAQ.map((f, i) => (
              <li key={f.q}>
                <button
                  onClick={() => setOpen(open === i ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left font-semibold text-slate-800 hover:text-green-700"
                  aria-expanded={open === i}
                >
                  {f.q}
                  <ChevronDown className={`h-5 w-5 shrink-0 text-slate-400 transition ${open === i ? 'rotate-180' : ''}`} />
                </button>
                {open === i && <p className="animate-fade-in pb-4 text-sm leading-relaxed text-slate-600">{f.a}</p>}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}
