'use client'

/**
 * This config is used to set up Sanity Studio that's mounted on the `app/studio/[[...index]]/page.tsx` route
 */
import {apiVersion, dataset, projectId, studioUrl} from '@/sanity/lib/api'
import * as resolve from '@/sanity/plugins/resolve'
import {singletonPlugin} from '@/sanity/plugins/settings'
import {structure} from '@/sanity/plugins/structure'
import footer from '@/sanity/schemas/documents/footer'
import navigation from '@/sanity/schemas/documents/navigation'
import page from '@/sanity/schemas/documents/page'
import project from '@/sanity/schemas/documents/project'
import duration from '@/sanity/schemas/objects/duration'
import milestone from '@/sanity/schemas/objects/milestone'
import timeline from '@/sanity/schemas/objects/timeline'
import home from '@/sanity/schemas/singletons/home'
import settings from '@/sanity/schemas/singletons/settings'
import {dashboardTool, projectInfoWidget, projectUsersWidget} from '@sanity/dashboard'
import {documentInternationalization} from '@sanity/document-internationalization'
import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {unsplashImageAsset} from 'sanity-plugin-asset-source-unsplash'
import {media} from 'sanity-plugin-media'
import {presentationTool} from 'sanity/presentation'
import {structureTool} from 'sanity/structure'

const title =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_TITLE || 'Next.js Personal Website with Sanity.io'

export const supportedLanguages = [
  {id: 'en', title: 'English'},
  {id: 'ja', title: '日本語'},
  // {id: 'fr', title: 'Français'}
  // {id: 'de', title: 'Deutsch'}
  // {id: 'es', title: 'Español'},
]

export const defaultLanguage = 'en'

export default defineConfig({
  basePath: studioUrl,
  projectId: projectId || '',
  dataset: dataset || '',
  title,
  schema: {
    // If you want more content types, you can add them to this array
    types: [
      // Singletons
      home,
      settings,
      // Documents
      duration,
      footer,
      navigation,
      page,
      project,
      // Objects
      milestone,
      timeline,
    ],
  },
  plugins: [
    dashboardTool({widgets: [projectInfoWidget(), projectUsersWidget()]}),
    presentationTool({
      resolve,
      previewUrl: {previewMode: {enable: '/api/draft-mode/enable'}},
    }),
    structureTool({
      structure,
    }),
    media(),
    visionTool({defaultApiVersion: apiVersion}),
    documentInternationalization({
      supportedLanguages,
      schemaTypes: ['home', 'page', 'project', 'navigation', 'footer'],
    }),
    singletonPlugin([home.name, settings.name]),
    unsplashImageAsset(),
  ],
})
