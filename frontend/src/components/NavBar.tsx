import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Shield,
  Key,
  History,
  Command,
  Globe,
  PlusCircle,
  Activity
} from 'lucide-react'
import { api } from '../api/client'
import ApiKeyManager from './ApiKeyManager'
import QuickActionsModal from './QuickActionsModal'
import DomainHarvestModal from './DomainHarvestModal'

export default function NavBar() {
  const [count, setCount] = useState<number>(0)
  const [showKeyManager, setShowKeyManager] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(false)
  const [showHarvestModal, setShowHarvestModal] = useState(false)
  const [isBackendConnected, setIsBackendConnected] = useState<boolean | null>(null)
  const location = useLocation()

  useEffect(() => {
    api.listInvestigations(1, 1)
      .then(r => {
        setCount(r.total)
        setIsBackendConnected(true)
      })
      .catch(() => {
        setIsBackendConnected(false)
      })
  }, [location.pathname])

  return (
    <>
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md px-4 py-2.5 flex items-center gap-4 flex-shrink-0 font-mono text-sm select-none z-40">
        {/* Brand Logo & Title */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 group-hover:border-cyan-400/50 transition-all shadow-[0_0_12px_rgba(34,211,238,0.25)]">
            <Shield className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-wider text-zinc-100 group-hover:text-cyan-300 transition-colors leading-tight">
              MailAccess
            </span>
            <span className="text-[10px] text-zinc-500 tracking-widest uppercase">
              Desktop OSINT
            </span>
          </div>
        </Link>

        <div className="h-5 w-px bg-zinc-800/80" />

        {/* Navigation Links */}
        <nav className="flex items-center gap-2">
          <Link
            to="/"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-colors ${
              location.pathname === '/'
                ? 'bg-zinc-800 text-cyan-400 border border-zinc-700/60 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            New Scan
          </Link>

          <Link
            to="/history"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-colors ${
              location.pathname === '/history'
                ? 'bg-zinc-800 text-cyan-400 border border-zinc-700/60 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            History
            {count > 0 && (
              <span className="ml-1 text-[10px] bg-zinc-900 border border-zinc-700 text-cyan-400 px-1.5 py-0.2 rounded font-mono leading-tight">
                {count}
              </span>
            )}
          </Link>
        </nav>

        {/* Quick Actions trigger button */}
        <button
          onClick={() => setShowQuickActions(true)}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-md text-xs text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-all"
        >
          <Command className="w-3.5 h-3.5 text-cyan-400" />
          <span>Quick Actions</span>
          <kbd className="text-[10px] bg-zinc-800 px-1.5 py-0.2 rounded border border-zinc-700 text-zinc-400">
            Ctrl+K
          </kbd>
        </button>

        <div className="flex-1" />

        {/* Backend Status Badge */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-900/60 border border-zinc-800 text-xs">
          <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          {isBackendConnected === true ? (
            <span className="text-emerald-400 text-[11px] font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Engine Online
            </span>
          ) : isBackendConnected === false ? (
            <span className="text-amber-400 text-[11px] font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Offline Mode
            </span>
          ) : (
            <span className="text-zinc-500 text-[11px]">Connecting...</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHarvestModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border border-zinc-800 bg-zinc-900 text-zinc-300 rounded-md hover:border-cyan-500/50 hover:text-cyan-300 transition-colors"
            title="Harvest Domain Emails"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            Harvest
          </button>

          <button
            onClick={() => setShowKeyManager(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border border-zinc-800 bg-zinc-900 text-zinc-300 rounded-md hover:border-cyan-500/50 hover:text-cyan-300 transition-colors"
            title="Manage API Keys"
          >
            <Key className="w-3.5 h-3.5 text-cyan-400" />
            API Keys
          </button>
        </div>
      </header>

      {/* Modals */}
      <ApiKeyManager isOpen={showKeyManager} onClose={() => setShowKeyManager(false)} />
      <QuickActionsModal
        isOpen={showQuickActions}
        onClose={() => setShowQuickActions(false)}
        onOpenKeyManager={() => setShowKeyManager(true)}
        onOpenHarvestModal={() => setShowHarvestModal(true)}
      />
      <DomainHarvestModal
        isOpen={showHarvestModal}
        onClose={() => setShowHarvestModal(false)}
      />
    </>
  )
}
