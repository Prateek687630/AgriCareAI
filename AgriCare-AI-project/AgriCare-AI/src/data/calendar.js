// General sowing and harvesting windows for central/north India. Months are 0-indexed
// (0 = January). Local timing varies with region, variety and rainfall.

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const SEASONS = {
  Kharif: 'Monsoon crops – sown with the onset of rains (June–July), harvested in autumn.',
  Rabi: 'Winter crops – sown after the monsoon (October–December), harvested in spring.',
  Zaid: 'Short summer crops – grown between Rabi and Kharif (February–June) with irrigation.',
  Annual: 'Long-duration crops that occupy the field for most of the year.',
}

export const CALENDAR = [
  { crop: 'Rice (Paddy)', season: 'Kharif', sow: [5, 6], harvest: [9, 10], duration: '120–150 days', note: 'Transplant 25–30 day old seedlings.' },
  { crop: 'Maize', season: 'Kharif', sow: [5, 6], harvest: [8, 9], duration: '90–110 days', note: 'Ensure drainage – maize cannot stand waterlogging.' },
  { crop: 'Soybean', season: 'Kharif', sow: [5, 6], harvest: [8, 9], duration: '90–110 days', note: 'Sow after 100 mm of monsoon rain. Treat seed with Rhizobium.' },
  { crop: 'Cotton', season: 'Kharif', sow: [4, 5], harvest: [9, 10, 11], duration: '150–180 days', note: 'Pick cotton in multiple rounds as bolls open.' },
  { crop: 'Groundnut', season: 'Kharif', sow: [5, 6], harvest: [9, 10], duration: '100–130 days', note: 'Apply gypsum at flowering for good pod filling.' },
  { crop: 'Wheat', season: 'Rabi', sow: [10, 11], harvest: [2, 3], duration: '120–150 days', note: 'Timely sowing in November gives the best yield.' },
  { crop: 'Chickpea (Gram)', season: 'Rabi', sow: [9, 10], harvest: [1, 2], duration: '100–120 days', note: 'Usually needs only 1–2 irrigations.' },
  { crop: 'Mustard', season: 'Rabi', sow: [9, 10], harvest: [1, 2], duration: '110–140 days', note: 'Watch for aphids in December–January.' },
  { crop: 'Potato', season: 'Rabi', sow: [9, 10], harvest: [0, 1, 2], duration: '90–120 days', note: 'Spray against late blight in cool, cloudy weather.' },
  { crop: 'Tomato', season: 'Rabi', sow: [9, 10], harvest: [0, 1, 2], duration: '90–120 days', note: 'Transplant seedlings; stake plants for better fruit.' },
  { crop: 'Onion', season: 'Rabi', sow: [11, 0], harvest: [3, 4], duration: '120–150 days', note: 'Stop irrigation 10–15 days before harvest.' },
  { crop: 'Watermelon', season: 'Zaid', sow: [1, 2], harvest: [4, 5], duration: '80–100 days', note: 'Grow on sandy loam river beds or with drip.' },
  { crop: 'Moong (Green gram)', season: 'Zaid', sow: [2, 3], harvest: [4, 5], duration: '60–75 days', note: 'Short crop that also improves soil nitrogen.' },
  { crop: 'Cucumber', season: 'Zaid', sow: [1, 2], harvest: [3, 4], duration: '50–70 days', note: 'Harvest fruits young and tender.' },
  { crop: 'Sugarcane', season: 'Annual', sow: [1, 2], harvest: [11, 0], duration: '10–12 months', note: 'Spring planting; harvest the next winter.' },
]

// Growing months = months between the last sowing month and the first harvest month
export function monthStatus(entry, m) {
  if (entry.sow.includes(m)) return 'sow'
  if (entry.harvest.includes(m)) return 'harvest'
  let cur = (entry.sow[entry.sow.length - 1] + 1) % 12
  while (cur !== entry.harvest[0]) {
    if (cur === m) return 'grow'
    cur = (cur + 1) % 12
  }
  return null
}
