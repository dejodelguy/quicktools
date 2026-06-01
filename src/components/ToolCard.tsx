import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'

interface ToolCardProps {
  title: string
  description: string
  path: string
  icon: LucideIcon
  featured?: boolean
}

export default function ToolCard({ title, description, path, icon: Icon, featured }: ToolCardProps) {
  return (
    <Link
      to={path}
      className={`group block bg-white rounded-xl border transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
        featured
          ? 'border-blue-200 shadow-md ring-1 ring-blue-100'
          : 'border-gray-200 shadow-sm hover:border-blue-200'
      }`}
    >
      <div className="p-6">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors ${
          featured ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
        }`}>
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {description}
        </p>
        {featured && (
          <span className="inline-block mt-3 text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
            ⭐ Popular
          </span>
        )}
      </div>
    </Link>
  )
}
