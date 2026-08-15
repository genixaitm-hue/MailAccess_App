import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { api } from '../api/client'
import ApiKeyManager from './ApiKeyManager'

export default function NavBar() {
  const [count, setCount] = useState<number>(0)
  const [showKeyManager, setShowKeyManager] = useState(false)
  const location = useLocation()

  useEffect(() => {
    api.listInvestigations(1, 1).then(r => setCount(r.total)).catch(() => {})
  }, [])

  return (
    <>
      <header className="border-b border-zinc-800 bg-zinc-900/60 px-5 py-3 flex items-center gap-4 flex-shrink-0 font-mono">
        <Link to="/" className="flex items-center gap-2 group">
          <img src="/ma_logo.png" className="h-7 w-7 object-contain" alt="MailAccess Logo" />
          <span className="text-zinc-500 group-hover:text-zinc-200 text-sm transition-colors">
            MailAccess
          </span>
        </Link>

        <div className="h-4 w-px bg-zinc-800" />

        <Link
          to="/history"
          className={`flex items-center gap-2 text-sm transition-colors ${
            location.pathname === '/history'
              ? 'text-cyan-400'
              : 'text-zinc-500 hover:text-zinc-200'
          }`}
        >
          History
          {count > 0 && (
            <span className="text-xs bg-zinc-800 border border-zinc-700 text-zinc-400 px-1.5 py-0.5 rounded-sm tabular-nums leading-none">
              {count}
            </span>
          )}
        </Link>

        <div className="flex-1" />

        <button
          onClick={() => setShowKeyManager(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono border border-zinc-700 text-zinc-400 rounded-sm hover:border-cyan-400 hover:text-cyan-400 transition-colors"
          title="Manage API Keys"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
          </svg>
          API Keys
        </button>
      </header>

      <ApiKeyManager isOpen={showKeyManager} onClose={() => setShowKeyManager(false)} />
    </>
  )
}
