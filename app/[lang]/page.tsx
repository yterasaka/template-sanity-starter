import {HomePage} from '@/components/HomePage'
import {Navbar} from '@/components/Navbar'
import {studioUrl} from '@/sanity/lib/api'
import {sanityFetch} from '@/sanity/lib/live'
import {homePageQuery, settingsQuery} from '@/sanity/lib/queries'
import Link from 'next/link'

export default async function IndexRoute({params}: {params: Promise<{lang: string}>}) {
  const {lang} = await params
  const [{data}, {data: settings}] = await Promise.all([
    sanityFetch({
      query: homePageQuery,
      params: {language: lang},
    }),
    sanityFetch({query: settingsQuery}),
  ])

  if (!data) {
    return (
      <>
        <Navbar data={settings} lang={lang} />
        <div className="text-center">
          You don&rsquo;t have a homepage yet,{' '}
          <Link href={`${studioUrl}/structure/home`} className="underline">
            create one now
          </Link>
          !
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar data={settings} lang={lang} translations={data?._translations} />
      <HomePage data={data} lang={lang} />
    </>
  )
}
