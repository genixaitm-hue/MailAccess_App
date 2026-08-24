import React, { useEffect, useState } from 'react'
import { Minimize2, Maximize2, Square, X } from 'lucide-react'

export default function DesktopTitleBar() {
  const [isTauriEnv, setIsTauriEnv] = useState(false)
  const [appWindow, setAppWindow] = useState<any>(null)

  useEffect(() => {
    // Check if running in Tauri environment
    if (typeof window !== 'undefined' && (window as any).__TAURI_INTERNALS__) {
      setIsTauriEnv(true)
      import('@tauri-apps/api/window').then(mod => {
        setAppWindow(mod.getCurrentWindow())
      }).catch(() => {})
    }
  }, [])

  if (!isTauriEnv) return null

  const handleMinimize = () => {
    appWindow?.minimize()
  }

  const handleMaximize = async () => {
    if (appWindow) {
      const isMax = await appWindow.isMaximized()
      if (isMax) {
        appWindow.unmaximize()
      } else {
        appWindow.maximize()
      }
    }
  }

  const handleClose = () => {
    appWindow?.close()
  }

  return (
    <div
      data-tauri-drag-region
      className="bg-zinc-950 border-b border-zinc-800/80 h-8 flex items-center justify-between px-3 select-none text-zinc-400 font-mono text-xs z-50"
    >
      <div className="flex items-center gap-2 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span className="text-zinc-300 font-bold tracking-wider text-[11px] uppercase">
          MailAccess Desktop OSINT
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={handleMinimize}
          className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded transition-colors"
          title="Minimize"
        >
          <Minimize2 className="w-3 h-3" />
        </button>
        <button
          onClick={handleMaximize}
          className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded transition-colors"
          title="Maximize"
        >
          <Square className="w-3 h-3" />
        </button>
        <button
          onClick={handleClose}
          className="p-1.5 hover:bg-red-500 hover:text-white text-zinc-400 rounded transition-colors"
          title="Close"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}
