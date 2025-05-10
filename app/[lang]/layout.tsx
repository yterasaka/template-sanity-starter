import '@/styles/index.css'
import {CustomPortableText} from '@/components/CustomPortableText'
import {i18n} from '@/sanity/lib/i18n'
import {sanityFetch, SanityLive} from '@/sanity/lib/live'
import {footerQuery, homePageQuery, settingsQuery} from '@/sanity/lib/queries'
import {urlForOpenGraphImage} from '@/sanity/lib/utils'
import type {Metadata, Viewport} from 'next'
import {toPlainText, VisualEditing, type PortableTextBlock} from 'next-sanity'
import {draftMode} from 'next/headers'
import {Toaster} from 'sonner'
import {DraftModeToast} from '../../components/DraftModeToast'
import {handleError} from '../client-functions'

export async function generateMetadata({
  params,
}: {
  params: Promise<{lang: string}>
}): Promise<Metadata> {
  const {lang} = await params
  const [{data: settings}, {data: homePage}] = await Promise.all([
    sanityFetch({query: settingsQuery, stega: false}),
    sanityFetch({query: homePageQuery, params: {language: lang}, stega: false}),
  ])

  const ogImage = urlForOpenGraphImage(
    // @ts-expect-error - @TODO update @sanity/image-url types so it's compatible
    settings?.ogImage,
  )
  return {
    title: homePage?.title
      ? {
          template: `%s | ${homePage.title}`,
          default: homePage.title || 'Personal website',
        }
      : undefined,
    description: homePage?.overview ? toPlainText(homePage.overview) : undefined,
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
  }
}

export const viewport: Viewport = {
  themeColor: '#000',
}

export async function generateStaticParams() {
  return i18n.supportedLanguages.map((lang) => ({
    lang: lang.id,
  }))
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{lang: string}>
}) {
  const {lang} = await params
  const {data: footerData} = await sanityFetch({query: footerQuery, params: {language: lang}})

  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      <div className="flex-grow px-4 md:px-16 lg:px-32">{children}</div>
      <footer className="bottom-0 w-full bg-white py-12 text-center md:py-20">
        {footerData?.footerContent && (
          <CustomPortableText
            id={footerData._id}
            type={footerData._type}
            path={['footerContent']}
            paragraphClasses="text-md md:text-xl"
            value={footerData.footerContent as unknown as PortableTextBlock[]}
          />
        )}
      </footer>
      <Toaster />
      <SanityLive onError={handleError} />
      {(await draftMode()).isEnabled && (
        <>
          <DraftModeToast />
          <VisualEditing />
        </>
      )}
    </div>
  )
}
