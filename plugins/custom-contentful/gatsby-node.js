const contentful = require('contentful')
const pathLib = require(`path`)
const slash = require(`slash`)
const util = require('util')
// const smartCirc = require('smart-circular')

const { createPath } = require(`../../utils/utils.js`)

const addFields = (contentType, fields, localesObj) => {
  const { all: locales, current: locale, default: defaultLocale } = localesObj
  switch (contentType) {
    case 'page': {
      const slug = createPath(fields.path)
      const pathShort = slug === `index` ? `/` : `/${slug}/`
      const pathLocalized =
        slug === `index` ? `/${locale}/` : `/${locale}/${slug}/`
      const path = locales.length > 1 ? pathLocalized : pathShort
      return { ...fields, slug, pathShort, pathLocalized, path }
    }
    case 'asset': {
      const {
        title,
        fileName,
        contentType: ct,
        file: {
          url,
          details: {
            size,
            image: { width: naturalWidth, height: naturalHeight },
          },
        },
      } = fields

      const aspectRatio = naturalWidth / naturalHeight
      const src = `https:${url}`
      const webp = `https:${url}?fm=webp`

      // { title: 'Brewery_JandrainJandrenouille',
      //    file:
      //      { url:
      //     '//images.ctfassets.net/eeu0634yzxo7/5CofTmX6Wz6mbYfbcPynOK/7357a75d4b3da8045db11e99718e18b1/jbj.jpg',
      //    details: { size: 111547, image: [Object] },
      //    fileName: 'jbj.jpg',
      //    contentType: 'image/jpeg' } }

      //   <picture>
      //     <source srcset='paul_irish.jxr' type='image/vnd.ms-photo'>
      //     <source srcset='paul_irish.jp2' type='image/jp2'>
      //     <source srcset='paul_irish.webp' type='image/webp'>
      //     <img src='paul_irish.jpg' alt='paul'>
      // </picture>

      const i = (
        <picture>
          <source srcset="paul_irish.webp" type="image/webp" />
          <img src="paul_irish.jpg" alt="paul" />
        </picture>
      )

      return {
        name: title,
        fileName,
        contentType: ct,
        naturalWidth,
        naturalHeight,
        url: src,
        src,
        aspectRatio,
      }
    }
    default:
      return fields
  }
}

const transformItem = (item, localesObj, stopCycle) => {
  const { all: locales, current: locale, default: defaultLocale } = localesObj
  const { sys, fields: fi, ...rest } = item
  const f = { ...fi, ...rest }

  const { id, type, contentType: ct } = sys
  const contentType =
    item.contentType || (ct ? ct.sys.id : type === 'Asset' && 'asset')

  // of no contentType, it means that the entry is not published
  if (!contentType) return null

  const identifier = f.name || f.path ? (f.name || f.path)[defaultLocale] : ''
  if (f && /IGNORE/.test(identifier)) return null

  let fields = f
  if (f) {
    Object.entries(f).forEach(([fieldKey, fieldVal]) => {
      const val = fieldVal[locale] || fieldVal[defaultLocale]

      if (Array.isArray(val)) {
        // we want to stop if we are inside a blockReferences
        // then we simplify the object because we don't need all its content
        // only its preview and how to link to it
        if (stopCycle) {
          fields[fieldKey] = null
        } else if (contentType === 'blockReferences') {
          // only blockReferences can trigger cyclical references
          // then we stop the cycle at the next iteration encountering an array
          fields[fieldKey] = mapItems(val, localesObj, true)
        } else {
          fields[fieldKey] = mapItems(val, localesObj)
        }
      } else if (
        typeof val === 'object' &&
        Object.prototype.hasOwnProperty.call(val, 'fields') &&
        Object.prototype.hasOwnProperty.call(val, 'sys')
      ) {
        // if we reference only one entry, we have to loop it too
        // we need to check for both keys because we could have a JSON object with a field key (form)
        // TODO: Weak -> we could have in our data a JSON object with both keys and it would fail
        fields[fieldKey] = mapItems(val, localesObj)
      } else {
        // if it is not an array, it is an object with localized keys
        fields[fieldKey] = val
      }
    })

    fields = addFields(contentType, fields, localesObj)
  }

  return {
    sys,
    id,
    contentType,
    ...fields,
  }
}

