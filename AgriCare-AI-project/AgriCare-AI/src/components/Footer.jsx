import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'
import { MORE_LINKS, NAV_LINKS } from './Navbar.jsx'
import { useT } from '../i18n/LanguageContext.jsx'

export default function Footer() {
  const { t } = useT()
  return (
    <footer className="no-print mt-16 bg-slate-900 text-slate-300">
      <div className="container-page grid gap-10 py-12 md:grid-cols-3">
        <div>
          <Logo light />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
            AI-powered farmer assistance – crop disease detection, soil &amp; fertilizer guidance and agricultural products
            in one simple app.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Modules</h3>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {[...NAV_LINKS, { to: '/profile', key: 'nav.profile' }, ...MORE_LINKS].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-white">
                  {t(l.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Project</h3>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            B.Tech Minor Project – Report 1
            <br />
            Department of Computer Science &amp; Engineering
            <br />
            Indian Institute of Information Technology, Bhopal
          </p>
          <p className="mt-3 text-xs text-slate-500">
            Prototype uses demo data. Diagnoses are for guidance only – consult an agriculture expert before treatment.
          </p>
        </div>
      </div>
      <div className="border-t border-slate-800 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} AgriCare AI · Built with React, Vite &amp; Tailwind CSS
      </div>
    </footer>
  )
}
