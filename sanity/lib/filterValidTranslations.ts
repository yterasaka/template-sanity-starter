import type {TranslatedDocument} from '@/types'

export function filterValidTranslations(
  translations?: (TranslatedDocument | null)[] | null,
): TranslatedDocument[] | undefined {
  if (!translations) return undefined

  return translations.filter(
    (translation): translation is TranslatedDocument =>
      translation !== null && translation.language !== null,
  )
}
