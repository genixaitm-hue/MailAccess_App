import { useState, useEffect } from 'react'
import { api } from '../api/client'

interface ApiKeyInfo {
  name: string
  env_var: string
  description: string
  configured: boolean
  optional: boolean
}

interface Props {
  isOpen: boolean
  onClose: () => void
}

const KEY_DESCRIPTIONS: Record<string, { description: string; optional: boolean }> = {
  haveibeenpwned_api_key: {
    description: 'HIBP breach data access (required for breach lookups)',
    optional: false,
  },
  hunter_io_api_key: {
    description: 'Hunter.io email pattern discovery',
    optional: true,
  },
  emailrep_api_key: {
    description: 'EmailRep.io reputation checks',
    optional: true,
  },
  shodan_api_key: {
    description: 'Shodan infrastructure intelligence',
    optional: true,
  },
  github_token: {
    description: 'GitHub API token for code search and commit history',
    optional: true,
  },
  breachdirectory_api_key: {
    description: 'BreachDirectory breach database access',
    optional: true,
  },
  intelx_api_key: {
    description: 'IntelligenceX darknet/paste correlation',
    optional: true,
  },
  dehashed_api_key: {
    description: 'Dehashed breach database (paid)',
    optional: true,
  },
  snusbase_api_key: {
    description: 'Snusbase breach database (paid)',
    optional: true,
  },
  brave_search_api_key: {
    description: 'Brave Search API for dorking operations',
    optional: true,
  },
  google_cse_api_key: {
    description: 'Google Custom Search Engine API key',
    optional: true,
  },
  scrapingant_api_key: {
    description: 'ScrapingAnt proxy for stealth HTTP requests',
    optional: true,
  },
  otx_api_key: {
    description: 'AlienVault OTX for passive DNS intelligence',
    optional: true,
  },
}

export default function ApiKeyManager({ isOpen, onClose }: Props) {
  const [keys, setKeys] = useState<ApiKeyInfo[]>([])
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      loadKeys()
    }
  }, [isOpen])

  async function loadKeys() {
    setLoading(true)
    try {
      // For now, show static list - backend would need endpoint to check configured keys
      const staticKeys: ApiKeyInfo[] = Object.entries(KEY_DESCRIPTIONS).map(([name, info]) => ({
        name,
        env_var: name.toUpperCase(),
        description: info.description,
        configured: false, // Would need backend endpoint to check actual config
        optional: info.optional,
      }))
      setKeys(staticKeys)
    } catch (err) {
      console.error('Failed to load keys:', err)
    } finally {
      setLoading(false)
    }
  }

  function handleSave(keyName: string, value: string) {
    // In a real implementation, this would save to backend or local storage
    // For now, we show instructions for setting via .env file
    setSaved(keyName)
    setTimeout(() => setSaved(null), 3000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl max-h-[80vh] bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-700">
          <div>
            <h2 className="text-lg font-bold text-zinc-100 uppercase tracking-widest">
              API Key Manager
            </h2>
            <p className="text-zinc-500 text-xs mt-1">
              Configure API keys for enhanced investigation capabilities
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 transition-colors text-xl"
          >
            ×
          </button>
        </div>

        {/* Info Banner */}
        <div className="px-6 py-3 bg-cyan-500/10 border-b border-cyan-500/20">
          <p className="text-cyan-300 text-xs">
            💡 Keys are stored locally in <code className="bg-zinc-800 px-1.5 py-0.5 rounded">~/.mailaccess/.env</code>. 
            Restart the backend after updating keys.
          </p>
        </div>

        {/* Keys List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <span className="text-cyan-400 animate-pulse">Loading...</span>
            </div>
          ) : (
            keys.map(key => (
              <ApiKeyRow
                key={key.name}
                info={key}
                onSave={handleSave}
                saved={saved === key.name}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-700 bg-zinc-900/50 rounded-b-lg">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Configured
            <span className="w-2 h-2 rounded-full bg-zinc-600 ml-3" />
            Not configured
            <span className="w-2 h-2 rounded-full bg-amber-400 ml-3" />
            Optional
          </div>
        </div>
      </div>
    </div>
  )
}

interface ApiKeyRowProps {
  info: ApiKeyInfo
  onSave: (name: string, value: string) => void
  saved: boolean
}

function ApiKeyRow({ info, onSave, saved }: ApiKeyRowProps) {
  const [value, setValue] = useState('')
  const [showInput, setShowInput] = useState(false)

  return (
    <div className={`p-4 rounded border ${info.configured ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-zinc-700 bg-zinc-800/30'}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-zinc-200 font-mono text-sm font-medium">
              {info.env_var}
            </span>
            {info.configured && (
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                CONFIGURED
              </span>
            )}
            {info.optional && !info.configured && (
              <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
                OPTIONAL
              </span>
            )}
          </div>
          <p className="text-zinc-500 text-xs">{info.description}</p>
        </div>

        <div className="flex-shrink-0">
          {!showInput ? (
            <button
              onClick={() => setShowInput(true)}
              className="px-3 py-1.5 text-xs font-mono border border-zinc-600 text-zinc-300 rounded hover:border-cyan-400 hover:text-cyan-400 transition-colors"
            >
              {info.configured ? 'Update' : 'Configure'}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="password"
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder={`Enter ${info.env_var}`}
                className="w-48 bg-zinc-800 border border-zinc-600 text-zinc-200 px-3 py-1.5 text-xs font-mono rounded focus:outline-none focus:border-cyan-400"
              />
              <button
                onClick={() => {
                  onSave(info.name, value)
                  setShowInput(false)
                  setValue('')
                }}
                disabled={!value.trim()}
                className="px-3 py-1.5 text-xs font-mono bg-cyan-400 text-zinc-900 rounded hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowInput(false)
                  setValue('')
                }}
                className="px-2 py-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {saved && (
        <div className="mt-3 text-xs text-emerald-400">
          ✓ Saved! Add <code className="bg-zinc-800 px-1.5 py-0.5 rounded">{info.env_var}={value}</code> to your ~/.mailaccess/.env file and restart the backend.
        </div>
      )}
    </div>
  )
}
