import internalJson from '../utils/internalJson'
import { mapStyle } from '../utils/processCss'
import { locales } from '../utils/siteSettings.json'

const CArticle = ({ article: collectionItem, blockOptions }) => {
  // general computations
  const { options: optionsData, style: styleData } = collectionItem
  const options = internalJson(optionsData)
  const style = mapStyle(internalJson(styleData))
  const path =
    collectionItem.path ||
    (locales.length > 1
      ? collectionItem.fields.localizedPath
      : collectionItem.fields.shortPath)

  // Link computations
  const { linkTo: linkToGlobal } = blockOptions || {}
  // in blockRef, linkTo can be 'none', 'external', 'page' (default)
  const noLink = linkToGlobal === `none`
  const linkIsExternal = linkToGlobal === `external`

  const internalLink = noLink ? null : path
  const { linkTo: externalLink, lang } = options
  const to = linkIsExternal ? externalLink : internalLink

  const className = `collectionItem${noLink ? '' : ' stylishLink'}`

  return {
    options,
    style,
    to,
    className,
    lang,
  }
}

export default CArticle
