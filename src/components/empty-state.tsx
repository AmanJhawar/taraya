import { FolderOpen } from 'lucide-react'
import { ReactNode } from 'react'

export function EmptyState({ 
  title, 
  description, 
  icon = <FolderOpen size={32} strokeWidth={1} />,
  action
}: { 
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-[fadeInUp_400ms_var(--ease-out)_forwards]">
      <div className="w-16 h-16 bg-band border border-line rounded-xl flex items-center justify-center text-muted mb-6 shadow-sm">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-ink tracking-tight mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted max-w-sm mx-auto leading-relaxed mb-6">
          {description}
        </p>
      )}
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  )
}
