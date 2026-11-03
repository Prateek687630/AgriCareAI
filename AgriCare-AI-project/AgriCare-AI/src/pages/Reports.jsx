import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Download, Eye, FileText, Printer, ScanLine, Search, Share2, Trash2 } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import Modal from '../components/Modal.jsx'
import DiseaseInfo, { SeverityBadge } from '../components/DiseaseInfo.jsx'
import FertilizerResult from '../components/FertilizerResult.jsx'
import { ReportIcon } from './Dashboard.jsx'
import { useApp } from '../context/AppContext.jsx'
import { useT } from '../i18n/LanguageContext.jsx'
import { getDiseaseById } from '../data/diseases'
import { calculateFertilizer } from '../services/fertilizerService'
import { downloadTextFile, formatDateTime, formatINR } from '../utils/format'

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'disease', label: 'Disease' },
  { key: 'soil', label: 'Fertilizer' },
]

export default function Reports() {
  const { reports, deleteReport, clearReports, showToast } = useApp()
  const { t } = useT()
  const [params, setParams] = useSearchParams()
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [confirm, setConfirm] = useState(null) // report id or 'all'

  const viewing = reports.find((r) => r.id === params.get('view'))
  const openReport = (id) => setParams(id ? { view: id } : {}, { replace: !id })

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return reports
      .filter((r) => filter === 'all' || r.type === filter)
      .filter((r) => !q || r.title.toLowerCase().includes(q))
  }, [reports, filter, query])

  const doDelete = () => {
    if (confirm === 'all') {
      clearReports()
      showToast('All reports deleted')
    } else {
      deleteReport(confirm)
      if (viewing?.id === confirm) openReport(null)
      showToast('Report deleted')
    }
    setConfirm(null)
  }

  return (
    <>
      <PageHeader icon={FileText} title={t('nav.reports')} subtitle={t('reports.subtitle')}>
        {reports.length > 0 && (
          <button onClick={() => setConfirm('all')} className="btn-secondary text-red-600">
            <Trash2 className="h-4 w-4" /> Clear all
          </button>
        )}
      </PageHeader>

      <div className="container-page py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex rounded-xl bg-white p-1 ring-1 ring-slate-200">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium sm:flex-none ${
                  filter === f.key ? 'bg-green-600 text-white' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              className="input pl-10"
              placeholder="Search by crop or disease…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search reports"
            />
          </div>
        </div>

        {list.length === 0 ? (
          <div className="card mt-6 flex flex-col items-center p-12 text-center">
            <FileText className="h-12 w-12 text-slate-300" />
            <p className="mt-3 font-semibold text-slate-700">{reports.length ? 'No matching reports' : 'No reports yet'}</p>
            <p className="mt-1 text-sm text-slate-500">Your diagnoses and fertilizer plans will appear here.</p>
            <Link to="/disease-detection" className="btn-primary mt-5">
              <ScanLine className="h-4 w-4" /> Diagnose a plant
            </Link>
          </div>
        ) : (
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {list.map((r) => (
              <li key={r.id} className="card flex min-w-0 items-center gap-4 p-4">
                <ReportIcon report={r} size="h-16 w-16" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-900">{r.title}</p>
                  <p className="text-xs text-slate-500">{formatDateTime(r.date)}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {r.type === 'disease' ? (
                      <>
                        <span className={`badge ${r.healthy ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {r.healthy ? 'Healthy' : 'Diseased'}
                        </span>
                        <span className="badge bg-slate-100 text-slate-600">{r.confidence}%</span>
                      </>
                    ) : (
                      <span className="badge bg-blue-100 text-blue-700">Fertilizer plan</span>
                    )}
                    {r.demo && <span className="badge bg-amber-50 text-amber-700">Demo</span>}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => openReport(r.id)}
                    className="rounded-lg p-2 text-slate-500 hover:bg-green-50 hover:text-green-700"
                    aria-label="View report"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setConfirm(r.id)}
                    className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                    aria-label="Delete report"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ReportDetail report={viewing} onClose={() => openReport(null)} />

      <Modal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title={confirm === 'all' ? 'Delete all reports?' : 'Delete report?'}
        size="sm"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setConfirm(null)}>
              Cancel
            </button>
            <button className="btn-danger" onClick={doDelete}>
              Delete
            </button>
          </>
        }
      >
        <p className="text-sm text-slate-600">This action cannot be undone.</p>
      </Modal>
    </>
  )
}

function ReportDetail({ report, onClose }) {
  const disease = report?.type === 'disease' ? getDiseaseById(report.diseaseId) : null
  const fert = useMemo(() => {
    if (report?.type !== 'soil') return null
    try {
      return calculateFertilizer(report.inputs)
    } catch {
      return null
    }
  }, [report])

  const buildText = () => {
    const lines = [
      'AGRICARE AI – REPORT',
      '====================',
      `Report ID : ${report.id}`,
      `Date      : ${formatDateTime(report.date)}`,
      `Title     : ${report.title}`,
      '',
    ]
    if (disease) {
      lines.push(
        `Crop       : ${disease.crop}`,
        `Result     : ${disease.name}${disease.healthy ? '' : ` (${disease.pathogen})`}`,
        `Confidence : ${report.confidence}%`,
        `Severity   : ${disease.severity}`,
        '',
        disease.summary,
        '',
        'SYMPTOMS',
        ...disease.symptoms.map((s) => `  - ${s}`),
        '',
        'MANAGEMENT',
        ...disease.management.map((s) => `  - ${s}`),
        '',
        'PREVENTION',
        ...disease.prevention.map((s) => `  - ${s}`),
      )
    }
    if (fert) {
      lines.push(
        `Crop  : ${fert.crop}`,
        `Area  : ${fert.area} ${fert.unit} (${fert.areaHa} ha)`,
        `Soil  : N ${fert.soil.n} (${fert.status.n}), P ${fert.soil.p} (${fert.status.p}), K ${fert.soil.k} (${fert.status.k}) kg/ha, pH ${fert.soil.ph} (${fert.ph.status})`,
        '',
        'FERTILIZER REQUIREMENT',
        ...fert.rows.map((r) => `  - ${r.name} (${r.grade}): ${r.totalKg} kg  ≈ ${r.bags} bags  ≈ ${formatINR(r.cost)}`),
        `  Total estimated cost: ${formatINR(fert.totalCost)}`,
        '',
        'APPLICATION SCHEDULE',
        ...fert.schedule.map((s) => `  - ${s.stage}: ${s.items}`),
        '',
        `pH ADVICE: ${fert.ph.advice}`,
        ...fert.extras.map((e) => `  - ${e}`),
      )
    }
    lines.push('', 'Disclaimer: Prototype guidance only. Consult a local agriculture expert before treatment.')
    return lines.join('\n')
  }

  const download = () => downloadTextFile(`agricare-report-${report.id}.txt`, buildText())

  // Native share sheet on phones (WhatsApp, SMS, email…); WhatsApp web link elsewhere
  const share = async () => {
    const text = buildText()
    if (navigator.share) {
      try {
        await navigator.share({ title: report.title, text })
        return
      } catch (e) {
        if (e.name === 'AbortError') return
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
  }

  return (
    <Modal
      open={!!report}
      onClose={onClose}
      title={report?.title ?? ''}
      size="xl"
      footer={
        <>
          <button className="btn-secondary" onClick={share}>
            <Share2 className="h-4 w-4" /> Share
          </button>
          <button className="btn-secondary" onClick={() => window.print()}>
            <Printer className="h-4 w-4" /> Print
          </button>
          <button className="btn-primary" onClick={download}>
            <Download className="h-4 w-4" /> Download
          </button>
        </>
      }
    >
      {report && (
        <div>
          <p className="mb-4 text-xs text-slate-500">
            {formatDateTime(report.date)} · Report ID {report.id}
          </p>

          {disease && (
            <div className="space-y-5">
              <div className="flex flex-col gap-4 sm:flex-row">
                {report.thumbnail && (
                  <img src={report.thumbnail} alt="Uploaded leaf" className="h-40 w-full rounded-xl object-cover sm:w-48" />
                )}
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-green-700">{disease.crop}</p>
                  <h3 className="text-2xl font-extrabold text-slate-900">{disease.name}</h3>
                  {!disease.healthy && <p className="text-sm italic text-slate-600">{disease.pathogen}</p>}
                  <div className="mt-2 flex flex-wrap gap-2">
                    <SeverityBadge severity={disease.severity} />
                    <span className="badge bg-slate-100 text-slate-700">{report.confidence}% confidence</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-700">{disease.summary}</p>
                </div>
              </div>
              <DiseaseInfo disease={disease} printAll />
            </div>
          )}

          {fert && <FertilizerResult result={fert} />}
          {!disease && !fert && <p className="text-sm text-slate-500">Report data is unavailable.</p>}
        </div>
      )}
    </Modal>
  )
}
