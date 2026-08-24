import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Shield,
  Key,
  History,
  Command,
  Globe,
  PlusCircle,
  Activity,
  Languages
} from 'lucide-react'
import { api } from '../api/client'
import ApiKeyManager from './ApiKeyManager'
import QuickActionsModal from './QuickActionsModal'
import DomainHarvestModal from './DomainHarvestModal'
import { useLanguage } from '../context/LanguageContext'

export default function NavBar() {
  const { t, language, setLanguage, isRtl } = useLanguage()
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
      <header className={`apple-glass px-5 py-2.5 flex items-center gap-4 flex-shrink-0 text-sm select-none z-40 border-b border-white/5 ${
        isRtl ? 'flex-row-reverse' : ''
      }`}>
        {/* Brand Logo & Title */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500/20 to-blue-600/20 border border-sky-400/30 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-all shadow-lg shadow-sky-500/10">
            <Shield className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-white group-hover:text-sky-300 transition-colors leading-tight">
              {t.appName}
            </span>
            <span className="text-[10px] text-zinc-400 font-medium tracking-wide">
              {t.appSubtitle}
            </span>
          </div>
        </Link>

        <div className="h-4 w-px bg-white/10" />

        {/* Navigation Links */}
        <nav className="flex items-center gap-1.5">
          <Link
            to="/"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all apple-pill ${
              location.pathname === '/'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-400/30 font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            {t.newScan}
          </Link>

          <Link
            to="/history"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all apple-pill ${
              location.pathname === '/history'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-400/30 font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            {t.history}
            {count > 0 && (
              <span className="ml-1 text-[10px] bg-white/10 text-sky-300 px-1.5 py-0.2 rounded-full font-mono">
                {count}
              </span>
            )}
          </Link>
        </nav>

        {/* Quick Actions trigger button */}
        <button
          onClick={() => setShowQuickActions(true)}
          className="hidden md:flex items-center gap-2 px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-zinc-300 hover:bg-white/10 hover:border-white/20 transition-all apple-pill"
        >
          <Command className="w-3.5 h-3.5 text-sky-400" />
          <span>{t.quickActions}</span>
          <kbd className="text-[10px] bg-white/10 px-1.5 py-0.2 rounded-md text-zinc-400 font-mono">
            ⌘K
          </kbd>
        </button>

        <div className="flex-1" />

        {/* Language selector toggle */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-300 transition-all apple-pill"
        >
          <Languages className="w-3.5 h-3.5 text-sky-400" />
          <span>{t.langName}</span>
        </button>

        {/* Backend Status Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs">
          <Activity className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
          {isBackendConnected === true ? (
            <span className="text-emerald-400 text-[11px] font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> {t.engineOnline}
            </span>
          ) : isBackendConnected === false ? (
            <span className="text-amber-400 text-[11px] font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> {t.offlineMode}
            </span>
          ) : (
            <span className="text-zinc-500 text-[11px]">{t.connecting}</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHarvestModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-200 rounded-full transition-all apple-pill"
          >
            <Globe className="w-3.5 h-3.5 text-sky-400" />
            {t.harvest}
          </button>

          <button
            onClick={() => setShowKeyManager(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-200 rounded-full transition-all apple-pill"
          >
            <Key className="w-3.5 h-3.5 text-sky-400" />
            {t.apiKeys}
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
