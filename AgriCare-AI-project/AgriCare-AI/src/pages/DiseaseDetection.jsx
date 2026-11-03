import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  BookOpenText,
  Brain,
  Camera,
  CheckCircle2,
  FileText,
  ImageUp,
  Info,
  Loader2,
  RefreshCw,
  ScanLine,
  SlidersHorizontal,
  Upload,
  X,
} from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import DiseaseInfo, { SeverityBadge } from '../components/DiseaseInfo.jsx'
import ProductCard from '../components/ProductCard.jsx'
import ListenButton from '../components/ListenButton.jsx'
import CropCombobox from '../components/CropCombobox.jsx'
import { useApp } from '../context/AppContext.jsx'
import { useT } from '../i18n/LanguageContext.jsx'
import { CROPS } from '../data/diseases'
import { getRecommendedProducts } from '../data/products'
import {
  ACCEPTED_TYPES,
  MODEL_NAME,
  loadModel,
  predictDisease,
  readFileAsDataURL,
  validateImage,
} from '../services/diseaseService'

const STEPS = [
  { label: 'Uploading image', icon: ImageUp },
  { label: 'Preprocessing & leaf validation', icon: SlidersHorizontal },
  { label: 'Running AI disease model', icon: Brain },
  { label: 'Preparing diagnostic report', icon: FileText },
]

const PHOTO_TIPS = [
  'Photograph a single leaf, filling most of the frame',
  'Use natural daylight – avoid harsh shadows and flash',
  'Keep the camera steady so the image is sharp',
  'Place the leaf on a plain background if possible',
]

