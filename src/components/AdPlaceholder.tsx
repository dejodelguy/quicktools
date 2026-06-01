interface AdPlaceholderProps {
  size?: 'leaderboard' | 'medium-rectangle' | 'banner'
  className?: string
}

const sizes = {
  leaderboard: { width: '728px', height: '90px', label: '728 × 90' },
  'medium-rectangle': { width: '300px', height: '250px', label: '300 × 250' },
  banner: { width: '468px', height: '60px', label: '468 × 60' },
}

export default function AdPlaceholder({ size = 'leaderboard', className = '' }: AdPlaceholderProps) {
  const s = sizes[size]

  return (
    <div className={`flex justify-center my-6 ${className}`}>
      <div
        className="border border-dashed border-gray-300 bg-gray-50 rounded-lg flex flex-col items-center justify-center text-gray-400 max-w-full overflow-hidden"
        style={{ width: s.width, height: s.height }}
        data-ad-slot="placeholder"
        data-ad-format={size}
      >
        <span className="text-xs font-medium uppercase tracking-wider">Advertisement</span>
        <span className="text-[10px] mt-1">{s.label}</span>
      </div>
    </div>
  )
}
