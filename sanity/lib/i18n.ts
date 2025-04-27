export const i18n = {
  supportedLanguages: [
    // If you would like to add additional languages to be used, please add them here
    {id: 'en', title: 'English'},
    // {id: 'ja', title: '日本語'},
    // {id: 'fr', title: 'Français'}
    // {id: 'de', title: 'Deutsch'}
    // {id: 'es', title: 'Español'},
  ],
  defaultLanguage: 'en',
} as const

export type Locale = (typeof i18n.supportedLanguages)[number]['id']

export function isValidLocale(locale: string): locale is Locale {
  return i18n.supportedLanguages.some((lang) => lang.id === locale)
}
