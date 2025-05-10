import {defineQuery} from 'next-sanity'

export const homePageQuery = defineQuery(`
  *[_type == "home" && language == $language][0]{
    _id,
    _type,
    overview,
    showcaseProjects[]{
      _key,
      ...@->{
        _id,
        _type,
        coverImage,
        overview,
        "slug": slug.current,
        tags,
        title,
      }
    },
    title,
    "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
      title,
      language
    }
  }
`)

export const pagesBySlugQuery = defineQuery(`
  *[_type == "page" && slug.current == $slug && language == $language][0] {
    _id,
    _type,
    body,
    overview,
    title,
    "slug": slug.current,
    "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
      title,
      "slug": slug.current,
      language
    }
  }
`)

export const projectBySlugQuery = defineQuery(`
  *[_type == "project" && slug.current == $slug && language == $language][0] {
    _id,
    _type,
    client,
    coverImage,
    description,
    duration,
    overview,
    site,
    "slug": slug.current,
    tags,
    title,
    "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
      title,
      "slug": slug.current,
      language
    }
  }
`)

export const settingsQuery = defineQuery(`
  *[_type == "settings"][0]{
    _id,
    _type,
    footer,
    menuItems[]{
      _key,
      ...@->{
        _type,
        "slug": slug.current,
        title
      }
    },
    ogImage,
  }
`)

export const navigationQuery = defineQuery(`
  *[_type == "navigation" && language == $language][0]{
    _id,
    _type,
    title,
    menuItems[]{
      _key,
      ...@->{
        _type,
        "slug": slug.current,
        title
      }
    },
    "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
      title,
      language
    }
  }
`)

export const footerQuery = defineQuery(`
  *[_type == "footer" && language == $language][0]{
    _id,
    _type,
    title,
    footerContent,
    "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
      title,
      language
    }
  }
`)

export const slugsByTypeQuery = defineQuery(`
  *[_type == $type && defined(slug.current) && language == $language]{"slug": slug.current}
`)
