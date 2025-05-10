import {OptimisticSortOrder} from '@/components/OptimisticSortOrder'
import type {SettingsQueryResult} from '@/sanity.types'
import {studioUrl} from '@/sanity/lib/api'
import {i18n} from '@/sanity/lib/i18n'
import {sanityFetch} from '@/sanity/lib/live'
import {navigationQuery} from '@/sanity/lib/queries'
import {resolveHref} from '@/sanity/lib/utils'
import type {TranslatedDocument} from '@/types'
import {createDataAttribute, stegaClean} from 'next-sanity'
import Link from 'next/link'
import {LanguageSwitcher} from './LanguageSwitcher'

interface NavbarProps {
  data: SettingsQueryResult
  lang: string
  translations?: (TranslatedDocument | null)[] | null
}

export async function Navbar(props: NavbarProps) {
  const {data: settings, lang, translations} = props
  const {data: navigationData} = await sanityFetch({
    query: navigationQuery,
    params: {language: lang},
  })

  const dataAttribute =
    navigationData?._id && navigationData?._type
      ? createDataAttribute({
          baseUrl: studioUrl,
          id: navigationData._id,
          type: navigationData._type,
        })
      : null

  const getLocalizedHref = (href: string | undefined, menuItemType: string | undefined) => {
    if (!href) return '/'

    if (menuItemType === 'home') {
      return lang === i18n.defaultLanguage ? '/' : `/${lang}`
    }

    return lang === i18n.defaultLanguage ? href : `/${lang}${href}`
  }

  return (
    <header
      className="sticky top-0 z-10 flex flex-wrap items-center gap-x-5 bg-white/80 px-4 py-4 backdrop-blur md:px-16 md:py-5 lg:px-32"
      data-sanity={dataAttribute?.('menuItems')}
    >
      <OptimisticSortOrder id={navigationData?._id!} path="menuItems">
        {navigationData?.menuItems?.map((menuItem) => {
          const href = resolveHref(menuItem?._type, menuItem?.slug)
          if (!href) {
            return null
          }

          const localizedHref = getLocalizedHref(href, menuItem?._type)

          return (
            <Link
              key={menuItem._key}
              className={`text-lg hover:text-black md:text-xl ${
                menuItem?._type === 'home' ? 'font-extrabold text-black' : 'text-gray-600'
              }`}
              data-sanity={dataAttribute?.([
                'menuItems',
                {_key: menuItem._key as unknown as string},
              ])}
              href={localizedHref}
            >
              {stegaClean(menuItem.title)}
            </Link>
          )
        })}
      </OptimisticSortOrder>

      {/* Language Switcher */}
      <LanguageSwitcher currentLang={lang} translations={translations} />
    </header>
  )
}
