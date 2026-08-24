import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Shield,
  Search,
  Key,
  Globe,
  Zap,
  Cpu,
  SlidersHorizontal,
  Layers,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  History,
  Activity,
  Clock,
  Terminal,
  Server,
  Languages
} from 'lucide-react'
import { api } from '../api/client'
import { useInvestigationStore } from '../store/investigationStore'
import type { InvestigationSummary } from '../types'
import ApiKeyManager from '../components/ApiKeyManager'
import QuickActionsModal from '../components/QuickActionsModal'
import DomainHarvestModal from '../components/DomainHarvestModal'
import { useLanguage } from '../context/LanguageContext'

function scoreToRiskLabel(score: number | null, t: any): { label: string; cls: string; bg: string } {
  if (score === null) return { label: 'N/A', cls: 'text-zinc-400', bg: 'bg-zinc-800/40 border-white/5' }
  if (score <= 20) return { label: t.lowRisk, cls: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' }
  if (score <= 50) return { label: t.medRisk, cls: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' }
  if (score <= 80) return { label: t.highRisk, cls: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' }
  return { label: t.criticalRisk, cls: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' }
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function Home() {
  const { t, language, setLanguage, isRtl } = useLanguage()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recent, setRecent] = useState<InvestigationSummary[]>([])
  const [showKeyManager, setShowKeyManager] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(false)
  const [showHarvestModal, setShowHarvestModal] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [deepBreach, setDeepBreach] = useState(false)
  const [customModules, setCustomModules] = useState('')
  const [timeoutSec, setTimeoutSec] = useState(30)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const store = useInvestigationStore()

  useEffect(() => {
    api.listInvestigations().then(r => setRecent(r.items)).catch(() => {})
    inputRef.current?.focus()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed || loading) return
    setError(null)
    setLoading(true)
    try {
      const res = await api.investigate(trimmed)
      store.initLive(res.id, trimmed)
      navigate(`/investigation/${res.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start investigation')
      setLoading(false)
    }
  }

  return (
    <>
      <div className={`min-h-screen bg-[#0d0e12] flex flex-col relative overflow-hidden text-zinc-100 ${
        isRtl ? 'rtl' : 'ltr'
      }`}>
        {/* Subtle Apple Cyber Glow */}
        <div className="absolute inset-0 bg-grid-apple pointer-events-none opacity-80" />

        {/* Floating Apple Top Bar */}
        <header className="relative z-20 px-6 py-3 apple-glass border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 p-0.5 shadow-lg shadow-sky-500/20">
              <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center text-sky-400">
                <Shield className="w-5 h-5" />
              </div>
            </div>
            <div>
              <span className="font-bold tracking-tight text-base text-white block leading-tight">
                {t.appName} <span className="text-sky-400 text-xs font-medium">v0.14.3 Desktop</span>
              </span>
              <span className="text-xs text-zinc-400 font-medium">
                {t.appSubtitle}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs text-zinc-300 transition-all apple-pill"
            >
              <Languages className="w-3.5 h-3.5 text-sky-400" />
              <span>{t.langName}</span>
            </button>
            <button
              onClick={() => setShowHarvestModal(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs text-zinc-200 transition-all apple-pill"
            >
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              {t.harvest}
            </button>
            <button
              onClick={() => setShowKeyManager(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs text-zinc-200 transition-all apple-pill"
            >
              <Key className="w-3.5 h-3.5 text-sky-400" />
              {t.apiKeys}
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 py-12 max-w-4xl mx-auto w-full">
          <div className="mb-8 text-center select-none animate-spring-in">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-300 text-xs font-medium mb-5 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" /> Apple macOS Desktop GUI • Native Tauri Speed
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-3">
              {t.appName}
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto font-normal">
              {t.appSubtitle}
            </p>
          </div>

          {/* Search Box */}
          <div className="w-full max-w-xl mx-auto space-y-3">
            <form onSubmit={handleSubmit} className="relative shadow-2xl">
              <div className="relative flex items-center bg-zinc-900/80 apple-glass border border-white/10 rounded-2xl overflow-hidden focus-within:border-sky-400/50 focus-within:ring-4 focus-within:ring-sky-500/10 transition-all">
                <div className="px-4 text-zinc-400">
                  <Search className="w-5 h-5 text-sky-400" />
                </div>
                <input
                  ref={inputRef}
                  type="email"
                  placeholder={t.targetEmailPlaceholder}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full bg-transparent text-white placeholder-zinc-500 px-2 py-4 text-sm font-sans focus:outline-none disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowOptions(!showOptions)}
                  className={`px-3.5 py-2 text-xs border-l border-white/10 flex items-center gap-1.5 transition-colors ${
                    showOptions ? 'text-sky-400 bg-white/10' : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Scan Controls"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="px-6 py-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-semibold tracking-wide rounded-r-2xl disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 whitespace-nowrap shadow-lg shadow-sky-500/25"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {t.scanning}
                    </>
                  ) : (
                    <>
                      {t.investigate} {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                    </>
                  )}
                </button>
              </div>
            </form>

            {error && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2 animate-spring-in">
                <span className="text-rose-400 font-bold">✕</span> {error}
              </div>
            )}

            {/* Options Drawer */}
            {showOptions && (
              <div className="p-4 bg-zinc-900/95 apple-glass border border-white/10 rounded-2xl space-y-3 animate-spring-in shadow-2xl">
                <div className="text-xs font-semibold text-zinc-200 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-sky-400" /> Advanced Options
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <label className="flex items-center gap-3 cursor-pointer bg-white/5 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                    <input
                      type="checkbox"
                      checked={deepBreach}
                      onChange={e => setDeepBreach(e.target.checked)}
                      className="w-4 h-4 rounded border-white/20 bg-zinc-800 text-sky-400 focus:ring-sky-400/20"
                    />
                    <div>
                      <span className="text-zinc-200 font-medium block">{t.deepBreachMode}</span>
                      <span className="text-[11px] text-zinc-400 block">{t.deepBreachDesc}</span>
                    </div>
                  </label>

                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center justify-between gap-2">
                    <span className="text-zinc-300">{t.timeoutPerModule}</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={timeoutSec}
                        onChange={e => setTimeoutSec(Number(e.target.value))}
                        min={10}
                        max={300}
                        className="w-14 bg-zinc-800 border border-white/10 text-white px-2 py-1 text-xs font-mono rounded-lg text-center"
                      />
                      <span className="text-zinc-400">{t.sec}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex items-center gap-2">
                  <span className="text-zinc-300 text-xs whitespace-nowrap">{t.specificModules}</span>
                  <input
                    type="text"
                    value={customModules}
                    onChange={e => setCustomModules(e.target.value)}
                    placeholder="hibp, sherlock, holehe..."
                    className="flex-1 bg-zinc-800 border border-white/10 text-white px-3 py-1.5 text-xs font-mono rounded-lg focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Features highlight */}
          <div className="mt-8 flex items-center justify-center gap-6 text-zinc-400 text-xs font-medium flex-wrap">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-sky-400" /> {t.platformsCount}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-sky-400" /> {t.realtimeStreaming}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-sky-400" /> {t.exportFormats}
            </span>
          </div>
        </div>

        {/* Recent Investigations */}
        {recent.length > 0 && (
          <div className="relative z-10 max-w-4xl mx-auto w-full px-6 pb-12">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400 flex items-center gap-2">
                <History className="w-4 h-4 text-sky-400" /> {t.recentProfiles}
              </span>
              <button
                onClick={() => navigate('/history')}
                className="text-xs text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1"
              >
                {t.viewAll} ({recent.length}) →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recent.slice(0, 4).map(inv => {
                const risk = scoreToRiskLabel(inv.exposure_score, t)
                return (
                  <button
                    key={inv.id}
                    onClick={() => navigate(`/investigation/${inv.id}`)}
                    className="flex items-center justify-between p-4 apple-card rounded-2xl transition-all text-left group"
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <span className="font-mono text-sm text-white group-hover:text-sky-300 truncate block font-semibold transition-colors">
                        {inv.email}
                      </span>
                      <span className="text-xs text-zinc-400 flex items-center gap-1 mt-1">
                        <Clock className="w-3.5 h-3.5" /> {timeAgo(inv.created_at)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${risk.bg} ${risk.cls}`}>
                        {risk.label}
                      </span>
                      <span className="text-zinc-500 group-hover:text-sky-400 transition-colors">→</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/5 apple-glass px-6 py-3 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <Server className="w-4 h-4 text-sky-400" /> Tauri Desktop Core v0.14.3
            </span>
          </div>

          <button
            onClick={() => setShowQuickActions(true)}
            className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-zinc-300 hover:text-white hover:bg-white/10 transition-colors apple-pill"
          >
            <Terminal className="w-3.5 h-3.5 text-sky-400" /> {t.quickLauncher}
          </button>
        </footer>
      </div>

      <ApiKeyManager isOpen={showKeyManager} onClose={() => setShowKeyManager(false)} />
      <QuickActionsModal
        isOpen={showQuickActions}
        onClose={() => setShowQuickActions(false)}
        onOpenKeyManager={() => setShowKeyManager(true)}
        onOpenHarvestModal={() => setShowHarvestModal(true)}
      />
      <DomainHarvestModal isOpen={showHarvestModal} onClose={() => setShowHarvestModal(false)} />
    </>
  )
}
