// Live weather from Open-Meteo (free, no API key). Only the place name from the farmer's
// profile is sent. Results are cached for 30 minutes in sessionStorage.

const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'
const CACHE_MS = 30 * 60 * 1000

// WMO weather codes -> label + icon key
export function describeWeather(code) {
  if (code === 0) return { label: 'Clear sky', icon: 'sun' }
  if (code <= 2) return { label: 'Partly cloudy', icon: 'cloud-sun' }
  if (code === 3) return { label: 'Overcast', icon: 'cloud' }
  if (code === 45 || code === 48) return { label: 'Fog', icon: 'fog' }
  if (code >= 51 && code <= 57) return { label: 'Drizzle', icon: 'drizzle' }
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return { label: 'Rain', icon: 'rain' }
  if (code >= 71 && code <= 77) return { label: 'Snow', icon: 'snow' }
  if (code >= 95) return { label: 'Thunderstorm', icon: 'storm' }
  return { label: 'Cloudy', icon: 'cloud' }
}

async function getJSON(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Weather service error (${res.status})`)
  return res.json()
}

async function geocode(name) {
  const q = new URLSearchParams({ name, count: '1', language: 'en', format: 'json', countryCode: 'IN' })
  const json = await getJSON(`${GEOCODE_URL}?${q}`)
  return json.results?.[0] ?? null
}

export async function getWeather(places) {
  const tries = places.filter(Boolean)
  const cacheKey = `agricare:weather:${tries.join('|')}`
  try {
    const cached = JSON.parse(sessionStorage.getItem(cacheKey))
    if (cached && Date.now() - cached.at < CACHE_MS) return cached.data
  } catch {
    // ignore bad cache
  }

  let place = null
  for (const name of tries) {
    place = await geocode(name)
    if (place) break
  }
  if (!place) throw new Error('Location not found. Update your district in Profile.')

  const q = new URLSearchParams({
    latitude: place.latitude,
    longitude: place.longitude,
    current: 'temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max',
    timezone: 'auto',
    forecast_days: '5',
  })
  const json = await getJSON(`${FORECAST_URL}?${q}`)

  const data = {
    place: [place.name, place.admin1].filter(Boolean).join(', '),
    current: {
      temp: json.current.temperature_2m,
      humidity: json.current.relative_humidity_2m,
      rain: json.current.precipitation,
      wind: json.current.wind_speed_10m,
      code: json.current.weather_code,
    },
    daily: json.daily.time.map((date, i) => ({
      date,
      code: json.daily.weather_code[i],
      max: json.daily.temperature_2m_max[i],
      min: json.daily.temperature_2m_min[i],
      rain: json.daily.precipitation_sum[i],
      rainChance: json.daily.precipitation_probability_max[i],
    })),
  }
  try {
    sessionStorage.setItem(cacheKey, JSON.stringify({ at: Date.now(), data }))
  } catch {
    // storage full / unavailable - skip caching
  }
  return data
}

/**
 * Turns weather into simple farm advice. Fungal diseases (blights, mildews, rusts) spread
 * fastest in humid, mild weather, so humidity + temperature give a disease-risk level.
 */
export function cropAdvisory({ current, daily }) {
  const { humidity, temp, wind } = current
  const rainNext3 = daily.slice(0, 3).reduce((s, d) => s + (d.rain ?? 0), 0)
  const rainChanceToday = daily[0]?.rainChance ?? 0
  const advice = []

  let risk = 'Low'
  if (humidity >= 80 && temp >= 15 && temp <= 30) risk = 'High'
  else if (humidity >= 65 || (rainNext3 > 10 && temp >= 15 && temp <= 32)) risk = 'Moderate'

  if (risk === 'High')
    advice.push('High humidity favours blight and leaf-spot diseases. Scout fields daily and avoid overhead irrigation.')
  else if (risk === 'Moderate') advice.push('Moderate disease risk. Check the underside of leaves for early spots or mold.')
  else advice.push('Low fungal disease risk under current weather.')

  if (wind > 15 || rainChanceToday > 60)
    advice.push('Not a good day for spraying – wind or rain may wash off or drift the spray.')
  else advice.push('Good conditions for spraying in the early morning or evening.')

  if (rainNext3 >= 10) advice.push(`About ${Math.round(rainNext3)} mm rain expected in 3 days – delay irrigation and fertilizer top-dressing.`)
  else if (temp >= 35) advice.push('High temperature – irrigate in the evening and mulch to save soil moisture.')

  return { risk, advice }
}
