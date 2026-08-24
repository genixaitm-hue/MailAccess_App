import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Language = 'en' | 'ar'

export interface Translations {
  appName: string
  appSubtitle: string
  newScan: string
  history: string
  quickActions: string
  harvest: string
  apiKeys: string
  investigate: string
  targetEmailPlaceholder: string
  scanning: string
  deepBreachMode: string
  deepBreachDesc: string
  timeoutPerModule: string
  sec: string
  specificModules: string
  platformsCount: string
  realtimeStreaming: string
  exportFormats: string
  recentProfiles: string
  viewAll: string
  noRecent: string
  lowRisk: string
  medRisk: string
  highRisk: string
  criticalRisk: string
  engineOnline: string
  offlineMode: string
  connecting: string
  quickLauncher: string
  domainHarvesterTitle: string
  domainHarvesterDesc: string
  targetDomainLabel: string
  targetDomainPlaceholder: string
  harvestBtn: string
  discoveredEmails: string
  copyAll: string
  copied: string
  copy: string
  harvesterFooter: string
  searchActionsPlaceholder: string
  noActionsFound: string
  actionNewInvestigationTitle: string
  actionNewInvestigationDesc: string
  actionHarvestTitle: string
  actionHarvestDesc: string
  actionHistoryTitle: string
  actionHistoryDesc: string
  actionKeysTitle: string
  actionKeysDesc: string
  badgeEmail: string
  badgeDomain: string
  badgeDb: string
  badgeSettings: string
  langName: string
}

