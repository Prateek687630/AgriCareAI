# AgriCare AI – AI-Powered Farmer Assistance Application

B.Tech Minor Project – Report 1 (Frontend Prototype + Base Paper Study)
Department of CSE, IIIT Bhopal · Guide: Dr. Sonal Telang Chandel · Team: Prateek, Sumeet

## Tech stack

| Part        | Technology                                |
| ----------- | ----------------------------------------- |
| Frontend    | React 18 + Vite + HTML                    |
| Styling     | Tailwind CSS                              |
| Language    | JavaScript                                |
| Icons       | Lucide React                              |
| Routing     | React Router                              |
| AI model    | MobileNetV2 CNN (ONNX Runtime Web)        |
| Data        | Demo data, saved in localStorage          |

## Run the project

```bash
npm install      # first time only
npm run dev      # opens http://localhost:5173
npm run build    # production build into dist/
npm run preview  # serve the production build
```

Requires Node.js 18 or newer.

## Modules

| Page | What it does |
| --- | --- |
| **Home** | Project introduction, features, detection workflow (Plant Image → Preprocessing → CNN → Result), base-paper highlights |
| **Dashboard** | Greeting, statistics, module shortcuts, recent activity, tip of the day |
| **Disease Detection** | Crop selection, drag-and-drop / camera upload, preview, step-by-step analysis, diagnosis with confidence, other possibilities, symptoms / management / prevention, recommended products. Every result is saved to My Reports |
| **Soil & Fertilizer** | Crop, area (acre/ha), N, P, K, pH inputs with validation → soil status, Urea/DAP/MOP quantities, bags and cost, application schedule, pH advice |
| **Agri Store** | 19 demo products, search, category filter, sorting, cart drawer, checkout with validation (demo order, no payment) |
| **My Reports** | Diagnosis and fertilizer history, filter, search, detail view, print, download as .txt, delete |
| **Profile** | Editable farmer and farm information, stats, recent orders, reset demo data |
| **About** | Problem, objectives, base paper summary, tech stack, scope, future scope, references |

### Additional features (beyond the Report 1 plan)

| Feature | Details |
| --- | --- |
| **Hindi / English toggle** | Button in the top bar. Menus, page headings and main buttons switch to Hindi, and the choice is remembered (`src/i18n/`) |
| **Weather & crop advisory** | Dashboard card with live 5-day weather for the profile's district from Open-Meteo (free, no API key), plus fungal-disease risk, spraying and irrigation advice |
| **Photo quality check** | Brightness and sharpness (variance of the Laplacian) warn about dark, overexposed or blurry photos |
| **Listen** | Reads the diagnosis aloud with the browser's speech engine |
| **Disease Library** | All 38 classes with search and crop/type filters. Each disease has its own shareable link |
| **Crop Calendar** | Kharif / Rabi / Zaid sowing–growing–harvest chart, plus "sow / harvest this month" |
| **Help & Support** | Kisan Call Centre (1800-180-1551), Soil Health Card portal, FAQ, feedback form |
| **Share report** | Uses the phone's share menu, or WhatsApp on desktop |
| **Crop health chart** | Healthy vs diseased scans per crop on the Dashboard |

Only the weather card needs internet. Everything else runs entirely in the browser.

## How the disease detection works

A real CNN runs entirely in the browser (`src/services/diseaseService.js`), with no server and no API key:

1. **Model** – MobileNetV2 trained on the PlantVillage dataset (all 38 classes of the base paper, 14 crops).
   File: `public/models/plant-disease-mobilenetv2.onnx` (9 MB, Apache-2.0, from the
   [`m3r1al/verdant-plant-model`](https://huggingface.co/m3r1al/verdant-plant-model) bundle, derived from
   [`linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification`](https://huggingface.co/linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification)).
   It is executed with [ONNX Runtime Web](https://onnxruntime.ai/) (WebAssembly).
2. **Preprocessing** – shortest edge resized to 256, centre crop 224×224, RGB scaled to [-1, 1].
3. **Prediction** – softmax over the 38 classes. If a crop is selected, only that crop's classes are kept, and the app warns when the leaf looks like a different crop.
4. **Uncertain results** – below 55% confidence the result is shown as *Uncertain – best guess*. This happens for unclear photos and for plants the model was never trained on.
5. **Image analysis** – leaf coverage, yellowing, lesions and photo quality (brightness, sharpness) are measured separately and shown as warnings.

Tested on 114 PlantVillage photos (3 per class): 108–109 correct (~95%). As the base paper found, accuracy is lower on real field photos with busy backgrounds. Photograph a single leaf, filling the frame, on a plain background.

### Connecting a server model (optional)

Create a `.env` file:

```
VITE_API_URL=http://localhost:8000
```

The app will then send `POST /predict` (multipart: `image`, `crop`) and expects:

```json
{ "classId": "tomato-early-blight", "confidence": 93.1,
  "top": [{ "classId": "tomato-early-blight", "confidence": 93.1 }, ...] }
```

The class IDs are listed in `src/data/diseases.js`. No UI changes are needed.

## Fertilizer logic

Soil ratings (kg/ha): N Low < 280 < Medium ≤ 560 < High · P Low < 10 < Medium ≤ 25 < High · K Low < 108 < Medium ≤ 280 < High.
The recommended dose (RDF) of the crop is adjusted by +25% for Low, 0% for Medium and −25% for High. Nutrients are then converted to products: DAP (18:46:0) covers P₂O₅ first, Urea (46% N) covers the remaining N, and MOP (60% K₂O) covers K₂O.

## Folder structure

```
src/
  components/   Navbar, Footer, Layout, Modal, Toasts, PageHeader, ProductCard, DiseaseInfo, FertilizerResult
  context/      AppContext (profile, reports, cart, orders, toasts, saved to localStorage)
  i18n/         English/Hindi strings + LanguageContext
  data/         diseases, products, crops (fertilizer doses), calendar, tips, seed demo data
  services/     diseaseService (preprocessing + quality + model), fertilizerService, weatherService
  pages/        Home, Dashboard, DiseaseDetection, SoilFertilizer, AgriStore, Reports, Profile,
                DiseaseLibrary, CropCalendar, Help, About, NotFound
  utils/        storage, formatting helpers
```

> Disclaimer: this is a prototype. Diagnoses and recommendations are for guidance only. Consult a local agriculture expert or KVK before applying any treatment.
