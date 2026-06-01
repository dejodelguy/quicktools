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
    <Link to={path} className={`tool-card ${featured ? 'featured' : ''}`}>
      <div className="tool-card-icon">
        <Icon size={20} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </Link>
  )
}
