// sanity/plugins/structure.ts
import {
  CogIcon,
  DocumentIcon,
  DocumentTextIcon,
  HomeIcon,
  MenuIcon,
  TranslateIcon,
} from '@sanity/icons'
import {StructureBuilder} from 'sanity/structure'

export const structure = (S: StructureBuilder) => {
  return S.list()
    .title('Content')
    .items([
      // Singletons at the top
      S.listItem().title('Home').icon(HomeIcon).child(S.documentTypeList('home').title('Home')),
      S.listItem()
        .title('Navigation')
        .icon(MenuIcon)
        .child(S.documentTypeList('navigation').title('Navigation')),
      S.listItem()
        .title('Footer')
        .icon(DocumentTextIcon)
        .child(S.documentTypeList('footer').title('Footer')),

      // Divider
      S.divider(),

      // Regular content types
      S.listItem()
        .title('Page')
        .icon(DocumentIcon)
        .child(S.documentTypeList('page').title('Pages')),
      S.listItem()
        .title('Project')
        .icon(DocumentIcon)
        .child(S.documentTypeList('project').title('Projects')),

      // Another divider
      S.divider(),

      // Settings and metadata
      S.listItem()
        .title('Settings')
        .icon(CogIcon)
        .child(S.editor().id('settings').schemaType('settings').documentId('settings')),
      //   S.listItem()
      //     .title('Translation metadata')
      //     .icon(TranslateIcon)
      //     .child(S.documentTypeList('translation.metadata').title('Translation metadata')),
    ])
}
