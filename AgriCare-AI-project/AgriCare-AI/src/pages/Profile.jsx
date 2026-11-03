import { useEffect, useState } from 'react'
import { MapPin, Package, Pencil, Phone, RotateCcw, Save, Sprout, User, X } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import Modal from '../components/Modal.jsx'
import { useApp } from '../context/AppContext.jsx'
import { useT } from '../i18n/LanguageContext.jsx'
import { formatDate, formatINR, initials } from '../utils/format'

const STATES = [
  'Andhra Pradesh', 'Bihar', 'Chhattisgarh', 'Gujarat', 'Haryana', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
]
const SOILS = ['Alluvial', 'Black (Vertisol)', 'Red', 'Laterite', 'Sandy / Desert', 'Mountain']
const IRRIGATION = ['Rainfed', 'Canal', 'Tube well', 'Open well', 'Drip / Sprinkler']
const LANGUAGES = ['English', 'Hindi', 'Marathi', 'Telugu', 'Tamil', 'Bengali', 'Punjabi', 'Gujarati']

export default function Profile() {
  const { profile, updateProfile, reports, orders, resetDemoData, showToast } = useApp()
  const { t } = useT()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(profile)
  const [errors, setErrors] = useState({})
  const [confirmReset, setConfirmReset] = useState(false)

  useEffect(() => {
    if (!editing) setForm(profile)
  }, [profile, editing])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const save = (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (form.phone && !/^[6-9]\d{9}$/.test(form.phone)) errs.phone = 'Enter a valid 10-digit mobile number'
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email'
    if (form.landSize && (Number.isNaN(+form.landSize) || +form.landSize < 0)) errs.landSize = 'Enter a valid number'
    setErrors(errs)
    if (Object.keys(errs).length) return
    updateProfile({ ...form, name: form.name.trim() })
    setEditing(false)
    showToast('Profile updated')
  }

  const stats = [
    { label: 'Diagnoses', value: reports.filter((r) => r.type === 'disease').length },
    { label: 'Fertilizer plans', value: reports.filter((r) => r.type === 'soil').length },
    { label: 'Orders', value: orders.length },
  ]

  return (
    <>
      <PageHeader icon={User} title={t('profile.title')} subtitle={t('profile.subtitle')} />

      <div className="container-page grid gap-6 py-8 lg:grid-cols-3">
        <aside className="space-y-6">
          <div className="card p-6 text-center">
            <span className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-green-500 to-emerald-700 text-3xl font-extrabold text-white">
              {initials(profile.name)}
            </span>
            <h2 className="mt-4 text-xl font-bold text-slate-900">{profile.name}</h2>
            <p className="mt-1 flex items-center justify-center gap-1 text-sm text-slate-500">
              <MapPin className="h-4 w-4" />
              {[profile.village, profile.district, profile.state].filter(Boolean).join(', ') || 'Location not set'}
            </p>
            {profile.phone && (
              <p className="mt-1 flex items-center justify-center gap-1 text-sm text-slate-500">
                <Phone className="h-4 w-4" /> +91 {profile.phone}
              </p>
            )}
            <div className="mt-5 grid grid-cols-3 divide-x divide-slate-100 rounded-xl bg-slate-50 py-3">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="text-xl font-extrabold text-slate-900">{s.value}</p>
                  <p className="text-xs text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="flex items-center gap-2 font-bold text-slate-900">
              <Package className="h-5 w-5 text-green-600" /> Recent orders
            </h3>
            {orders.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">No orders yet.</p>
            ) : (
              <ul className="mt-3 divide-y divide-slate-100">
                {orders.slice(0, 5).map((o) => (
                  <li key={o.id} className="py-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-800">{o.id}</span>
                      <span className="font-semibold">{formatINR(o.total + (o.delivery ?? 0))}</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {formatDate(o.date)} · {o.items.reduce((s, i) => s + i.qty, 0)} items · {o.status}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button onClick={() => setConfirmReset(true)} className="btn-ghost w-full text-red-600">
            <RotateCcw className="h-4 w-4" /> Reset demo data
          </button>
        </aside>

        <form onSubmit={save} noValidate className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <Sprout className="h-5 w-5 text-green-600" /> Farmer information
            </h2>
            {!editing ? (
              <button type="button" onClick={() => setEditing(true)} className="btn-secondary">
                <Pencil className="h-4 w-4" /> Edit
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setEditing(false)
                  setErrors({})
                }}
                className="btn-ghost"
              >
                <X className="h-4 w-4" /> Cancel
              </button>
            )}
          </div>

          <fieldset disabled={!editing} className="mt-6 grid gap-5 sm:grid-cols-2">
            <Input label="Full name" value={form.name} onChange={set('name')} error={errors.name} />
            <Input label="Mobile number" value={form.phone} onChange={set('phone')} error={errors.phone} inputMode="numeric" maxLength={10} />
            <Input label="Email (optional)" value={form.email} onChange={set('email')} error={errors.email} type="email" />
            <Input label="Village / Town" value={form.village} onChange={set('village')} />
            <Input label="District" value={form.district} onChange={set('district')} />
            <Select label="State" value={form.state} onChange={set('state')} options={STATES} />
            <div>
              <span className="label">Land holding</span>
              <div className="flex gap-2">
                <input
                  className={`input ${errors.landSize ? 'input-error' : ''} disabled:bg-slate-50`}
                  value={form.landSize}
                  onChange={set('landSize')}
                  inputMode="decimal"
                  aria-label="Land size"
                />
                <select className="input w-32 disabled:bg-slate-50" value={form.landUnit} onChange={set('landUnit')} aria-label="Land unit">
                  <option value="acre">acre</option>
                  <option value="hectare">hectare</option>
                </select>
              </div>
              {errors.landSize && <p className="mt-1 text-xs text-red-600">{errors.landSize}</p>}
            </div>
            <Input label="Main crops" value={form.mainCrops} onChange={set('mainCrops')} placeholder="e.g. Wheat, Soybean" />
            <Select label="Soil type" value={form.soilType} onChange={set('soilType')} options={SOILS} />
            <Select label="Irrigation source" value={form.irrigation} onChange={set('irrigation')} options={IRRIGATION} />
            <Select label="Preferred language" value={form.language} onChange={set('language')} options={LANGUAGES} />
          </fieldset>

          {editing && (
            <div className="mt-6 flex justify-end">
              <button type="submit" className="btn-primary">
                <Save className="h-4 w-4" /> Save changes
              </button>
            </div>
          )}
        </form>
      </div>

      <Modal
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        title="Reset demo data?"
        size="sm"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setConfirmReset(false)}>
              Cancel
            </button>
            <button
              className="btn-danger"
              onClick={() => {
                resetDemoData()
                setConfirmReset(false)
                setEditing(false)
                showToast('Demo data restored')
              }}
            >
              Reset
            </button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          This restores the sample profile and reports, and clears your cart and orders stored in this browser.
        </p>
      </Modal>
    </>
  )
}

function Input({ label, error, ...props }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <input className={`input ${error ? 'input-error' : ''} disabled:bg-slate-50`} {...props} value={props.value ?? ''} />
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  )
}

function Select({ label, options, ...props }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <select className="input disabled:bg-slate-50" {...props}>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  )
}
