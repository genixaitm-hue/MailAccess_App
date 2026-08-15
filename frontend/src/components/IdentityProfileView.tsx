import { useState, useMemo } from 'react'
import { useInvestigationStore } from '../store/investigationStore'

interface PlatformAccount {
  platform: string
  username: string
  url?: string
  confidence: 'high' | 'medium' | 'low'
  avatar_url?: string
  display_name?: string
  bio?: string
  created_at?: string
}

interface IdentityAlias {
  alias: string
  type: 'username' | 'display_name' | 'email'
  confidence: 'high' | 'medium' | 'low'
  sources: string[]
}

interface TimelineEvent {
  date: string
  event_type: string
  source: string
  description: string
  confidence?: string
}

function confidenceColor(confidence: string): string {
  switch (confidence) {
    case 'high': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
    case 'medium': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10'
    case 'low': return 'text-zinc-500 border-zinc-600/30 bg-zinc-600/10'
    default: return 'text-zinc-400 border-zinc-700/30 bg-zinc-700/10'
  }
}

function platformIcon(platform: string): string {
  const icons: Record<string, string> = {
    github: '🐙',
    twitter: '𝕏',
    linkedin: 'in',
    facebook: 'f',
    instagram: '📷',
    reddit: '👽',
    discord: '👾',
    telegram: '✈',
    whatsapp: '📞',
    snapchat: '👻',
    tiktok: '🎵',
    youtube: '▶',
    spotify: '🎧',
    patreon: '💰',
    steam: '🎮',
    epic: '🎯',
    xbox: '❎',
    playstation: '🎮',
    nintendo: '🔴',
    gravatar: '⊕',
    google: 'G',
    microsoft: '▣',
    apple: '',
    amazon: 'a',
    netflix: 'N',
    duolingo: '🦉',
    medium: 'M',
    dev: '{',
    gitlab: '🦊',
    bitbucket: 'B',
    docker: '🐳',
    npm: '📦',
    pypi: '🐍',
    rust: '🦀',
    huggingface: '🤗',
    kaggle: '🏆',
    codepen: '⚡',
    stackoverflow: '📚',
    behance: '🎨',
    dribbble: '🏀',
    pinterest: '📌',
    tumblr: 't',
    vk: 'V',
    ok: 'OK',
    yandex: 'Y',
    mail_ru: 'M',
    proton: '🔒',
    icloud: '☁',
    outlook: '○',
    yahoo: '!',
    aol: 'A',
  }
  const key = platform.toLowerCase().replace(/[^a-z0-9]/g, '_')
  return icons[key] || '◉'
}

