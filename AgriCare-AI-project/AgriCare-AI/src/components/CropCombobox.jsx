import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Mic, MicOff, Search, X } from 'lucide-react'
import { useT } from '../i18n/LanguageContext.jsx'
import { useApp } from '../context/AppContext.jsx'

const CROP_ALIASES = [
  { crop: 'Tomato', keywords: ['tomato', 'tomatoes', 'tamatar', 'tamater', 'टमाटर', 'टमाटर की खेती'] },
  { crop: 'Potato', keywords: ['potato', 'potatoes', 'aloo', 'aalu', 'alu', 'आलू'] },
  { crop: 'Corn (Maize)', keywords: ['corn', 'maize', 'makka', 'bhutta', 'makkai', 'मक्का', 'भुट्टा'] },
  { crop: 'Rice', keywords: ['rice', 'paddy', 'dhan', 'chawal', 'धान', 'चावल'] },
  { crop: 'Wheat', keywords: ['wheat', 'gehun', 'gehu', 'गेहूं', 'गेहू', 'गेहूँ'] },
  { crop: 'Cotton', keywords: ['cotton', 'kapas', 'rui', 'कपास', 'रूई'] },
  { crop: 'Sugarcane', keywords: ['sugarcane', 'sugar cane', 'ganna', 'eekh', 'गन्ना', 'ईख'] },
  { crop: 'Groundnut', keywords: ['groundnut', 'peanut', 'moongphali', 'mungfali', 'मूंगफली'] },
  { crop: 'Chilli', keywords: ['chilli', 'chili', 'mirch', 'hari mirch', 'हरी मिर्च', 'मिर्च'] },
  { crop: 'Citrus', keywords: ['citrus', 'lemon', 'nimbu', 'kinnow', 'नींबू'] },
  { crop: 'Papaya', keywords: ['papaya', 'papita', 'पपीता'] },
  { crop: 'Cashew', keywords: ['cashew', 'kaju', 'काजू'] },
  { crop: 'Cassava', keywords: ['cassava', 'tapioca', 'कसावा'] },
  { crop: 'Apple', keywords: ['apple', 'apples', 'seb', 'saeb', 'सेब'] },
  { crop: 'Grape', keywords: ['grape', 'grapes', 'angur', 'angoor', 'अंगूर'] },
  { crop: 'Pepper (Bell)', keywords: ['pepper', 'bell pepper', 'capsicum', 'shimla mirch', 'mirch', 'मिर्च', 'शिमला मिर्च'] },
  { crop: 'Cherry', keywords: ['cherry', 'cherries', 'चेरी'] },
  { crop: 'Orange', keywords: ['orange', 'oranges', 'santra', 'narangi', 'संतरा', 'नारंगी'] },
  { crop: 'Peach', keywords: ['peach', 'peaches', 'aadu', 'aadoo', 'आड़ू'] },
  { crop: 'Strawberry', keywords: ['strawberry', 'strawberries', 'स्ट्रॉबेरी'] },
  { crop: 'Squash', keywords: ['squash', 'kaddu', 'kashiphal', 'कद्दू'] },
  { crop: 'Soybean', keywords: ['soybean', 'soya bean', 'soya', 'सोयाबीन'] },
  { crop: 'Blueberry', keywords: ['blueberry', 'blueberries', 'ब्लूबेरी'] },
  { crop: 'Raspberry', keywords: ['raspberry', 'raspberries', 'रास्पबेरी'] },
  { crop: 'auto', keywords: ['auto', 'automatic', 'detect', 'all', 'सभी', 'खुद', 'स्वचालित', 'कोई भी'] },
]