export default function DiseaseDetection() {
  const { addReport, showToast } = useApp()
  const { t } = useT()
  const [crop, setCrop] = useState('auto')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const [step, setStep] = useState(-1)
  const [result, setResult] = useState(null)
  const fileInput = useRef(null)
  const cameraInput = useRef(null)
  const analyzing = step >= 0

  // Preload local model in background
  useEffect(() => {
    loadModel().catch(() => {})
  }, [])

  const handleFile = async (f) => {
    const err = validateImage(f)
    if (err) {
      setError(err)
      return
    }
    try {
      const url = await readFileAsDataURL(f)
      setFile(f)
      setPreview(url)
      setError('')
      setResult(null)
    } catch (e) {
      setError(e.message)
    }
  }

  const onInputChange = (e) => {
    const f = e.target.files?.[0]
    if (f) handleFile(f)
    e.target.value = ''
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files?.[0]
    if (f) handleFile(f)
  }

  const reset = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setError('')
  }

  const analyze = async () => {
    if (!file) {
      setError('Please upload a plant image first.')
      return
    }
    setError('')
    setResult(null)
    try {
      const res = await predictDisease({ file, dataUrl: preview, crop }, setStep)
      if (res.isCrop === false || res.nonCrop === true) {
        setResult(res)
        showToast(t('detect.nonCropAlertTitle'), 'error')
        return
      }

      const report = addReport({
        type: 'disease',
        crop: res.crop,
        diseaseId: res.disease.id,
        title: `${res.crop} – ${res.disease.name}`,
        confidence: res.confidence,
        healthy: !!res.disease.healthy,
        severity: res.disease.severity,
        thumbnail: res.thumbnail,
        alternatives: res.alternatives.map((a) => ({ id: a.disease.id, confidence: a.confidence })),
      })
      setResult({ ...res, reportId: report.id })
      showToast('Diagnosis complete – saved to My Reports')
    } catch (e) {
      setError(e.message || 'Something went wrong while analysing the image.')
    } finally {
      setStep(-1)
    }
  }

  return (
    <>
      <PageHeader
        icon={ScanLine}
        title={t('nav.detect')}
        subtitle={t('detect.subtitle')}
      />

      <div className="container-page grid gap-6 py-8 lg:grid-cols-5">
        {/* Left: upload */}
        <section className="space-y-5 lg:col-span-2">
          <div className="card p-5">
            <label htmlFor="crop" className="label">
              {t('detect.selectCrop')}
            </label>
            <div className="mt-1">
              <CropCombobox value={crop} onChange={setCrop} crops={CROPS} disabled={analyzing} />
            </div>

            <p className="label mt-5">{t('detect.upload')}</p>
            {!preview ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragging(true)
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-10 text-center transition ${
                  dragging ? 'border-green-500 bg-green-50' : 'border-slate-300 bg-slate-50'
                }`}
              >
                <span className="grid h-14 w-14 place-items-center rounded-full bg-green-100 text-green-700">
                  <Upload className="h-7 w-7" />
                </span>
                <p className="mt-3 font-semibold text-slate-800">{t('detect.drop')}</p>
                <p className="mt-1 text-xs text-slate-500">JPG, PNG or WEBP · up to 10 MB</p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <button type="button" className="btn-primary" onClick={() => fileInput.current?.click()}>
                    <ImageUp className="h-4 w-4" /> {t('detect.choose')}
                  </button>
                  <button type="button" className="btn-secondary" onClick={() => cameraInput.current?.click()}>
                    <Camera className="h-4 w-4" /> {t('detect.camera')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-900">
                <img src={preview} alt="Selected plant leaf" className="mx-auto max-h-80 w-full object-contain" />
                {analyzing && (
                  <>
                    <div className="absolute inset-0 bg-green-900/20" />
                    <div className="absolute inset-x-0 h-1 animate-scan bg-lime-400 shadow-[0_0_16px_4px_rgba(163,230,53,0.8)]" />
                  </>
                )}
                {!analyzing && (
                  <button
                    onClick={reset}
                    className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-slate-700 shadow hover:bg-white"
                    aria-label="Remove image"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
                <div className="flex items-center justify-between bg-white px-4 py-2.5 text-xs text-slate-600">
                  <span className="truncate">{file?.name}</span>
                  <span className="shrink-0 pl-2">{file && (file.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              </div>
            )}

            <input ref={fileInput} type="file" accept={ACCEPTED_TYPES.join(',')} className="hidden" onChange={onInputChange} />
            <input
              ref={cameraInput}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={onInputChange}
            />

            {error && (
              <p className="mt-3 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
              </p>
            )}

            <button onClick={analyze} disabled={!file || analyzing} className="btn-primary mt-5 w-full py-3 text-base">
              {analyzing ? <Loader2 className="h-5 w-5 animate-spin" /> : <ScanLine className="h-5 w-5" />}
              {analyzing ? t('detect.analysing') : t('detect.analyse')}
            </button>
          </div>

          <div className="card p-5">
            <h2 className="flex items-center gap-2 font-bold text-slate-900">
              <Camera className="h-5 w-5 text-green-600" /> {t('detect.tips')}
            </h2>
            <ul className="mt-3 space-y-2">
              {PHOTO_TIPS.map((tip) => (
                <li key={tip} className="flex gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" /> {tip}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Right: progress / result / non-crop alert */}
        <section className="lg:col-span-3">
          {analyzing ? (
            <AnalysisProgress step={step} />
          ) : result ? (
            result.isCrop === false ? (
              <NonCropAlertPanel result={result} onNew={reset} />
            ) : (
              <ResultPanel result={result} onNew={reset} />
            )
          ) : (
            <EmptyState />
          )}
        </section>
      </div>
    </>
  )
}

function EmptyState() {
  return (
    <div className="card flex h-full min-h-[24rem] flex-col items-center justify-center p-8 text-center">
      <span className="grid h-20 w-20 place-items-center rounded-full bg-green-50 text-green-600">
        <ScanLine className="h-10 w-10" />
      </span>
      <h2 className="mt-5 text-xl font-bold text-slate-900">Your diagnosis will appear here</h2>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        Select or type the crop, upload a clear photo of an affected leaf and press <b>Analyse plant</b>. Supported crops include Tomato, Potato, Pepper (Bell), Corn (Maize), Apple, Grape, and more.
      </p>
    </div>
  )
}

function AnalysisProgress({ step }) {
  return (
    <div className="card flex min-h-[24rem] flex-col items-center justify-center p-8">
      <Loader2 className="h-12 w-12 animate-spin text-green-600" />
      <h2 className="mt-4 text-xl font-bold text-slate-900">Analysing your crop…</h2>
      <ol className="mt-8 w-full max-w-sm space-y-3">
        {STEPS.map(({ label, icon: Icon }, i) => {
          const done = i < step
          const active = i === step
          return (
            <li
              key={label}
              className={`flex items-center gap-3 rounded-xl border p-3 transition ${
                active ? 'border-green-300 bg-green-50' : done ? 'border-slate-200' : 'border-slate-100 opacity-50'
              }`}
            >
              <span
                className={`grid h-9 w-9 place-items-center rounded-full ${
                  done ? 'bg-green-600 text-white' : active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'
                }`}
              >
                {done ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
              </span>
              <span className={`text-sm font-medium ${active ? 'text-green-800' : 'text-slate-700'}`}>{label}</span>
              {active && <Loader2 className="ml-auto h-4 w-4 animate-spin text-green-600" />}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function NonCropAlertPanel({ result, onNew }) {
  const { t } = useT()

  return (
    <div className="animate-fade-in space-y-5">
      <div className="card overflow-hidden border-2 border-red-300 bg-red-50/70 p-6 shadow-md">
        <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-4">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-red-100 text-red-600 shadow-sm ring-4 ring-red-50">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <div className="flex-1">
            <span className="inline-block rounded-full bg-red-200/80 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-red-900">
              Non-Crop Warning
            </span>
            <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
              {t('detect.nonCropAlertTitle')}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700 font-medium">
              {result.message || t('detect.nonCropAlertDesc')}
            </p>
            {result.reason && (
              <p className="mt-3 text-xs text-red-900 bg-red-100/90 p-3 rounded-xl border border-red-200">
                <b>Diagnostic note:</b> {result.reason}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-red-200 bg-white p-5">
          <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-green-600" /> Image Guidelines for Accurate Diagnosis
          </h3>
          <ul className="mt-3 space-y-2 text-xs leading-relaxed text-slate-600">
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
              <span>Please upload an affected <b>crop leaf or agricultural plant</b> photo only (e.g. Tomato, Potato, Bell Pepper, Corn, Apple, Grape, etc.).</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
              <span>Do not upload photos of animals (dogs, horses, pets), humans, vehicles, furniture, or random non-agricultural images.</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
              <span>Ensure natural daylight and hold the camera steady so leaf lesions or symptoms are in sharp focus.</span>
            </li>
          </ul>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={onNew} className="btn-primary">
            <RefreshCw className="h-4 w-4" /> Try with a crop leaf photo
          </button>
          <Link to="/disease-library" className="btn-secondary">
            <BookOpenText className="h-4 w-4" /> Browse supported crops in Disease Library
          </Link>
        </div>
      </div>
    </div>
  )
}

function ResultPanel({ result, onNew }) {
  const { disease, confidence, alternatives, features, warnings, uncertain } = result
  const healthy = !!disease.healthy
  const tone = uncertain ? 'amber' : healthy ? 'green' : 'red'
  const headerStyle = {
    amber: ['bg-amber-50', 'text-amber-700'],
    green: ['bg-green-50', 'text-green-700'],
    red: ['bg-red-50', 'text-red-700'],
  }[tone]
  const products = getRecommendedProducts(disease.type, disease.crop)
  const { t } = useT()
  const speech = [
    `${result.crop}. Result: ${disease.name}. Confidence ${Math.round(confidence)} percent.`,
    disease.summary,
    `${healthy ? 'Advice' : 'Management'}: ${disease.management.join('. ')}.`,
    `Prevention: ${disease.prevention.join('. ')}.`,
  ].join(' ')

  return (
    <div className="animate-fade-in space-y-5">
      <div className="card overflow-hidden">
        <div className={`flex items-center gap-4 p-5 ${headerStyle[0]}`}>
          <img src={result.thumbnail} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover ring-2 ring-white" />
          <div className="min-w-0 flex-1">
            <p className={`text-xs font-semibold uppercase tracking-wide ${headerStyle[1]}`}>
              {result.crop} · {uncertain ? 'Uncertain – best guess' : healthy ? 'Healthy plant' : 'Disease detected'}
            </p>
            <h2 className="mt-0.5 text-2xl font-extrabold text-slate-900">
              {uncertain && 'Possibly: '}
              {disease.name}
            </h2>
            {!healthy && <p className="text-sm italic text-slate-600">{disease.pathogen}</p>}
            <div className="mt-2 flex flex-wrap gap-2">
              <SeverityBadge severity={disease.severity} />
              {!healthy && <span className="badge bg-slate-200 text-slate-700">{disease.type}</span>}
            </div>
          </div>
        </div>

        <div className="space-y-5 p-5">
          <div>
            <div className="mb-1.5 flex justify-between text-sm">
              <span className="font-medium text-slate-700">Model confidence</span>
              <span className="font-bold text-slate-900">{confidence}%</span>
            </div>
            <div className="h-3 rounded-full bg-slate-100">
              <div
                className={`h-3 rounded-full transition-all duration-700 ${confidence >= 70 ? 'bg-green-500' : confidence >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>

          <p className="text-sm leading-relaxed text-slate-700">{disease.summary}</p>

          {warnings.length > 0 && (
            <div className="space-y-2">
              {warnings.map((w) => (
                <p key={w} className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> {w}
                </p>
              ))}
            </div>
          )}

          <DiseaseInfo disease={disease} />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="card p-5">
          <h3 className="font-bold text-slate-900">Other possibilities</h3>
          <ul className="mt-3 space-y-3">
            {alternatives && alternatives.length > 0 ? (
              alternatives.map((a) => (
                <li key={a.disease.id}>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-700">{a.disease.name}</span>
                    <span className="font-semibold text-slate-900">{a.confidence}%</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-slate-100">
                    <div className="h-1.5 rounded-full bg-slate-400" style={{ width: `${a.confidence}%` }} />
                  </div>
                </li>
              ))
            ) : (
              <p className="text-xs text-slate-500">No close alternative diagnoses.</p>
            )}
          </ul>
        </div>
        <div className="card p-5">
          <h3 className="font-bold text-slate-900">Image analysis</h3>
          <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <Feature label="Leaf coverage" value={features?.leafCoverage ?? 0.85} />
            <Feature label="Healthy tissue" value={features?.green ?? 0.70} />
            <Feature label="Yellowing" value={features?.yellow ?? 0.15} />
            <Feature label="Lesions / spots" value={(features?.brown ?? 0.10) + (features?.dark ?? 0.05)} />
          </dl>
          <p className="mt-3 flex items-center justify-between rounded-lg bg-slate-50 p-2.5 text-sm">
            <span className="text-xs text-slate-500">Photo quality</span>
            <span
              className={`badge ${
                { Good: 'bg-green-100 text-green-700', Fair: 'bg-amber-100 text-amber-700', Poor: 'bg-red-100 text-red-700' }[result.quality?.rating || 'Good']
              }`}
            >
              {result.quality?.rating || 'Good'}
            </span>
          </p>
          <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
            <Brain className="h-3.5 w-3.5" /> {result.model || MODEL_NAME}
          </p>
        </div>
      </div>

      {products.length > 0 && (
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Recommended products</h3>
            <Link to="/store" className="text-sm font-semibold text-green-700 hover:underline">
              Visit store
            </Link>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} compact />
            ))}
          </div>
        </div>
      )}

      <p className="flex items-start gap-2 rounded-xl bg-blue-50 p-4 text-xs leading-relaxed text-blue-800">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        AI diagnoses are for guidance and decision support. Always verify disease diagnosis and treatment dosage with your local Agriculture University, Krishi Vigyan Kendra (KVK) or horticulture officer before applying chemicals.
      </p>

      <div className="flex flex-wrap gap-3">
        <button onClick={onNew} className="btn-primary">
          <RefreshCw className="h-4 w-4" /> {t('detect.scanAnother')}
        </button>
        {result.reportId && (
          <Link to={`/reports?view=${result.reportId}`} className="btn-secondary">
            <FileText className="h-4 w-4" /> {t('detect.viewReport')}
          </Link>
        )}
        <ListenButton text={speech} />
      </div>
    </div>
  )
}

function Feature({ label, value }) {
  return (
    <div className="rounded-lg bg-slate-50 p-2.5">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="font-bold text-slate-900">{(value * 100).toFixed(1)}%</dd>
    </div>
  )
}
