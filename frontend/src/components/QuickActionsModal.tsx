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
import { useLanguage } from '../context/LanguageContext'

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
  const { t, isRtl } = useLanguage()
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
      title: t.actionNewInvestigationTitle,
      desc: t.actionNewInvestigationDesc,
      icon: Search,
      badge: t.badgeEmail,
      action: () => {
        onClose()
        navigate('/')
      }
    },
    {
      id: 'harvest',
      title: t.actionHarvestTitle,
      desc: t.actionHarvestDesc,
      icon: Globe,
      badge: t.badgeDomain,
      action: () => {
        onClose()
        onOpenHarvestModal()
      }
    },
    {
      id: 'history',
      title: t.actionHistoryTitle,
      desc: t.actionHistoryDesc,
      icon: History,
      badge: t.badgeDb,
      action: () => {
        onClose()
        navigate('/history')
      }
    },
    {
      id: 'keys',
      title: t.actionKeysTitle,
      desc: t.actionKeysDesc,
      icon: Key,
      badge: t.badgeSettings,
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
    <div className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-xl flex items-center justify-center p-4 animate-spring-in ${
      isRtl ? 'rtl' : 'ltr'
    }`}>
      <div className="apple-card border border-white/10 rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col">
        {/* Header Search */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3 bg-zinc-950/60">
          <Command className="w-5 h-5 text-sky-400" />
          <input
            type="text"
            placeholder={t.searchActionsPlaceholder}
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none font-sans"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono text-zinc-400 bg-white/10 border border-white/10 rounded-md">
            ESC
          </kbd>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Actions List */}
        <div className="p-3 space-y-1.5 max-h-[380px] overflow-y-auto">
          {filtered.map(item => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={item.action}
                className="w-full text-left p-3.5 rounded-2xl hover:bg-white/10 border border-transparent hover:border-white/10 transition-all group flex items-start gap-4 apple-pill"
              >
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-sky-400 group-hover:bg-sky-500/20 group-hover:scale-105 transition-all">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-white group-hover:text-sky-300 transition-colors">
                      {item.title}
                    </span>
                    <span className="text-[10px] font-semibold tracking-wider px-2.5 py-0.5 rounded-full bg-white/10 text-zinc-300">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 truncate">{item.desc}</p>
                </div>
              </button>
            )
          })}

          {filtered.length === 0 && (
            <div className="py-12 text-center text-zinc-500 text-xs font-sans">
              {t.noActionsFound}
            </div>
          )}
        </div>

        {/* Footer Status */}
        <div className="px-5 py-3 bg-zinc-950/80 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-400 animate-pulse" />
            <span>Desktop Engine API:</span>
            {backendOnline === true ? (
              <span className="text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> {t.engineOnline}
              </span>
            ) : backendOnline === false ? (
              <span className="text-amber-400 flex items-center gap-1 font-medium">
                <XCircle className="w-3.5 h-3.5" /> {t.offlineMode}
              </span>
            ) : (
              <span className="text-zinc-500">{t.connecting}</span>
            )}
          </div>
          <span className="text-zinc-500 text-[11px]">v0.14.3 macOS GUI</span>
        </div>
      </div>
    </div>
  )
}