const mapItems = (items, localesObj, stopCycle) => {
  if (Array.isArray(items)) {
    return items
      .map(item => {
        return transformItem(item, localesObj, stopCycle)
      })
      .filter(i => i)
  }

  return transformItem(items, localesObj, stopCycle)
}

/**
 * Gets all the existing entities based on pagination parameters.
 * The first call will have no aggregated response. Subsequent calls will
 * concatenate the new responses to the original one.
 */
const pagedGet = (
  client,
  method,
  query = {},
  skip = 0,
  pageLimit = 1000,
  aggregatedResponse = null
) => {
  return client[method]({
    ...query,
    skip,
    limit: pageLimit,
    order: `sys.createdAt`,
  }).then(response => {
    if (!aggregatedResponse) {
      aggregatedResponse = response
    } else {
      aggregatedResponse.items = aggregatedResponse.items.concat(response.items)
    }
    if (skip + pageLimit <= response.total) {
      return pagedGet(
        client,
        method,
        query,
        skip + pageLimit,
        pageLimit,
        aggregatedResponse
      )
    }
    return aggregatedResponse
  })
}

const fetchContentfulPages = async ({ spaceId, accessToken }) => {
  const contentfulClientOptions = {
    space: spaceId,
    accessToken,
    // host: pluginConfig.get(`host`),
    // environment: pluginConfig.get(`environment`),
    // proxy: pluginConfig.get(`proxy`),
  }

  const client = contentful.createClient(contentfulClientOptions)

  // const space = await client.getSpace()
  const locales = await client.getLocales().then(response => response.items)
  const defaultLocale = locales.filter(l => l.default)[0].code

  // const contentTypes = await pagedGet(client, `getContentTypes`)
  // const contentTypeItems = contentTypes.items
  // const contentTypeItems = contentTypes.items.map(c => normalize.fixIds(c))
  const fullEntries = await pagedGet(client, `getEntries`, { locale: '*' })

  const items = fullEntries.items.filter(e => e.fields.name !== 'IGNORE')

  const settings = items.filter(e => e.sys.contentType.sys.id === 'settings')
  const pages = items.filter(e => e.sys.contentType.sys.id === 'page')
  const footer = items.filter(
    e => e.sys.contentType.sys.id === 'section' && e.fields.name === '--footer'
  )
  const cookie = items.filter(
    e => e.sys.contentType.sys.id === 'section' && e.fields.name === '--cookie'
  )

  // const assets = await client.getAssets()

  return { locales, defaultLocale, settings, pages, footer, cookie }
}

exports.createPages = async ({ actions }, { spaceId, accessToken, host }) => {
  const { createPage, createRedirect } = actions
  const pageTemplate = pathLib.resolve(`src/templates/template-page.js`)

  await fetchContentfulPages({ spaceId, accessToken, host }).then(
    ({
      locales,
      defaultLocale,
      settings: s,
      pages: p,
      footer: f,
      cookie: c,
    }) => {
      locales.forEach(locale => {
        const { code } = locale
        const localeMapItems = items =>
          mapItems(items, {
            all: locales,
            current: code,
            default: defaultLocale,
          })

        const settings = localeMapItems(s)[0]
        const cookie = localeMapItems(c)[0]
        const footer = localeMapItems(f)[0]
        const settingsData = JSON.stringify(settings)
        const cookieData = JSON.stringify(cookie || {})
        const footerData = JSON.stringify(footer || {})

        const pages = localeMapItems(p)

        pages.forEach(page => {
          // const slug = createPath(page.path)
          // const shortPath = slug === `index` ? `/` : `/${slug}/`
          // const localizedPath =
          //   slug === `index` ? `/${code}/` : `/${code}/${slug}/`
          // const path = locales.length > 1 ? page.pathLocalized : page.pathShort

          // const pageData = JSON.stringify(page, getCircularReplacer())
          const pageData = JSON.stringify(page)
          const context = {
            settings: settingsData,
            page: pageData,
            cookie: cookieData,
            footer: footerData,
            locale,
          }
          const pageComponent = slash(pageTemplate)

          createPage({
            path: page.path, // required
            component: pageComponent,
            // menuName,
            // locale,
            // defaultLocale,
            context,
          })

          if (locales.length > 1 && locale === defaultLocale) {
            createRedirect({
              fromPath: page.pathShort,
              toPath: page.path,
              isPermanent: true,
              redirectInBrowser: true,
            })
          }
        })
      })

      return null
    }
  )
}
