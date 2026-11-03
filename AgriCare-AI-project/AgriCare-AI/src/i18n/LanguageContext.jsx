import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { loadState, saveState } from '../utils/storage'
import { STRINGS } from './strings'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => loadState('lang', 'en'))

  useEffect(() => {
    saveState('lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  // Falls back to English, then to the key itself, so a missing translation never breaks the UI
  const t = useCallback((key) => STRINGS[lang]?.[key] ?? STRINGS.en[key] ?? key, [lang])
  const toggleLang = useCallback(() => setLang((l) => (l === 'en' ? 'hi' : 'en')), [])

  return <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>{children}</LanguageContext.Provider>
}

export function useT() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useT must be used inside <LanguageProvider>')
  return ctx
}
