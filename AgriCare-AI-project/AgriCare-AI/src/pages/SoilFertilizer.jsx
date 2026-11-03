import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Calculator, FileText, FlaskConical, Info, RotateCcw, Save, TestTube } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import FertilizerResult from '../components/FertilizerResult.jsx'
import { useApp } from '../context/AppContext.jsx'
import { useT } from '../i18n/LanguageContext.jsx'
import { FERTILIZER_CROPS } from '../data/crops'
import { calculateFertilizer, validateSoilInputs } from '../services/fertilizerService'

const EMPTY = { crop: '', area: '', unit: 'acre', n: '', p: '', k: '', ph: '' }
const SAMPLE = { crop: 'Wheat', area: '2.5', unit: 'acre', n: '240', p: '14', k: '180', ph: '7.8' }

const FIELDS = [
  { key: 'n', label: 'Nitrogen (N)', hint: 'Available N, kg/ha', step: '1' },
  { key: 'p', label: 'Phosphorus (P)', hint: 'Available P, kg/ha', step: '0.1' },
  { key: 'k', label: 'Potassium (K)', hint: 'Available K, kg/ha', step: '1' },
  { key: 'ph', label: 'Soil pH', hint: '0–14 scale (3–11 accepted)', step: '0.1' },
]

export default function SoilFertilizer() {
  const { addReport, showToast } = useApp()
  const { t } = useT()
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [result, setResult] = useState(null)
  const [savedId, setSavedId] = useState(null)

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }))
  }

  const submit = (e) => {
    e.preventDefault()
    const errs = validateSoilInputs(form)
    setErrors(errs)
    if (Object.keys(errs).length) {
      setResult(null)
      return
    }
    setResult(calculateFertilizer(form))
    setSavedId(null)
    setTimeout(() => document.getElementById('fert-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  const save = () => {
    const report = addReport({
      type: 'soil',
      crop: result.crop,
      title: `${result.crop} – Fertilizer plan (${result.area} ${result.unit})`,
      inputs: { crop: form.crop, area: Number(form.area), unit: form.unit, n: +form.n, p: +form.p, k: +form.k, ph: +form.ph },
    })
    setSavedId(report.id)
    showToast('Fertilizer plan saved to My Reports')
  }

  const reset = () => {
    setForm(EMPTY)
    setErrors({})
    setResult(null)
    setSavedId(null)
  }

  return (
    <>
      <PageHeader
        icon={FlaskConical}
        title={t('nav.soil')}
        subtitle={t('soil.subtitle')}
      />

      <div className="container-page py-8">
        <form onSubmit={submit} noValidate className="card p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-slate-900">Field &amp; soil details</h2>
            <button type="button" onClick={() => { setForm(SAMPLE); setErrors({}) }} className="btn-ghost text-green-700">
              <TestTube className="h-4 w-4" /> Fill sample soil test
            </button>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <div>
              <label htmlFor="crop" className="label">
                Crop
              </label>
              <select id="crop" className={`input ${errors.crop ? 'input-error' : ''}`} value={form.crop} onChange={set('crop')}>
                <option value="">Select crop</option>
                {FERTILIZER_CROPS.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.crop && <p className="mt-1 text-xs text-red-600">{errors.crop}</p>}
            </div>
            <div className="md:col-span-2">
              <label htmlFor="area" className="label">
                Field area
              </label>
              <div className="flex gap-2">
                <input
                  id="area"
                  type="number"
                  min="0"
                  step="0.01"
                  inputMode="decimal"
                  placeholder="e.g. 2.5"
                  className={`input ${errors.area ? 'input-error' : ''}`}
                  value={form.area}
                  onChange={set('area')}
                />
                <div className="flex shrink-0 rounded-xl bg-slate-100 p-1">
                  {['acre', 'hectare'].map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, unit: u }))}
                      className={`rounded-lg px-3 text-sm font-medium capitalize ${
                        form.unit === u ? 'bg-white text-green-700 shadow-sm' : 'text-slate-600'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
              {errors.area && <p className="mt-1 text-xs text-red-600">{errors.area}</p>}
            </div>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FIELDS.map((f) => (
              <div key={f.key}>
                <label htmlFor={f.key} className="label">
                  {f.label}
                </label>
                <input
                  id={f.key}
                  type="number"
                  min="0"
                  step={f.step}
                  inputMode="decimal"
                  className={`input ${errors[f.key] ? 'input-error' : ''}`}
                  value={form[f.key]}
                  onChange={set(f.key)}
                  placeholder={f.hint}
                />
                {errors[f.key] ? (
                  <p className="mt-1 text-xs text-red-600">{errors[f.key]}</p>
                ) : (
                  <p className="mt-1 text-xs text-slate-500">{f.hint}</p>
                )}
              </div>
            ))}
          </div>

          <p className="mt-5 flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            Soil ratings – N: Low &lt; 280, Medium 280–560, High &gt; 560 · P: Low &lt; 10, Medium 10–25, High &gt; 25 · K: Low
            &lt; 108, Medium 108–280, High &gt; 280 (kg/ha).
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="submit" className="btn-primary">
              <Calculator className="h-4 w-4" /> Get recommendation
            </button>
            <button type="button" onClick={reset} className="btn-secondary">
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
          </div>
        </form>

        {result && (
          <section id="fert-result" className="card mt-6 scroll-mt-20 animate-fade-in p-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-green-700">Recommendation</p>
                <h2 className="text-xl font-extrabold text-slate-900">{result.crop} fertilizer plan</h2>
              </div>
              {savedId ? (
                <Link to={`/reports?view=${savedId}`} className="btn-secondary">
                  <FileText className="h-4 w-4" /> View saved report
                </Link>
              ) : (
                <button onClick={save} className="btn-primary">
                  <Save className="h-4 w-4" /> Save to reports
                </button>
              )}
            </div>
            <FertilizerResult result={result} />
            <p className="mt-6 text-xs text-slate-500">
              Recommendations are general guidelines. Follow your Soil Health Card and local agriculture department advice
              for your region and variety.
            </p>
          </section>
        )}
      </div>
    </>
  )
}
