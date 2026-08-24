import React, { useEffect, useState } from 'react'
import { Languages } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export default function DesktopTitleBar() {
  const { language, setLanguage, isRtl } = useLanguage()
  const [isTauriEnv, setIsTauriEnv] = useState(false)
  const [appWindow, setAppWindow] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).__TAURI_INTERNALS__) {
      setIsTauriEnv(true)
      import('@tauri-apps/api/window').then(mod => {
        setAppWindow(mod.getCurrentWindow())
      }).catch(() => {})
    }
  }, [])

  const handleMinimize = () => appWindow?.minimize()
  const handleMaximize = async () => {
    if (appWindow) {
      const isMax = await appWindow.isMaximized()
      if (isMax) appWindow.unmaximize()
      else appWindow.maximize()
    }
  }
  const handleClose = () => appWindow?.close()

  return (
    <div
      data-tauri-drag-region
      className={`bg-zinc-950/80 apple-glass border-b border-white/5 h-9 flex items-center justify-between px-3 select-none text-zinc-300 font-sans text-xs z-50 ${
        isRtl ? 'flex-row-reverse' : ''
      }`}
    >
      {/* macOS Traffic Lights Window Controls */}
      <div className="flex items-center gap-2">
        {isTauriEnv ? (
          <div className="flex items-center gap-1.5 group">
            <button
              onClick={handleClose}
              className="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 flex items-center justify-center transition-all shadow-sm"
              title="Close"
            />
            <button
              onClick={handleMinimize}
              className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:bg-[#ffbd2e]/80 flex items-center justify-center transition-all shadow-sm"
              title="Minimize"
            />
            <button
              onClick={handleMaximize}
              className="w-3 h-3 rounded-full bg-[#27c93f] hover:bg-[#27c93f]/80 flex items-center justify-center transition-all shadow-sm"
              title="Maximize"
            />
          </div>
        ) : (
          <div className="flex items-center gap-1.5 opacity-60">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
        )}

        <div className="h-3 w-px bg-white/10 mx-1" />

        <span className="text-zinc-400 font-medium tracking-wide text-[11px]">
          MailAccess OSINT
        </span>
      </div>

      {/* Language Switcher & Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-[11px] transition-all"
        >
          <Languages className="w-3 h-3 text-sky-400" />
          <span className="font-semibold">{language === 'en' ? 'العربية' : 'English'}</span>
        </button>
      </div>
    </div>
  )
}