export default function CropCombobox({ value, onChange, crops = [], disabled = false }) {
  const { t, lang } = useT()
  const { showToast } = useApp()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [voiceNotice, setVoiceNotice] = useState('')

  const containerRef = useRef(null)
  const inputRef = useRef(null)
  const recognitionRef = useRef(null)

  const isAuto = value === 'auto'
  const displayValue = isAuto ? t('detect.autoCrop') : value

  // Filter crops by typed query
  const filteredCrops = crops.filter((c) =>
    c.toLowerCase().includes(query.trim().toLowerCase())
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  // Clean up speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort()
        } catch {
          // ignore
        }
      }
    }
  }, [])

  const handleSelect = (crop) => {
    onChange(crop)
    setIsOpen(false)
    setQuery('')
  }

  const handleClear = (e) => {
    e.stopPropagation()
    onChange('auto')
    setQuery('')
    if (inputRef.current) inputRef.current.focus()
  }

  // Voice Crop Input handling (Web Speech API)
  const toggleVoice = () => {
    if (disabled) return

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch {
          // ignore
        }
      }
      setIsListening(false)
      setVoiceNotice('')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      showToast(t('detect.voiceNotSupported'), 'error')
      return
    }

    try {
      const recognition = new SpeechRecognition()
      recognitionRef.current = recognition
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN'

      recognition.onstart = () => {
        setIsListening(true)
        setVoiceNotice(t('detect.listening'))
      }

      recognition.onresult = (event) => {
        const spoken = event.results?.[0]?.[0]?.transcript?.trim() || ''
        if (!spoken) return

        const lowerSpoken = spoken.toLowerCase()
        let matchedCrop = null

        // Match against alias dictionary
        for (const item of CROP_ALIASES) {
          if (item.keywords.some((k) => lowerSpoken.includes(k.toLowerCase()))) {
            matchedCrop = item.crop
            break
          }
        }

        // Match against exact crop names
        if (!matchedCrop) {
          const direct = crops.find((c) => lowerSpoken.includes(c.toLowerCase()))
          if (direct) matchedCrop = direct
        }

        if (matchedCrop) {
          handleSelect(matchedCrop)
          const cropDisplay = matchedCrop === 'auto' ? t('detect.autoCrop') : matchedCrop
          showToast(`🎙️ ${t('detect.voiceRecognized')}: ${cropDisplay}`)
        } else {
          // Put recognized words into search box so farmer sees filtered list
          setIsOpen(true)
          setQuery(spoken)
          showToast(`🎙️ "${spoken}"`)
        }
      }

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error)
        setIsListening(false)
        setVoiceNotice('')
      }

      recognition.onend = () => {
        setIsListening(false)
        setTimeout(() => setVoiceNotice(''), 2500)
      }

      recognition.start()
    } catch (err) {
      console.warn('Could not start speech recognition:', err)
      setIsListening(false)
      setVoiceNotice('')
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Container holding Select Crop Combobox and Right-Side Voice Button */}
      <div className="flex items-center gap-2">
        <div
          className={`relative flex flex-1 items-center rounded-xl border bg-white transition shadow-sm ${
            disabled
              ? 'opacity-60 cursor-not-allowed bg-slate-50 border-slate-200'
              : isOpen
              ? 'border-green-600 ring-2 ring-green-500/20'
              : 'border-slate-300 hover:border-slate-400'
          }`}
        >
          <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            disabled={disabled}
            value={isOpen ? query : displayValue}
            onFocus={() => {
              if (!disabled) {
                setIsOpen(true)
                setQuery(isAuto ? '' : value)
              }
            }}
            onChange={(e) => {
              setQuery(e.target.value)
              if (!isOpen) setIsOpen(true)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setIsOpen(false)
                setQuery('')
              } else if (e.key === 'Enter') {
                e.preventDefault()
                if (filteredCrops.length > 0) {
                  handleSelect(filteredCrops[0])
                } else if (!query.trim()) {
                  handleSelect('auto')
                }
              }
            }}
            placeholder={t('detect.cropSearchPlaceholder')}
            className="w-full rounded-xl py-2.5 pl-10 pr-16 text-sm text-slate-800 placeholder-slate-400 outline-none bg-transparent"
            aria-label="Select or type crop"
          />

          <div className="absolute right-2 flex items-center gap-1">
            {!isAuto && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="grid h-6 w-6 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                title="Reset to Auto-detect"
                aria-label="Clear selected crop"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              type="button"
              disabled={disabled}
              onClick={() => {
                if (!disabled) {
                  setIsOpen(!isOpen)
                  if (!isOpen) {
                    inputRef.current?.focus()
                    setQuery(isAuto ? '' : value)
                  }
                }
              }}
              className="grid h-7 w-7 place-items-center rounded-lg text-slate-500 hover:bg-slate-100"
              aria-label="Toggle crop dropdown"
            >
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Voice Microphone Button at Right Side of Select Crop */}
        <button
          type="button"
          onClick={toggleVoice}
          disabled={disabled}
          title={isListening ? t('detect.listening') : t('detect.speakCrop')}
          aria-label={t('detect.speakCrop')}
          className={`relative grid h-11 w-11 shrink-0 place-items-center rounded-xl border transition shadow-sm ${
            disabled
              ? 'opacity-50 cursor-not-allowed bg-slate-100 border-slate-200 text-slate-400'
              : isListening
              ? 'bg-red-500 text-white border-red-600 ring-4 ring-red-200 animate-pulse'
              : 'bg-white text-slate-600 border-slate-300 hover:border-green-600 hover:text-green-700 hover:bg-green-50'
          }`}
        >
          {isListening ? (
            <>
              <span className="absolute inset-0 rounded-xl bg-red-400 opacity-60 animate-ping" />
              <MicOff className="relative h-5 w-5" />
            </>
          ) : (
            <Mic className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Voice listening status indicator banner */}
      {voiceNotice && (
        <div className="mt-1.5 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-800 border border-green-200 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          <span>{voiceNotice}</span>
        </div>
      )}

      {/* Dropdown list */}
      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-xl ring-1 ring-black/5 animate-fade-in">
          {/* Auto-detect option */}
          <button
            type="button"
            onClick={() => handleSelect('auto')}
            className={`flex w-full items-center justify-between px-3.5 py-2.5 text-left text-sm transition ${
              isAuto ? 'bg-green-50 font-semibold text-green-700' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>{t('detect.autoCrop')}</span>
            {isAuto && <Check className="h-4 w-4 text-green-600" />}
          </button>

          <div className="my-1 border-t border-slate-100" />

          {/* Filtered crop list */}
          {filteredCrops.length > 0 ? (
            filteredCrops.map((cropName) => {
              const isSelected = value?.toLowerCase() === cropName.toLowerCase()
              return (
                <button
                  key={cropName}
                  type="button"
                  onClick={() => handleSelect(cropName)}
                  className={`flex w-full items-center justify-between px-3.5 py-2.5 text-left text-sm transition ${
                    isSelected ? 'bg-green-50 font-semibold text-green-700' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{cropName}</span>
                  {isSelected && <Check className="h-4 w-4 text-green-600" />}
                </button>
              )
            })
          ) : (
            <div className="px-3.5 py-3 text-center text-xs text-slate-500">
              No crop found matching &quot;{query}&quot;. Try speaking the name or choose Auto-detect.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
