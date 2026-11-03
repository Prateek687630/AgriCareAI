import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Dashboard from './pages/Dashboard.jsx'
import DiseaseDetection from './pages/DiseaseDetection.jsx'
import SoilFertilizer from './pages/SoilFertilizer.jsx'
import AgriStore from './pages/AgriStore.jsx'
import Reports from './pages/Reports.jsx'
import Profile from './pages/Profile.jsx'
import About from './pages/About.jsx'
import DiseaseLibrary from './pages/DiseaseLibrary.jsx'
import CropCalendar from './pages/CropCalendar.jsx'
import Help from './pages/Help.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/disease-detection" element={<DiseaseDetection />} />
        <Route path="/soil-fertilizer" element={<SoilFertilizer />} />
        <Route path="/store" element={<AgriStore />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/disease-library" element={<DiseaseLibrary />} />
        <Route path="/crop-calendar" element={<CropCalendar />} />
        <Route path="/help" element={<Help />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
