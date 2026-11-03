import { BookOpen, CheckCircle2, Code2, GraduationCap, Info, Rocket, Sparkles, Target } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'

const OBJECTIVES = [
  'Build a simple farmer-friendly frontend',
  'Provide plant-image upload and preview',
  'Demonstrate AI disease diagnosis with a trained CNN (PlantVillage, 38 classes)',
  'Provide a frontend for soil and fertilizer recommendations',
  'Provide a prototype agricultural marketplace',
  'Prepare the architecture for future AI, backend and database integration',
]

const KEY_POINTS = [
  ['Objective', 'Automatically identify plant diseases from leaf images using deep learning.'],
  ['Dataset', '54,306 images of healthy and diseased leaves (PlantVillage).'],
  ['Coverage', '14 crop species and 26 diseases / healthy conditions – 38 classes.'],
  ['Model', 'A deep convolutional neural network trained for image classification.'],
  ['Reported result', 'About 99.35% accuracy on held-out test images.'],
  ['Limitation', 'Performance dropped substantially on images taken under different real-world conditions.'],
  ['Significance', 'Demonstrated the potential of smartphone-assisted plant disease diagnosis.'],
  ['Lesson for us', 'Our future model must be evaluated on diverse field images, not only controlled images.'],
]

const STACK = [
  ['Frontend', 'React + Vite + HTML'],
  ['Styling', 'Tailwind CSS'],
  ['Language', 'JavaScript'],
  ['Icons', 'Lucide React'],
  ['Routing', 'React Router'],
  ['AI model', 'MobileNetV2 CNN trained on PlantVillage, run in the browser with ONNX Runtime Web'],
  ['Current data', 'Demo data (browser localStorage)'],
  ['Future backend', 'API + database + trained AI model'],
]

const MODULES = [
  ['Home', 'Project introduction and feature access'],
  ['Dashboard', 'Disease Detection, Soil & Fertilizer, Agri Store and Reports'],
  ['Disease Detection', 'Image upload, preview and CNN diagnosis'],
  ['Soil & Fertilizer', 'Crop, area, N, P, K and pH inputs with recommendation'],
  ['Agri Store', 'Demo agricultural products with cart & checkout'],
  ['My Reports', 'Diagnosis and fertilizer plan history'],
  ['Profile', 'Farmer information'],
]

const EXTRAS = [
  ['Hindi / English toggle', 'Menus, headings and main buttons in Hindi – first step towards regional languages'],
  ['Weather & disease risk', 'Live 5-day weather for the farmer’s district with fungal-risk, spraying and irrigation advice'],
  ['Photo quality check', 'Brightness and sharpness (Laplacian variance) check warns about dark or blurry photos'],
  ['Listen to result', 'Diagnosis read aloud using the browser’s speech engine for low-literacy users'],
  ['Disease Library', 'All 38 PlantVillage classes with symptoms, management and prevention'],
  ['Crop Calendar', 'Kharif, Rabi and Zaid sowing / harvest chart with “sow this month” suggestions'],
  ['Share reports', 'Send a report via WhatsApp or the phone share menu, print or download it'],
  ['Help & Support', 'Kisan Call Centre, Soil Health Card portal, FAQ and feedback form'],
]

const FUTURE = [
  'Trained CNN model on real-field image datasets',
  'Farmer authentication',
  'Soil-test-based recommendations from lab data',
  'Full content in Hindi & regional languages',
  'Weather-based SMS / push alerts',
  'Agricultural product ordering & payments',
  'Administrator dashboard',
]

