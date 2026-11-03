import { useEffect, useState } from 'react'
import { Square, Volume2 } from 'lucide-react'
import { useT } from '../i18n/LanguageContext.jsx'

// Reads text aloud using the browser's built-in speech synthesis (works offline on most phones).
export default function ListenButton({ text, className = 'btn-secondary' }) {
  const { t } = useT()
  const [speaking, setSpeaking] = useState(false)
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window

  useEffect(() => () => supported && window.speechSynthesis.cancel(), [supported])

  if (!supported) return null

  const toggle = () => {
    const synth = window.speechSynthesis
    if (speaking) {
      synth.cancel()
      setSpeaking(false)
      return
    }
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'en-IN'
    u.rate = 0.95
    u.voice = synth.getVoices().find((v) => v.lang === 'en-IN') ?? null
    u.onend = () => setSpeaking(false)
    u.onerror = () => setSpeaking(false)
    synth.cancel()
    synth.speak(u)
    setSpeaking(true)
  }

  return (
    <button type="button" onClick={toggle} className={className} aria-pressed={speaking}>
      {speaking ? <Square className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      {speaking ? t('detect.stop') : t('detect.listen')}
    </button>
  )
}