export default function IdentityProfileView() {
  const { modules } = useInvestigationStore()
  const [activeTab, setActiveTab] = useState<'identities' | 'platforms' | 'timeline'>('platforms')

  // Extract platform accounts from module findings
  const platformAccounts = useMemo(() => {
    const accounts: PlatformAccount[] = []
    
    Object.values(modules).forEach(mod => {
      mod.findings.forEach(finding => {
        // Extract from social_links, whatsmyname, sherlock, etc.
        if (finding.platform && finding.username) {
          accounts.push({
            platform: String(finding.platform),
            username: String(finding.username),
            url: finding.url as string | undefined,
            confidence: (finding.confidence as 'high' | 'medium' | 'low') || 'medium',
            avatar_url: finding.avatar_url as string | undefined,
            display_name: finding.display_name as string | undefined,
            bio: finding.bio as string | undefined,
            created_at: finding.created_at as string | undefined,
          })
        }
        // Handle grouped platform data
        if (finding.accounts && Array.isArray(finding.accounts)) {
          finding.accounts.forEach((acc: Record<string, unknown>) => {
            if (acc.platform && acc.username) {
              accounts.push({
                platform: String(acc.platform),
                username: String(acc.username),
                url: acc.url as string | undefined,
                confidence: (acc.confidence as 'high' | 'medium' | 'low') || 'medium',
                avatar_url: acc.avatar_url as string | undefined,
                display_name: acc.display_name as string | undefined,
                bio: acc.bio as string | undefined,
                created_at: acc.created_at as string | undefined,
              })
            }
          })
        }
      })
    })
    
    return accounts
  }, [modules])

  // Extract identity aliases
  const identityAliases = useMemo(() => {
    const aliases: IdentityAlias[] = []
    
    Object.values(modules).forEach(mod => {
      mod.findings.forEach(finding => {
        if (finding.username && finding.confidence) {
          aliases.push({
            alias: String(finding.username),
            type: 'username',
            confidence: finding.confidence as 'high' | 'medium' | 'low',
            sources: [mod.name],
          })
        }
        if (finding.display_name) {
          aliases.push({
            alias: String(finding.display_name),
            type: 'display_name',
            confidence: 'medium',
            sources: [mod.name],
          })
        }
      })
    })
    
    // Group by alias
    const grouped = new Map<string, IdentityAlias>()
    aliases.forEach(a => {
      const existing = grouped.get(a.alias)
      if (existing) {
        existing.sources.push(...a.sources)
      } else {
        grouped.set(a.alias, a)
      }
    })
    
    return Array.from(grouped.values())
  }, [modules])

  // Extract timeline events
  const timelineEvents = useMemo(() => {
    const events: TimelineEvent[] = []
    
    Object.values(modules).forEach(mod => {
      mod.findings.forEach(finding => {
        const dateVal = (finding.date || finding.created_at) as string | undefined
        if (dateVal) {
          events.push({
            date: dateVal,
            event_type: (finding.event_type as string) || 'discovery',
            source: mod.name,
            description: (finding.description as string) || `Found on ${mod.name}`,
            confidence: finding.confidence as string | undefined,
          })
        }
      })
    })
    
    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [modules])

  const highConfidenceAliases = identityAliases.filter(a => a.confidence === 'high')
  const mediumConfidenceAliases = identityAliases.filter(a => a.confidence === 'medium')
  const lowConfidenceAliases = identityAliases.filter(a => a.confidence === 'low')

  return (
    <div className="flex flex-col h-full">
      {/* Tab Navigation */}
      <div className="flex items-center gap-1 border-b border-zinc-800 px-5 pt-4">
        <button
          onClick={() => setActiveTab('identities')}
          className={`px-4 py-2 text-xs font-mono uppercase tracking-widest border-b-2 transition-colors ${
            activeTab === 'identities'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Identities ({identityAliases.length})
        </button>
        <button
          onClick={() => setActiveTab('platforms')}
          className={`px-4 py-2 text-xs font-mono uppercase tracking-widest border-b-2 transition-colors ${
            activeTab === 'platforms'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Platforms ({platformAccounts.length})
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-4 py-2 text-xs font-mono uppercase tracking-widest border-b-2 transition-colors ${
            activeTab === 'timeline'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Timeline ({timelineEvents.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {activeTab === 'identities' && (
          <div className="space-y-6">
            {highConfidenceAliases.length > 0 && (
              <section>
                <h3 className="text-emerald-400 text-xs uppercase tracking-widest mb-3">
                  High Confidence Aliases
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {highConfidenceAliases.map((alias, i) => (
                    <AliasCard key={i} alias={alias} />
                  ))}
                </div>
              </section>
            )}

            {mediumConfidenceAliases.length > 0 && (
              <section>
                <h3 className="text-yellow-400 text-xs uppercase tracking-widest mb-3">
                  Medium Confidence Aliases
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {mediumConfidenceAliases.map((alias, i) => (
                    <AliasCard key={i} alias={alias} />
                  ))}
                </div>
              </section>
            )}

            {lowConfidenceAliases.length > 0 && (
              <section>
                <h3 className="text-zinc-500 text-xs uppercase tracking-widest mb-3">
                  Low Confidence Aliases
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {lowConfidenceAliases.map((alias, i) => (
                    <AliasCard key={i} alias={alias} />
                  ))}
                </div>
              </section>
            )}

            {identityAliases.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-700">
                <span className="text-3xl mb-3">?</span>
                <p className="text-sm">No identity aliases discovered.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'platforms' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {platformAccounts.map((account, i) => (
              <PlatformCard key={i} account={account} />
            ))}
            {platformAccounts.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-zinc-700">
                <span className="text-3xl mb-3">◉</span>
                <p className="text-sm">No platform accounts discovered.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-zinc-800" />
            <div className="space-y-4">
              {timelineEvents.map((event, i) => (
                <TimelineItem key={i} event={event} index={i} />
              ))}
              {timelineEvents.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-700">
                  <span className="text-3xl mb-3">◷</span>
                  <p className="text-sm">No timeline events available.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function AliasCard({ alias }: { alias: IdentityAlias }) {
  return (
    <div className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-sm">
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-zinc-200 text-sm font-mono truncate">{alias.alias}</span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${confidenceColor(alias.confidence)}`}>
          {alias.confidence.toUpperCase()}
        </span>
      </div>
      <div className="text-zinc-600 text-xs capitalize mb-2">{alias.type}</div>
      <div className="flex flex-wrap gap-1">
        {alias.sources.slice(0, 5).map((source, i) => (
          <span key={i} className="text-[10px] px-1.5 py-0.5 bg-zinc-800 text-zinc-400 rounded">
            {source}
          </span>
        ))}
        {alias.sources.length > 5 && (
          <span className="text-[10px] px-1.5 py-0.5 bg-zinc-800 text-zinc-500 rounded">
            +{alias.sources.length - 5}
          </span>
        )}
      </div>
    </div>
  )
}

function PlatformCard({ account }: { account: PlatformAccount }) {
  return (
    <div className="p-4 bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors rounded-sm">
      <div className="flex items-start gap-3">
        {account.avatar_url ? (
          <img
            src={account.avatar_url}
            alt={account.platform}
            className="w-10 h-10 rounded-full border border-zinc-700 object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0 text-lg">
            {platformIcon(account.platform)}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-zinc-200 font-medium text-sm truncate">
              {account.display_name || account.username}
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${confidenceColor(account.confidence)}`}>
              {account.confidence.toUpperCase()}
            </span>
          </div>
          <div className="text-zinc-500 text-xs font-mono mb-2">@{account.username}</div>
          
          <div className="flex items-center gap-2">
            <span className="text-zinc-600 text-xs">{account.platform}</span>
            {account.url && (
              <a
                href={account.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 text-xs hover:text-cyan-300 transition-colors"
                title="Open profile"
              >
                ↗
              </a>
            )}
          </div>

          {account.bio && (
            <p className="text-zinc-600 text-xs mt-2 line-clamp-2">{account.bio}</p>
          )}
          {account.created_at && (
            <p className="text-zinc-700 text-xs mt-1">
              Joined: {new Date(account.created_at).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function TimelineItem({ event, index }: { event: TimelineEvent; index: number }) {
  return (
    <div className="relative pl-10">
      <div className="absolute left-0 top-1.5 w-8 h-px bg-zinc-800" />
      <div className="absolute left-3.5 top-1 w-1.5 h-1.5 rounded-full bg-cyan-400" />
      
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-sm p-3">
        <div className="flex items-center justify-between gap-3 mb-1">
          <span className="text-cyan-400 text-xs font-mono">
            {new Date(event.date).toLocaleDateString()}
          </span>
          <span className="text-zinc-600 text-xs">{event.source}</span>
        </div>
        <div className="text-zinc-300 text-sm mb-1">{event.description}</div>
        {event.confidence && (
          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${confidenceColor(event.confidence)}`}>
            {event.confidence.toUpperCase()}
          </span>
        )}
      </div>
    </div>
  )
}
