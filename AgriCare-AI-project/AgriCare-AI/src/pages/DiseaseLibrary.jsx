import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { BookOpenText, Bug, Leaf, Microscope, ScanLine, Search, Biohazard } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import Modal from '../components/Modal.jsx'
import DiseaseInfo, { SeverityBadge } from '../components/DiseaseInfo.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { useT } from '../i18n/LanguageContext.jsx'
import { CROPS, DISEASES, getDiseaseById } from '../data/diseases'
import { getRecommendedProducts } from '../data/products'

const TYPES = ['All', 'Fungal', 'Bacterial', 'Viral', 'Pest', 'Healthy']

const TYPE_STYLE = {
  Fungal: { icon: Microscope, cls: 'bg-amber-100 text-amber-700' },
  Bacterial: { icon: Bug, cls: 'bg-rose-100 text-rose-700' },
  Viral: { icon: Biohazard, cls: 'bg-violet-100 text-violet-700' },
  Pest: { icon: Bug, cls: 'bg-orange-100 text-orange-700' },
  None: { icon: Leaf, cls: 'bg-green-100 text-green-700' },
}

export default function DiseaseLibrary() {
  const { t } = useT()
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const crop = params.get('crop') ?? 'All'
  const type = params.get('type') ?? 'All'
  const selected = getDiseaseById(params.get('id'))

  // Filters live in the URL so a filtered view or a single disease can be bookmarked/shared
  const update = (patch) => {
    const next = Object.fromEntries(params)
    Object.entries(patch).forEach(([k, v]) => (v && v !== 'All' ? (next[k] = v) : delete next[k]))
    setParams(next, { replace: true })
  }

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return DISEASES.filter((d) => crop === 'All' || d.crop === crop)
      .filter((d) => type === 'All' || (type === 'Healthy' ? d.healthy : d.type === type))
      .filter((d) => !q || `${d.name} ${d.crop} ${d.pathogen} ${d.summary}`.toLowerCase().includes(q))
  }, [query, crop, type])

  return (
    <>
      <PageHeader icon={BookOpenText} title={t('nav.library')} subtitle={t('library.subtitle')} />

      <div className="container-page py-8">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              className="input pl-10"
              placeholder="Search disease, crop or pathogen…"
              value={query}
              onChange={(e) => update({ q: e.target.value })}
              aria-label="Search diseases"
            />
          </div>
          <select className="input md:w-56" value={crop} onChange={(e) => update({ crop: e.target.value })} aria-label="Filter by crop">
            <option value="All">All crops</option>
            {CROPS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {TYPES.map((tp) => (
            <button
              key={tp}
              onClick={() => update({ type: tp })}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                type === tp ? 'bg-green-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
              }`}
            >
              {tp}
            </button>
          ))}
        </div>

        <p className="mt-4 text-sm text-slate-500">
          {list.length} of {DISEASES.length} classes · based on the PlantVillage dataset used in the base paper
        </p>

        {list.length === 0 ? (
          <div className="card mt-4 p-12 text-center text-sm text-slate-500">No diseases match your search.</div>
        ) : (
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((d) => {
              const { icon: Icon, cls } = TYPE_STYLE[d.type]
              return (
                <li key={d.id} className="min-w-0">
                  <button
                    onClick={() => update({ id: d.id })}
                    className="card flex h-full w-full flex-col p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex items-start gap-3">
                      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${cls}`}>
                        <Icon className="h-6 w-6" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wide text-green-700">{d.crop}</p>
                        <h3 className="font-bold text-slate-900">{d.name}</h3>
                        {!d.healthy && <p className="truncate text-xs italic text-slate-500">{d.pathogen}</p>}
                      </div>
                    </div>
                    <p className="mt-3 line-clamp-3 text-sm text-slate-600">{d.summary}</p>
                    <div className="mt-auto flex flex-wrap gap-2 pt-4">
                      <SeverityBadge severity={d.severity} />
                      {!d.healthy && <span className="badge bg-slate-100 text-slate-700">{d.type}</span>}
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <Modal
        open={!!selected}
        onClose={() => update({ id: null })}
        title={selected ? `${selected.crop} – ${selected.name}` : ''}
        size="xl"
        footer={
          <Link to="/disease-detection" className="btn-primary">
            <ScanLine className="h-4 w-4" /> Diagnose my plant
          </Link>
        }
      >
        {selected && (
          <div className="space-y-6">
            <div>
              {!selected.healthy && <p className="text-sm italic text-slate-600">{selected.pathogen}</p>}
              <div className="mt-2 flex flex-wrap gap-2">
                <SeverityBadge severity={selected.severity} />
                {!selected.healthy && <span className="badge bg-slate-100 text-slate-700">{selected.type}</span>}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">{selected.summary}</p>
            </div>
            <DiseaseInfo disease={selected} printAll />
            {getRecommendedProducts(selected.type, selected.crop).length > 0 && (
              <div>
                <h4 className="mb-3 text-sm font-bold text-slate-900">Useful products</h4>
                <div className="grid gap-4 sm:grid-cols-3">
                  {getRecommendedProducts(selected.type, selected.crop).map((p) => (
                    <ProductCard key={p.id} product={p} compact />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  )
}