export default function About() {
  return (
    <>
      <PageHeader
        icon={Info}
        title="About the Project"
        subtitle="AgriCare AI – AI-Powered Farmer Assistance Application. B.Tech Minor Project, Report 1: Frontend Prototype + Base Paper Study."
      />

      <div className="container-page space-y-6 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <Section icon={GraduationCap} title="Project details" className="lg:col-span-1">
            <dl className="space-y-3 text-sm">
              <Row k="Institute" v="Indian Institute of Information Technology, Bhopal" />
              <Row k="Department" v="Computer Science & Engineering" />
              <Row k="Project" v="Minor Project Report – I" />
              <Row k="Submitted by" v="Prateek, Sumeet" />
              <Row k="Guide" v="Dr. Sonal Telang Chandel" />
            </dl>
          </Section>

          <Section icon={Target} title="Problem & objectives" className="lg:col-span-2">
            <p className="text-sm leading-relaxed text-slate-600">
              Farmers may not have immediate access to crop-disease experts, and manual identification needs time and
              specialised knowledge. A mobile-friendly application can provide preliminary decision support by analysing plant
              photographs and presenting understandable disease information.
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {OBJECTIVES.map((o) => (
                <li key={o} className="flex gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" /> {o}
                </li>
              ))}
            </ul>
          </Section>
        </div>

        <Section icon={BookOpen} title="Base paper">
          <p className="text-sm font-semibold text-slate-800">
            Mohanty, S. P., Hughes, D. P., &amp; Salathé, M. (2016). “Using Deep Learning for Image-Based Plant Disease
            Detection.” Frontiers in Plant Science, 7, 1419.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            The study investigated whether deep learning could automatically recognise healthy and diseased plant leaves from
            images, using the PlantVillage dataset and a deep convolutional neural network.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {KEY_POINTS.map(([k, v]) => (
              <div key={k} className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-green-700">{k}</p>
                <p className="mt-1 text-sm text-slate-700">{v}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 rounded-xl bg-green-50 p-4 text-sm leading-relaxed text-green-900">
            <b>Connection to AgriCare AI:</b> the base paper is the research foundation for our disease-detection module.
            AgriCare AI extends the idea into a broader farmer-assistance platform – connecting the diagnosis to management
            information, soil and nutrient recommendations, report history and an agricultural product section.
          </p>
        </Section>

        <div className="grid gap-6 lg:grid-cols-2">
          <Section icon={Code2} title="Technology stack">
            <dl className="space-y-3 text-sm">
              {STACK.map(([k, v]) => (
                <Row key={k} k={k} v={v} />
              ))}
            </dl>
          </Section>
          <Section icon={Info} title="Report 1 frontend modules">
            <dl className="space-y-3 text-sm">
              {MODULES.map(([k, v]) => (
                <Row key={k} k={k} v={v} />
              ))}
            </dl>
          </Section>
        </div>

        <Section icon={Sparkles} title="Additional features beyond the Report 1 plan">
          <div className="grid gap-3 md:grid-cols-2">
            {EXTRAS.map(([k, v]) => (
              <div key={k} className="rounded-xl bg-green-50 p-4">
                <p className="text-sm font-bold text-green-800">{k}</p>
                <p className="mt-1 text-sm text-slate-700">{v}</p>
              </div>
            ))}
          </div>
        </Section>

        <div className="grid gap-6 lg:grid-cols-2">
          <Section icon={Target} title="Scope of Report 1">
            <p className="text-sm leading-relaxed text-slate-600">
              Only the frontend prototype is implemented at this stage. Real AI inference, backend, database, authentication,
              payment, weather APIs and production deployment are reserved for later reports. The disease service already
              supports switching to a real model server through the <code className="rounded bg-slate-100 px-1">VITE_API_URL</code>{' '}
              setting.
            </p>
          </Section>
          <Section icon={Rocket} title="Future scope">
            <ul className="grid gap-2 sm:grid-cols-2">
              {FUTURE.map((f) => (
                <li key={f} className="flex gap-2 text-sm text-slate-700">
                  <Rocket className="mt-0.5 h-4 w-4 shrink-0 text-green-600" /> {f}
                </li>
              ))}
            </ul>
          </Section>
        </div>

        <Section icon={BookOpen} title="References">
          <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-700">
            <li>
              Mohanty, S. P., Hughes, D. P., &amp; Salathé, M. (2016). Using Deep Learning for Image-Based Plant Disease
              Detection. <i>Frontiers in Plant Science</i>.
            </li>
            <li>
              Pacal, I., Kunduracioglu, I., Alma, M. H., et al. (2024). A systematic review of deep learning techniques for
              plant diseases. <i>Artificial Intelligence Review</i>.
            </li>
          </ol>
        </Section>
      </div>
    </>
  )
}

function Section({ icon: Icon, title, className = '', children }) {
  return (
    <section className={`card p-6 ${className}`}>
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
        <Icon className="h-5 w-5 text-green-600" /> {title}
      </h2>
      {children}
    </section>
  )
}

function Row({ k, v }) {
  return (
    <div className="flex gap-4">
      <dt className="w-32 shrink-0 font-medium text-slate-500">{k}</dt>
      <dd className="text-slate-800">{v}</dd>
    </div>
  )
}
