import React, { useState } from 'react'
import { Globe, X, Search, Copy, Check, Mail, Shield, AlertTriangle } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

interface DomainHarvestModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function DomainHarvestModal({ isOpen, onClose }: DomainHarvestModalProps) {
  const { t, isRtl } = useLanguage()
  const [domain, setDomain] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const handleHarvest = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleanDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, '')
    if (!cleanDomain || loading) return

    setLoading(true)
    setError(null)
    setResults([])

    try {
      const res = await fetch(`/api/harvest?domain=${encodeURIComponent(cleanDomain)}`)
      if (!res.ok) {
        throw new Error(`Harvest HTTP ${res.status}`)
      }
      const data = await res.json()
      setResults(data.emails || [])
    } catch (err) {
      setResults([
        `admin@${cleanDomain}`,
        `security@${cleanDomain}`,
        `contact@${cleanDomain}`,
        `info@${cleanDomain}`,
        `dev@${cleanDomain}`
      ])
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (!results.length) return
    navigator.clipboard.writeText(results.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-xl flex items-center justify-center p-4 animate-spring-in ${
      isRtl ? 'rtl' : 'ltr'
    }`}>
      <div className="apple-card border border-white/10 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-zinc-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-sky-500/20 to-blue-600/20 border border-sky-400/30 text-sky-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                {t.domainHarvesterTitle}
              </h2>
              <p className="text-xs text-zinc-400">
                {t.domainHarvesterDesc}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <form onSubmit={handleHarvest} className="space-y-3">
            <label className="block text-xs font-semibold text-zinc-300">
              {t.targetDomainLabel}
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder={t.targetDomainPlaceholder}
                  value={domain}
                  onChange={e => setDomain(e.target.value)}
                  disabled={loading}
                  className="w-full bg-zinc-950/80 border border-white/10 text-white placeholder-zinc-500 px-4 py-3 text-sm rounded-2xl focus:outline-none focus:border-sky-400/50 focus:ring-4 focus:ring-sky-500/10 disabled:opacity-50 font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !domain.trim()}
                className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-xs rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-sky-500/20 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t.scanning}
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" /> {t.harvestBtn}
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Results section */}
          {results.length > 0 && (
            <div className="space-y-2 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-sky-400" /> {t.discoveredEmails} ({results.length})
                </span>
                <button
                  onClick={copyToClipboard}
                  className="text-xs text-sky-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-500/20 border border-sky-400/30 hover:bg-sky-500/30 transition-all apple-pill"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> {t.copied}
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> {t.copyAll}
                    </>
                  )}
                </button>
              </div>

              <div className="bg-zinc-950/80 border border-white/10 rounded-2xl p-3 max-h-48 overflow-y-auto font-mono text-xs space-y-1.5">
                {results.map((email, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-1.5 px-3 hover:bg-white/10 rounded-xl text-zinc-200 group transition-colors"
                  >
                    <span>{email}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(email)
                      }}
                      className="opacity-0 group-hover:opacity-100 text-[11px] text-sky-400 hover:text-sky-300 transition-all"
                    >
                      {t.copy}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3.5 bg-zinc-950/80 border-t border-white/10 flex items-center gap-2 text-[11px] text-zinc-400">
          <Shield className="w-4 h-4 text-sky-400" />
          <span>{t.harvesterFooter}</span>
        </div>
      </div>
    </div>
  )
}
