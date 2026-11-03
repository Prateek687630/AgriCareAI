export const FARMING_TIPS = [
  'Get your soil tested every 2–3 years and apply fertilizer based on the soil health card.',
  'Inspect the underside of leaves – many pests and fungal spores hide there.',
  'Spray pesticides in the early morning or late evening when the wind is calm.',
  'Always read the product label and wear gloves and a mask while spraying.',
  'Rotate crops from different families to break disease and pest cycles.',
  'Remove and destroy diseased plant parts – do not leave them in the field.',
  'Drip irrigation saves water and keeps leaves dry, reducing fungal diseases.',
  'Use yellow sticky traps to monitor whiteflies and aphids early.',
  'Add farmyard manure or compost to improve soil structure and water holding.',
  'Take clear, close-up, daylight photos of a single leaf for the best diagnosis.',
]

export const tipOfTheDay = () => {
  const day = Math.floor(Date.now() / 86_400_000)
  return FARMING_TIPS[day % FARMING_TIPS.length]
}
