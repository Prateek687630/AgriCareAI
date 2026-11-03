import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  BookOpenText,
  CalendarDays,
  ChevronDown,
  FileText,
  FlaskConical,
  Home,
  Info,
  Languages,
  LayoutDashboard,
  LifeBuoy,
  Menu,
  ScanLine,
  ShoppingBag,
  ShoppingCart,
  User,
  X,
} from 'lucide-react'
import Logo from './Logo.jsx'
import { useApp } from '../context/AppContext.jsx'
import { useT } from '../i18n/LanguageContext.jsx'
import { initials } from '../utils/format'

export const NAV_LINKS = [
  { to: '/', key: 'nav.home', icon: Home },
  { to: '/dashboard', key: 'nav.dashboard', icon: LayoutDashboard },
  { to: '/disease-detection', key: 'nav.detect', icon: ScanLine },
  { to: '/soil-fertilizer', key: 'nav.soil', icon: FlaskConical },
  { to: '/store', key: 'nav.store', icon: ShoppingBag },
  { to: '/reports', key: 'nav.reports', icon: FileText },
]

export const MORE_LINKS = [
  { to: '/disease-library', key: 'nav.library', icon: BookOpenText },
  { to: '/crop-calendar', key: 'nav.calendar', icon: CalendarDays },
  { to: '/help', key: 'nav.help', icon: LifeBuoy },
  { to: '/about', key: 'nav.about', icon: Info },
]

const linkClass = ({ isActive }) =>
  `whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-green-50 text-green-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const moreRef = useRef(null)
  const { cartCount, profile } = useApp()
  const { t, lang, toggleLang } = useT()
  const { pathname } = useLocation()
  const moreActive = MORE_LINKS.some((l) => l.to === pathname)

  useEffect(() => {
    setOpen(false)
    setMoreOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!moreOpen) return
    const onClick = (e) => !moreRef.current?.contains(e.target) && setMoreOpen(false)
    const onKey = (e) => e.key === 'Escape' && setMoreOpen(false)
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [moreOpen])

  return (
    <header className="no-print sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" aria-label="AgriCare AI home">
          <Logo />
        </Link>

        <div className="hidden items-center gap-1 xl:flex">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={linkClass}>
              {t(l.key)}
            </NavLink>
          ))}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setMoreOpen((o) => !o)}
              className={linkClass({ isActive: moreActive }) + ' flex items-center gap-1'}
              aria-expanded={moreOpen}
              aria-haspopup="menu"
            >
              {t('nav.more')} <ChevronDown className={`h-4 w-4 transition ${moreOpen ? 'rotate-180' : ''}`} />
            </button>
            {moreOpen && (
              <div role="menu" className="absolute right-0 mt-2 w-56 animate-fade-in rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                {MORE_LINKS.map(({ to, key, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    role="menuitem"
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                        isActive ? 'bg-green-50 text-green-700' : 'text-slate-700 hover:bg-slate-50'
                      }`
                    }
                  >
                    <Icon className="h-4 w-4" /> {t(key)}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={toggleLang}
            className="flex h-10 items-center gap-1.5 rounded-xl px-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            aria-label={lang === 'en' ? 'हिंदी में बदलें' : 'Switch to English'}
            title={lang === 'en' ? 'हिंदी में बदलें' : 'Switch to English'}
          >
            <Languages className="h-5 w-5 text-green-600" />
            {lang === 'en' ? 'हिं' : 'EN'}
          </button>
          <Link
            to="/store?cart=open"
            className="relative grid h-10 w-10 place-items-center rounded-xl text-slate-600 hover:bg-slate-100"
            aria-label={`Cart, ${cartCount} items`}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
          <Link
            to="/profile"
            className="hidden items-center gap-2 rounded-xl py-1 pl-1 pr-3 hover:bg-slate-100 sm:flex"
            aria-label="Profile"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-green-100 text-xs font-bold text-green-700">
              {initials(profile.name)}
            </span>
            <span className="max-w-[8rem] truncate text-sm font-medium text-slate-700">{profile.name.split(' ')[0] || 'Profile'}</span>
          </Link>
          <button
            className="grid h-10 w-10 place-items-center rounded-xl text-slate-700 hover:bg-slate-100 xl:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="max-h-[calc(100vh-4rem)] animate-fade-in overflow-y-auto border-t border-slate-200 bg-white xl:hidden">
          <div className="container-page grid gap-1 py-3 sm:grid-cols-2">
            {[...NAV_LINKS, { to: '/profile', key: 'nav.profile', icon: User }, ...MORE_LINKS].map(({ to, key, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium ${
                    isActive ? 'bg-green-50 text-green-700' : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                {t(key)}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
