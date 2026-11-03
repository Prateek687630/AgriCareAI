// General recommended fertilizer doses (RDF) in kg/ha of N - P2O5 - K2O.
// Values are indicative averages of common state-university recommendations;
// actual doses vary by region, variety and season.

export const FERTILIZER_CROPS = [
  { name: 'Rice (Paddy)', n: 120, p: 60, k: 40, ph: [5.5, 7.0], splits: 'cereal', zinc: true },
  { name: 'Wheat', n: 120, p: 60, k: 40, ph: [6.0, 7.5], splits: 'cereal', zinc: true },
  { name: 'Maize', n: 150, p: 60, k: 40, ph: [5.8, 7.5], splits: 'cereal', zinc: true },
  { name: 'Soybean', n: 20, p: 60, k: 40, ph: [6.0, 7.5], splits: 'legume' },
  { name: 'Chickpea (Gram)', n: 20, p: 40, k: 20, ph: [6.0, 8.0], splits: 'legume' },
  { name: 'Mustard', n: 80, p: 40, k: 40, ph: [6.0, 7.5], splits: 'two' },
  { name: 'Cotton', n: 100, p: 50, k: 50, ph: [6.0, 8.0], splits: 'cereal' },
  { name: 'Sugarcane', n: 250, p: 115, k: 115, ph: [6.5, 7.5], splits: 'cereal' },
  { name: 'Tomato', n: 120, p: 60, k: 60, ph: [6.0, 7.0], splits: 'cereal' },
  { name: 'Potato', n: 150, p: 80, k: 100, ph: [5.0, 6.5], splits: 'two' },
  { name: 'Onion', n: 100, p: 50, k: 50, ph: [6.0, 7.5], splits: 'two' },
]

export const getCropByName = (name) => FERTILIZER_CROPS.find((c) => c.name === name)
