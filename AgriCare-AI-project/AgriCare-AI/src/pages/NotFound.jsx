import { Link } from 'react-router-dom'
import { Home, Sprout } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-center py-24 text-center">
      <Sprout className="h-16 w-16 text-green-600" />
      <h1 className="mt-4 text-4xl font-extrabold text-slate-900">Page not found</h1>
      <p className="mt-2 text-slate-600">The page you are looking for doesn’t exist or has been moved.</p>
      <Link to="/" className="btn-primary mt-6">
        <Home className="h-4 w-4" /> Back to home
      </Link>
    </div>
  )
}
