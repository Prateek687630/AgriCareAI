// Soil-test based fertilizer recommendation.
// Soil ratings follow commonly used Indian soil-test categories (available nutrients, kg/ha):
//   N: Low < 280, Medium 280–560, High > 560
//   P: Low < 10,  Medium 10–25,  High > 25
//   K: Low < 108, Medium 108–280, High > 280
// Dose adjustment: Low -> +25% of RDF, Medium -> RDF, High -> -25% of RDF.

import { getCropByName } from '../data/crops'

const ACRE_TO_HA = 0.4047

export const FERTILIZERS = {
  urea: { name: 'Urea', grade: '46% N', bagKg: 45, bagPrice: 267 },
  dap: { name: 'DAP', grade: '18:46:0', bagKg: 50, bagPrice: 1350 },
  mop: { name: 'MOP', grade: '60% K₂O', bagKg: 50, bagPrice: 1700 },
}

const LIMITS = {
  n: [0, 1500],
  p: [0, 300],
  k: [0, 1500],
  ph: [3, 11],
  area: [0.01, 10000],
}

export function validateSoilInputs(v) {
  const errors = {}
  if (!v.crop) errors.crop = 'Select a crop'
  for (const key of ['area', 'n', 'p', 'k', 'ph']) {
    const raw = v[key]
    const num = Number(raw)
    const [min, max] = LIMITS[key]
    if (raw === '' || raw === null || raw === undefined) errors[key] = 'Required'
    else if (Number.isNaN(num)) errors[key] = 'Enter a number'
    else if (num < min || num > max) errors[key] = `Must be between ${min} and ${max}`
  }
  return errors
}

const rate = (value, low, high) => (value < low ? 'Low' : value <= high ? 'Medium' : 'High')
const FACTOR = { Low: 1.25, Medium: 1, High: 0.75 }

function phAdvice(ph, [minOk, maxOk]) {
  let status
  let advice
  if (ph < 5.5) {
    status = 'Strongly acidic'
    advice = 'Apply agricultural lime (about 2–4 t/ha, based on lime requirement test) 2–3 weeks before sowing.'
  } else if (ph < 6.5) {
    status = 'Slightly acidic'
    advice = 'Suitable for most crops. Add organic manure; use lime only if the crop needs higher pH.'
  } else if (ph <= 7.5) {
    status = 'Neutral'
    advice = 'Ideal pH range. Nutrient availability is good for most crops.'
  } else if (ph <= 8.5) {
    status = 'Alkaline'
    advice = 'Add organic matter / green manure. Use acid-forming fertilizers like ammonium sulphate where suitable.'
  } else {
    status = 'Strongly alkaline (sodic)'
    advice = 'Apply gypsum based on gypsum requirement test and ensure good drainage. Consult a soil expert.'
  }
  const suitable = ph >= minOk && ph <= maxOk
  return { status, advice, suitable, range: `${minOk} – ${maxOk}` }
}

function schedule(type) {
  if (type === 'legume')
    return [
      { stage: 'Basal (at sowing)', items: 'Full DAP + full MOP + full Urea (starter N)' },
      { stage: 'Seed treatment', items: 'Rhizobium + PSB culture (biofertilizer) before sowing' },
    ]
  if (type === 'two')
    return [
      { stage: 'Basal (at sowing)', items: 'Full DAP + full MOP + ½ Urea' },
      { stage: 'Top dressing (25–35 days)', items: 'Remaining ½ Urea after first irrigation' },
    ]
  return [
    { stage: 'Basal (at sowing)', items: 'Full DAP + full MOP + ⅓ Urea' },
    { stage: '1st top dressing (20–30 days)', items: '⅓ Urea' },
    { stage: '2nd top dressing (45–60 days)', items: '⅓ Urea' },
  ]
}

export function calculateFertilizer(input) {
  const crop = getCropByName(input.crop)
  if (!crop) throw new Error('Unknown crop')

  const area = Number(input.area)
  const areaHa = input.unit === 'acre' ? area * ACRE_TO_HA : area
  const soil = { n: Number(input.n), p: Number(input.p), k: Number(input.k), ph: Number(input.ph) }

  const status = {
    n: rate(soil.n, 280, 560),
    p: rate(soil.p, 10, 25),
    k: rate(soil.k, 108, 280),
  }

  // Required nutrient (kg/ha) after soil-test adjustment
  const need = {
    n: crop.n * FACTOR[status.n],
    p: crop.p * FACTOR[status.p],
    k: crop.k * FACTOR[status.k],
  }

  // Convert nutrients to fertilizer products (kg/ha). DAP covers P first and also supplies N.
  const dapHa = need.p / 0.46
  const ureaHa = Math.max(0, need.n - dapHa * 0.18) / 0.46
  const mopHa = need.k / 0.6

  const rows = [
    { key: 'urea', perHa: ureaHa },
    { key: 'dap', perHa: dapHa },
    { key: 'mop', perHa: mopHa },
  ].map(({ key, perHa }) => {
    const f = FERTILIZERS[key]
    const totalKg = perHa * areaHa
    const bags = totalKg / f.bagKg
    return {
      key,
      name: f.name,
      grade: f.grade,
      perHa: Math.round(perHa),
      perAcre: Math.round(perHa * ACRE_TO_HA),
      totalKg: Math.round(totalKg),
      bags: Math.ceil(bags * 2) / 2, // round up to half bag
      cost: Math.round(bags * f.bagPrice),
    }
  })

  const extras = [
    `Apply well-decomposed FYM / compost at ${areaHa >= 1 ? '10 t/ha' : 'about 4 t/acre'} before field preparation.`,
  ]
  if (crop.zinc) extras.push('Apply Zinc Sulphate @ 25 kg/ha once in 2–3 seasons if zinc deficiency is seen.')
  if (status.n === 'High') extras.push('Soil nitrogen is high – avoid excess urea to prevent lodging and pest attack.')

  return {
    crop: crop.name,
    area,
    unit: input.unit,
    areaHa: Number(areaHa.toFixed(2)),
    soil,
    status,
    rdf: { n: crop.n, p: crop.p, k: crop.k },
    need: { n: Math.round(need.n), p: Math.round(need.p), k: Math.round(need.k) },
    rows,
    totalCost: rows.reduce((s, r) => s + r.cost, 0),
    ph: phAdvice(soil.ph, crop.ph),
    schedule: schedule(crop.splits),
    extras,
  }
}
