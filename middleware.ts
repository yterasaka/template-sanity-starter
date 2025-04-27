import Negotiator from 'negotiator'
import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'
import {i18n, isValidLocale} from './sanity/lib/i18n'

function getLocaleFromPath(pathname: string): string | undefined {
  const segments = pathname.split('/')
  return segments[1] && isValidLocale(segments[1]) ? segments[1] : undefined
}

function getNegotiatedLocale(request: NextRequest): string {
  const languages = i18n.supportedLanguages.map((lang) => lang.id)
  const negotiator = new Negotiator({
    headers: {'accept-language': request.headers.get('accept-language') || ''},
  })

  const matchedLanguage = negotiator.language(languages)
  return matchedLanguage || i18n.defaultLanguage
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/studio') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const pathnameLocale = getLocaleFromPath(pathname)

  // If there's no locale in the path
  if (!pathnameLocale) {
    const locale = getNegotiatedLocale(request)

    // If the negotiated locale is the default language, don't add language prefix
    if (locale === i18n.defaultLanguage) {
      // Create a rewrite to serve the content from the [lang] folder without changing the URL
      const url = request.nextUrl.clone()
      url.pathname = `/${locale}${pathname}`
      return NextResponse.rewrite(url)
    } else {
      // For non-default languages, redirect to include the language prefix
      return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url))
    }
  }

  // If the locale is the default language and is in the path, redirect to remove it
  if (pathnameLocale === i18n.defaultLanguage) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.replace(`/${i18n.defaultLanguage}`, '')
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api (API routes)
     * - studio (Sanity Studio)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api|studio).*)',
  ],
}
