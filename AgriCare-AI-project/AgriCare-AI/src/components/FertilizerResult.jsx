import { CalendarClock, Droplet, Leaf, Sprout } from 'lucide-react'
import { formatINR, formatNumber } from '../utils/format'

const STATUS_CLS = {
  Low: 'bg-red-100 text-red-700',
  Medium: 'bg-amber-100 text-amber-700',
  High: 'bg-green-100 text-green-700',
}

// Shared by the Soil & Fertilizer page and the report detail view.
export default function FertilizerResult({ result }) {
  const nutrients = [
    { key: 'n', label: 'Nitrogen (N)', unit: 'kg/ha' },
    { key: 'p', label: 'Phosphorus (P)', unit: 'kg/ha' },
    { key: 'k', label: 'Potassium (K)', unit: 'kg/ha' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        {nutrients.map((n) => (
          <div key={n.key} className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">{n.label}</span>
              <span className={`badge ${STATUS_CLS[result.status[n.key]]}`}>{result.status[n.key]}</span>
            </div>
            <p className="mt-2 text-xl font-bold text-slate-900">
              {formatNumber(result.soil[n.key])} <span className="text-xs font-medium text-slate-500">{n.unit}</span>
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Crop needs <b className="text-slate-700">{result.need[n.key]}</b> kg/ha {n.key === 'n' ? 'N' : n.key === 'p' ? 'P₂O₅' : 'K₂O'}
            </p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="mb-3 flex items-center gap-2 font-bold text-slate-900">
          <Sprout className="h-5 w-5 text-green-600" /> Fertilizer requirement for {formatNumber(result.area, 2)} {result.unit}
          {result.unit === 'acre' && <span className="text-sm font-normal text-slate-500">({result.areaHa} ha)</span>}
        </h3>
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[520px] text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Fertilizer</th>
                <th className="px-4 py-3 text-right">Per acre</th>
                <th className="px-4 py-3 text-right">Total qty</th>
                <th className="px-4 py-3 text-right">Bags</th>
                <th className="px-4 py-3 text-right">Approx. cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {result.rows.map((r) => (
                <tr key={r.key}>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900">{r.name}</p>
                    <p className="text-xs text-slate-500">{r.grade}</p>
                  </td>
                  <td className="px-4 py-3 text-right">{r.perAcre} kg</td>
                  <td className="px-4 py-3 text-right font-semibold">{formatNumber(r.totalKg, 0)} kg</td>
                  <td className="px-4 py-3 text-right">{r.bags}</td>
                  <td className="px-4 py-3 text-right">{formatINR(r.cost)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-green-50">
              <tr>
                <td className="px-4 py-3 font-bold text-slate-900" colSpan={4}>
                  Estimated total cost
                </td>
                <td className="px-4 py-3 text-right font-bold text-green-700">{formatINR(result.totalCost)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Based on RDF {result.rdf.n}:{result.rdf.p}:{result.rdf.k} kg/ha (N:P₂O₅:K₂O) for {result.crop}, adjusted for soil test
          values. Prices are indicative subsidised rates.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-4">
          <h3 className="mb-3 flex items-center gap-2 font-bold text-slate-900">
            <CalendarClock className="h-5 w-5 text-green-600" /> Application schedule
          </h3>
          <ol className="space-y-3">
            {result.schedule.map((s, i) => (
              <li key={s.stage} className="flex gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{s.stage}</p>
                  <p className="text-sm text-slate-600">{s.items}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 p-4">
            <h3 className="mb-2 flex items-center gap-2 font-bold text-slate-900">
              <Droplet className="h-5 w-5 text-blue-600" /> Soil pH: {result.soil.ph}
              <span className={`badge ${result.ph.suitable ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {result.ph.status}
              </span>
            </h3>
            <p className="text-sm text-slate-600">{result.ph.advice}</p>
            <p className="mt-2 text-xs text-slate-500">
              Ideal for {result.crop}: pH {result.ph.range} {result.ph.suitable ? '✓ within range' : '– outside ideal range'}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <h3 className="mb-2 flex items-center gap-2 font-bold text-slate-900">
              <Leaf className="h-5 w-5 text-green-600" /> Additional advice
            </h3>
            <ul className="space-y-1.5">
              {result.extras.map((e) => (
                <li key={e} className="flex gap-2 text-sm text-slate-600">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                  {e}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
