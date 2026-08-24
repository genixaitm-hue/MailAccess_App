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
  History,
  Activity,
  CheckCircle2,
  Clock,
  Terminal,
  Server
} from 'lucide-react'
import { api } from '../api/client'
import { useInvestigationStore } from '../store/investigationStore'
import type { InvestigationSummary } from '../types'
import ApiKeyManager from '../components/ApiKeyManager'
import QuickActionsModal from '../components/QuickActionsModal'
import DomainHarvestModal from '../components/DomainHarvestModal'

function scoreToRiskLabel(score: number | null): { label: string; cls: string; bg: string } {
  if (score === null) return { label: 'N/A', cls: 'text-zinc-500', bg: 'bg-zinc-800/40 border-zinc-700/40' }
  if (score <= 20) return { label: 'LOW RISK', cls: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' }
  if (score <= 50) return { label: 'MED RISK', cls: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' }
  if (score <= 80) return { label: 'HIGH RISK', cls: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' }
  return { label: 'CRITICAL', cls: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' }
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
      <div className="min-h-screen bg-zinc-950 flex flex-col relative overflow-hidden font-mono selection:bg-cyan-500/30 text-zinc-100">
        {/* Modern Cyber Grid Glow Overlay */}
        <div className="absolute inset-0 bg-grid-fade pointer-events-none opacity-60" />

        {/* Floating Top Quick Control Bar */}
        <header className="relative z-20 px-6 py-3 border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.25)]">
              <Shield className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="font-bold tracking-wider text-sm text-zinc-100 block leading-none">
                MailAccess <span className="text-cyan-400 text-xs font-mono font-normal">Desktop</span>
              </span>
              <span className="text-[10px] text-zinc-500 tracking-widest uppercase">
                OSINT Email Intelligence Engine
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHarvestModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-md text-xs text-zinc-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              Harvest Domain
            </button>
            <button
              onClick={() => setShowKeyManager(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-md text-xs text-zinc-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors"
            >
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              API Keys
            </button>
          </div>
        </header>

        {/* Center Hero Content */}
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 py-12 max-w-4xl mx-auto w-full">
          {/* Logo Badge */}
          <div className="mb-8 text-center select-none animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 me-2 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Fast • Lightweight • Native Tauri Desktop Engine
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-100 uppercase text-glow-cyan mb-2">
              MailAccess
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm tracking-widest uppercase max-w-lg mx-auto">
              Unified OSINT Exposure Scoring & Breach Graph Platform
            </p>
          </div>

          {/* Search Bar Container */}
          <div className="w-full max-w-xl mx-auto space-y-3">
            <form onSubmit={handleSubmit} className="relative shadow-2xl">
              <div className="relative flex items-center bg-zinc-900 border border-zinc-700/90 rounded-xl overflow-hidden focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all">
                <div className="pl-4 pr-2 text-zinc-500">
                  <Search className="w-5 h-5 text-cyan-400" />
                </div>
                <input
                  ref={inputRef}
                  type="email"
                  placeholder="Enter target email (e.g. target@org.com)..."
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full bg-transparent text-zinc-100 placeholder-zinc-600 px-2 py-4 text-sm font-mono focus:outline-none disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowOptions(!showOptions)}
                  className={`px-3 py-2 text-xs font-mono border-l border-zinc-800 flex items-center gap-1.5 transition-colors ${
                    showOptions ? 'text-cyan-400 bg-zinc-800' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                  title="Scan Options"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="px-6 py-4 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 text-xs font-bold uppercase tracking-wider rounded-r-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 whitespace-nowrap"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      Investigate <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {error && (
              <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-lg text-red-300 text-xs font-mono flex items-center gap-2">
                <span className="text-red-400">✗</span> {error}
              </div>
            )}

            {/* Configurable Scan Options Drawer */}
            {showOptions && (
              <div className="p-4 bg-zinc-900/90 border border-zinc-800 rounded-xl space-y-3 animate-fade-in-up shadow-xl backdrop-blur-md">
                <div className="text-xs font-semibold text-zinc-300 flex items-center gap-2 font-mono">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" /> Advanced Investigation Controls
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <label className="flex items-center gap-2.5 cursor-pointer bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 hover:border-zinc-700">
                    <input
                      type="checkbox"
                      checked={deepBreach}
                      onChange={e => setDeepBreach(e.target.checked)}
                      className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-cyan-400 focus:ring-cyan-400/20"
                    />
                    <div>
                      <span className="text-zinc-200 font-medium block">Deep Breach Mode</span>
                      <span className="text-[10px] text-zinc-500 block">Probe high-risk leak corpora</span>
                    </div>
                  </label>

                  <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 flex items-center justify-between gap-2">
                    <span className="text-zinc-400">Timeout per module:</span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={timeoutSec}
                        onChange={e => setTimeoutSec(Number(e.target.value))}
                        min={10}
                        max={300}
                        className="w-14 bg-zinc-900 border border-zinc-700 text-zinc-200 px-2 py-1 text-xs font-mono rounded text-center"
                      />
                      <span className="text-zinc-600">sec</span>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 flex items-center gap-2">
                  <span className="text-zinc-400 text-xs whitespace-nowrap">Specific Modules:</span>
                  <input
                    type="text"
                    value={customModules}
                    onChange={e => setCustomModules(e.target.value)}
                    placeholder="hibp, sherlock, holehe, maigret (optional)..."
                    className="flex-1 bg-zinc-900 border border-zinc-700 text-zinc-200 px-2.5 py-1 text-xs font-mono rounded focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Feature Highlights Rail */}
          <div className="mt-8 flex items-center justify-center gap-6 text-zinc-500 text-xs font-mono flex-wrap">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" /> 2500+ Platforms
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" /> Real-time Streaming
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" /> 6 Export Formats
            </span>
          </div>
        </div>

        {/* Recent Investigations History Bar */}
        {recent.length > 0 && (
          <div className="relative z-10 max-w-4xl mx-auto w-full px-6 pb-12">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-widest font-mono text-zinc-400 flex items-center gap-2">
                <History className="w-3.5 h-3.5 text-cyan-400" /> Recent Target Profiles
              </span>
              <button
                onClick={() => navigate('/history')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
              >
                View all ({recent.length}) →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {recent.slice(0, 4).map(inv => {
                const risk = scoreToRiskLabel(inv.exposure_score)
                return (
                  <button
                    key={inv.id}
                    onClick={() => navigate(`/investigation/${inv.id}`)}
                    className="flex items-center justify-between p-3.5 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-cyan-500/40 rounded-xl transition-all text-left group"
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <span className="font-mono text-xs sm:text-sm text-zinc-200 group-hover:text-cyan-300 truncate block font-semibold transition-colors">
                        {inv.email}
                      </span>
                      <span className="text-[11px] text-zinc-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" /> {timeAgo(inv.created_at)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded border ${risk.bg} ${risk.cls}`}>
                        {risk.label}
                      </span>
                      <span className="text-zinc-600 group-hover:text-cyan-400 transition-colors">→</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Desktop Status Bar Footer */}
        <footer className="relative z-10 border-t border-zinc-800 bg-zinc-950 px-6 py-2.5 flex items-center justify-between text-xs text-zinc-500 font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-zinc-400">
              <Server className="w-3.5 h-3.5 text-cyan-400" /> Tauri Desktop Core v0.14.3
            </span>
            <span className="hidden sm:inline text-zinc-700">|</span>
            <span className="hidden sm:inline text-zinc-500">Self-hostable OSINT Suite</span>
          </div>

          <button
            onClick={() => setShowQuickActions(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors"
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400" /> Quick Launcher
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