const translations: Record<Language, Translations> = {
  en: {
    appName: 'MailAccess',
    appSubtitle: 'OSINT Email Intelligence Engine',
    newScan: 'New Scan',
    history: 'History',
    quickActions: 'Quick Actions',
    harvest: 'Harvest Domain',
    apiKeys: 'API Keys',
    investigate: 'Investigate',
    targetEmailPlaceholder: 'Enter target email (e.g. target@org.com)...',
    scanning: 'Scanning...',
    deepBreachMode: 'Deep Breach Mode',
    deepBreachDesc: 'Probe high-risk leak corpora',
    timeoutPerModule: 'Timeout per module:',
    sec: 'sec',
    specificModules: 'Specific Modules:',
    platformsCount: '2500+ Platforms',
    realtimeStreaming: 'Real-time Streaming',
    exportFormats: '6 Export Formats',
    recentProfiles: 'Recent Target Profiles',
    viewAll: 'View all',
    noRecent: 'No recent investigations yet',
    lowRisk: 'LOW RISK',
    medRisk: 'MED RISK',
    highRisk: 'HIGH RISK',
    criticalRisk: 'CRITICAL',
    engineOnline: 'Engine Online',
    offlineMode: 'Offline Mode',
    connecting: 'Connecting...',
    quickLauncher: 'Quick Launcher',
    domainHarvesterTitle: 'Domain Email Harvester',
    domainHarvesterDesc: 'Passive OSINT email discovery across public datasets',
    targetDomainLabel: 'Target Organization Domain:',
    targetDomainPlaceholder: 'company.com or target-org.io',
    harvestBtn: 'Harvest',
    discoveredEmails: 'Discovered Emails',
    copyAll: 'Copy All',
    copied: 'Copied!',
    copy: 'Copy',
    harvesterFooter: 'Queries CT Logs, CommonCrawl, GitHub, KeyServers, & public records',
    searchActionsPlaceholder: 'Search desktop action, shortcut, or task...',
    noActionsFound: 'No matching actions found',
    actionNewInvestigationTitle: 'New OSINT Investigation',
    actionNewInvestigationDesc: 'Scan email target across 2500+ platforms & breach engines',
    actionHarvestTitle: 'Harvest Domain Emails',
    actionHarvestDesc: 'Discover org emails from CT logs, GitHub, CC, & web dorks',
    actionHistoryTitle: 'View Investigation History',
    actionHistoryDesc: 'Access saved target profile graphs, exposure scores, and logs',
    actionKeysTitle: 'Manage API Keys & Tokens',
    actionKeysDesc: 'Configure HIBP, Hunter.io, VirusTotal, and platform credentials',
    badgeEmail: 'EMAIL',
    badgeDomain: 'DOMAIN',
    badgeDb: 'DATABASE',
    badgeSettings: 'SETTINGS',
    langName: 'English'
  },
  ar: {
    appName: 'ميل أكسس',
    appSubtitle: 'محرك الاستخبارات السيبرانية واكتشاف البريد OSINT',
    newScan: 'فحص جديد',
    history: 'السجل',
    quickActions: 'إجراءات سريعة',
    harvest: 'استخراج النطاق',
    apiKeys: 'مفاتيح API',
    investigate: 'تحقيق وتحليل',
    targetEmailPlaceholder: 'أدخل البريد الإلكتروني المستهدف (مثال: target@org.com)...',
    scanning: 'جاري التحقيق...',
    deepBreachMode: 'نموذج التسريبات العميق',
    deepBreachDesc: 'فحص قواعد التسريبات عالية الخطورة',
    timeoutPerModule: 'المهلة لكل وحدة:',
    sec: 'ثانية',
    specificModules: 'وحدات معينة:',
    platformsCount: '+2500 منصة',
    realtimeStreaming: 'بث فوري مباشر',
    exportFormats: '6 صيغ تصدير',
    recentProfiles: 'أحدث التحقيقات المستهدفة',
    viewAll: 'عرض الكل',
    noRecent: 'لا توجد تحقيقات سابقة بعد',
    lowRisk: 'منخفض الخطورة',
    medRisk: 'متوسط الخطورة',
    highRisk: 'عالي الخطورة',
    criticalRisk: 'حرج جداً',
    engineOnline: 'المحرك متصل',
    offlineMode: 'وضع غير متصل',
    connecting: 'جاري الاتصال...',
    quickLauncher: 'المُطلق السريع',
    domainHarvesterTitle: 'مستخرج ايميلات النطاق',
    domainHarvesterDesc: 'استكشاف الإيميلات العامة عبر قواعد البيانات والسجلات المفتوحة',
    targetDomainLabel: 'نطاق المؤسسة المستهدفة:',
    targetDomainPlaceholder: 'company.com أو target-org.io',
    harvestBtn: 'استخراج',
    discoveredEmails: 'الإيميلات المُكتشفة',
    copyAll: 'نسخ الكل',
    copied: 'تم النسخ!',
    copy: 'نسخ',
    harvesterFooter: 'يفحص سجلات الشفافية، CommonCrawl، GitHub والخوادم العامة',
    searchActionsPlaceholder: 'ابحث عن إجراء، اختصار، أو مهمة...',
    noActionsFound: 'لم يتم العثور على إجراءات مطابقة',
    actionNewInvestigationTitle: 'تحقيق استخباراتي جديد',
    actionNewInvestigationDesc: 'فحص البريد المستهدف عبر أكثر من 2500 منصة وقواعد تسريبات',
    actionHarvestTitle: 'استخراج إيميلات النطاق',
    actionHarvestDesc: 'اكتشاف إيميلات المؤسسة من سجلات CT و GitHub و CC',
    actionHistoryTitle: 'عرض سجل التحقيقات',
    actionHistoryDesc: 'الوصول إلى مخططات الهوية المحفوظة ودرجات التعرض والملفات',
    actionKeysTitle: 'إدارة مفاتيح API',
    actionKeysDesc: 'تهيئه مفاتيح HIBP و Hunter.io و VirusTotal والمنصات',
    badgeEmail: 'بريد',
    badgeDomain: 'نطاق',
    badgeDb: 'قاعدة بيانات',
    badgeSettings: 'إعدادات',
    langName: 'العربية'
  }
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
  isRtl: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('mailaccess_lang') as Language
    return saved || 'en'
  })

  useEffect(() => {
    localStorage.setItem('mailaccess_lang', language)
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = language
  }, [language])

  const value = {
    language,
    setLanguage,
    t: translations[language],
    isRtl: language === 'ar'
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
