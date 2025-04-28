'use client'

import {i18n} from '@/sanity/lib/i18n'
import type {TranslatedDocument} from '@/types'
import Link from 'next/link'
import {usePathname} from 'next/navigation'

interface LanguageSwitcherProps {
  currentLang: string
  translations?: (TranslatedDocument | null)[] | null
}

export function LanguageSwitcher({currentLang, translations}: LanguageSwitcherProps) {
  const pathname = usePathname()

  const getBasePath = () => {
    const segments = pathname.split('/')
    if (i18n.supportedLanguages.some((l) => l.id === segments[1])) {
      segments.splice(1, 1)
    }
    return segments.join('/') || '/'
  }

  const getLanguageSwitchHref = (targetLang: string) => {
    if (translations && Array.isArray(translations)) {
      const translation = translations.find((t) => t && t.language === targetLang)
      if (translation && translation.slug && translation.slug !== null) {
        const basePath = getBasePath()
        if (basePath.includes('/projects/')) {
          return targetLang === i18n.defaultLanguage
            ? `/projects/${translation.slug}`
            : `/${targetLang}/projects/${translation.slug}`
        }

        return targetLang === i18n.defaultLanguage
          ? `/${translation.slug}`
          : `/${targetLang}/${translation.slug}`
      }
    }

    const basePath = getBasePath()

    if (basePath === '/') {
      return targetLang === i18n.defaultLanguage ? '/' : `/${targetLang}`
    }

    return targetLang === i18n.defaultLanguage ? basePath : `/${targetLang}${basePath}`
  }

  return (
    <div className="ml-auto flex gap-2">
      {i18n.supportedLanguages.map((language) => {
        const href = getLanguageSwitchHref(language.id)

        return (
          <Link
            key={language.id}
            href={href}
            className={`text-sm ${
              currentLang === language.id
                ? 'font-bold text-black'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            {language.title}
          </Link>
        )
      })}
    </div>
  )
}
