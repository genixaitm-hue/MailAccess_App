import React, { useState, useEffect } from 'react'
import {
  Search,
  Key,
  Globe,
  History,
  Activity,
  CheckCircle2,
  XCircle,
  X,
  Command
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'

interface QuickActionsModalProps {
  isOpen: boolean
  onClose: () => void
  onOpenKeyManager: () => void
  onOpenHarvestModal: () => void
}

export default function QuickActionsModal({
  isOpen,
  onClose,
  onOpenKeyManager,
  onOpenHarvestModal
}: QuickActionsModalProps) {
  const [query, setQuery] = useState('')
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isOpen) return
    api.health().then(online => setBackendOnline(online)).catch(() => setBackendOnline(false))

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const actions = [
    {
      id: 'investigate',
      title: 'New OSINT Investigation',
      desc: 'Scan email target across 2500+ platforms & breach engines',
      icon: Search,
      badge: 'Email',
      action: () => {
        onClose()
        navigate('/')
      }
    },
    {
      id: 'harvest',
      title: 'Harvest Domain Emails',
      desc: 'Discover org emails from CT logs, GitHub, CC, & web dorks',
      icon: Globe,
      badge: 'Domain',
      action: () => {
        onClose()
        onOpenHarvestModal()
      }
    },
    {
      id: 'history',
      title: 'View Investigation History',
      desc: 'Access saved target profile graphs, exposure scores, and logs',
      icon: History,
      badge: 'Database',
      action: () => {
        onClose()
        navigate('/history')
      }
    },
    {
      id: 'keys',
      title: 'Manage API Keys & Tokens',
      desc: 'Configure HIBP, Hunter.io, VirusTotal, and platform credentials',
      icon: Key,
      badge: 'Settings',
      action: () => {
        onClose()
        onOpenKeyManager()
      }
    }
  ]

  const filtered = actions.filter(
    a => a.title.toLowerCase().includes(query.toLowerCase()) || a.desc.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in-up">
      <div className="bg-zinc-900 border border-zinc-700/80 rounded-xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col">
        {/* Header Search */}
        <div className="px-4 py-3.5 border-b border-zinc-800 flex items-center gap-3 bg-zinc-950/50">
          <Command className="w-5 h-5 text-cyan-400" />
          <input
            type="text"
            placeholder="Search desktop action, shortcut, or task..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none font-mono"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono text-zinc-400 bg-zinc-800 border border-zinc-700 rounded">
            ESC
          </kbd>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-200 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Actions List */}
        <div className="p-2 space-y-1 max-h-[380px] overflow-y-auto">
          {filtered.map(item => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={item.action}
                className="w-full text-left p-3 rounded-lg hover:bg-zinc-800/80 border border-transparent hover:border-zinc-700/60 transition-all group flex items-start gap-3.5"
              >
                <div className="p-2.5 rounded-md bg-zinc-800/60 border border-zinc-700/40 text-cyan-400 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-zinc-200 group-hover:text-cyan-300 font-mono transition-colors">
                      {item.title}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-mono bg-zinc-800 border border-zinc-700/60 text-zinc-400">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5 truncate">{item.desc}</p>
                </div>
              </button>
            )
          })}

          {filtered.length === 0 && (
            <div className="py-12 text-center text-zinc-500 text-xs font-mono">
              No matching actions found
            </div>
          )}
        </div>

        {/* Footer Status */}
        <div className="px-4 py-2.5 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Desktop Engine API:</span>
            {backendOnline === true ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Connected (localhost:8000)
              </span>
            ) : backendOnline === false ? (
              <span className="text-amber-400 flex items-center gap-1">
                <XCircle className="w-3 h-3" /> Offline / Standalone mode
              </span>
            ) : (
              <span className="text-zinc-400">Checking...</span>
            )}
          </div>
          <span className="text-zinc-600 text-[11px]">v0.14.3 Desktop GUI</span>
        </div>
      </div>
    </div>
  )
}
