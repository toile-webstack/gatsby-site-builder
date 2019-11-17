import React from 'react'
import { graphql, Link } from 'gatsby'
import moment from 'moment'

import { createPath } from '../../../utils/utils'
import { locales, pages } from '../../utils/siteSettings.json'
import { rhythm, scale } from '../../utils/typography'
// import {
//   defaultLocale,
//   locales,
//   metadata,
//   favicon,
//   pages,
//   menu
// } from "../../utils/siteSettings.json"
import { mapStyle } from '../../utils/processCss'
import internalJson from '../../utils/internalJson'

import {
  replaceShortCodes,
  withSimpleLineBreaks,
  protectEmail,
} from '../../utils/processHtml'

class PageReference extends React.Component {
  constructor(props) {
    super(props)
    // _json_ fields
    const { options, style } = props.page
    this.optionsData = internalJson(options)
    this.styleData = mapStyle(internalJson(style))

    // Colors
    let { colorPalettes, colorCombo } = this.optionsData
    colorCombo = colorCombo
      ? props.colors[`${colorCombo}Combo`]
      : props.colors.classicCombo
    const newColors = props.colors.computeColors(colorPalettes, colorCombo)
    this.colors = { ...props.colors, ...newColors }

    const { menuName, shortPath, localizedPath } = props.page.fields
    this.menuName = menuName
    this.path = locales.length === 1 ? shortPath : localizedPath
  }

  render() {
    const {
      classicCombo,
      contrastCombo,
      funkyCombo,
      funkyContrastCombo,
    } = this.colors

    let page = this.props.page
    if (Object.keys(page).length < 1) {
      return null
    }
    // if (!page.featuredImage || !page.name) {
    //   return null
    // }

    const locale = page.node_locale

    return <Link to={this.path}>{this.menuName}</Link>
  }
}

export default PageReference

export const pageReferenceFragment = graphql`
  fragment PageReference on ContentfulPage {
    id
    internal {
      type
    }
    fields {
      menuName
      shortPath
      localizedPath
    }
    metadata {
      internal {
        content
      }
    }
    options {
      internal {
        content
      }
    }
    style {
      internal {
        content
      }
    }
    node_locale
  }
`
