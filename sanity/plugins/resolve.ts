/**
 * Sets up the Presentation Resolver API,
 * see https://www.sanity.io/docs/presentation-resolver-api for more information.
 */
import {i18n} from '@/sanity/lib/i18n'
import {resolveHref} from '@/sanity/lib/utils'
import {defineDocuments, defineLocations} from 'sanity/presentation'

export const mainDocuments = defineDocuments([
  {
    route: '/projects/:slug',
    filter: `_type == "project" && slug.current == $slug`,
  },
  ...i18n.supportedLanguages
    .filter((lang) => lang.id !== i18n.defaultLanguage)
    .map((lang) => ({
      route: `/${lang.id}/projects/:slug`,
      filter: `_type == "project" && slug.current == $slug && language == "${lang.id}"`,
    })),
  {
    route: '/',
    filter: `_type == "home" && language == "${i18n.defaultLanguage}"`,
  },
  ...i18n.supportedLanguages
    .filter((lang) => lang.id !== i18n.defaultLanguage)
    .map((lang) => ({
      route: `/${lang.id}`,
      filter: `_type == "home" && language == "${lang.id}"`,
    })),
  {
    route: '/:slug',
    filter: `_type == "page" && slug.current == $slug`,
  },
  ...i18n.supportedLanguages
    .filter((lang) => lang.id !== i18n.defaultLanguage)
    .map((lang) => ({
      route: `/${lang.id}/:slug`,
      filter: `_type == "page" && slug.current == $slug && language == "${lang.id}"`,
    })),
])

export const locations = {
  settings: defineLocations({
    message: 'This document is used on all pages',
    tone: 'caution',
  }),
  home: defineLocations({
    message: 'This document is used to render the front page',
    tone: 'positive',
    locations: [{title: 'Home', href: resolveHref('home')!}],
  }),
  project: defineLocations({
    select: {title: 'title', slug: 'slug.current'},
    resolve: (doc) => ({
      locations: [
        {
          title: doc?.title || 'Untitled',
          href: resolveHref('project', doc?.slug)!,
        },
      ],
    }),
  }),
  page: defineLocations({
    select: {title: 'title', slug: 'slug.current'},
    resolve: (doc) => ({
      locations: [
        {
          title: doc?.title || 'Untitled',
          href: resolveHref('page', doc?.slug)!,
        },
      ],
    }),
  }),
}
