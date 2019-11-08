import React from 'react'
import { graphql } from 'gatsby'

import { locales } from '../../utils/siteSettings.json'

// import MusicListEntry from "./collectionItems/MusicListEntry";
import DefaultListEntry from './collectionItems/DefaultListEntry'
import ClassicRowListEntry from './collectionItems/ClassicRowListEntry'
import TestimonialListEntry from './collectionItems/TestimonialListEntry'
import EventListEntry from './collectionItems/EventListEntry'

class CollectionItem extends React.Component {
  constructor(props) {
    super(props)
    // _json_ fields
    this.optionsData = JSON.parse(props.collectionItem.options.internal.content)
    this.styleData = JSON.parse(props.collectionItem.style.internal.content)
    // Colors
    let { colorPalettes, colorCombo } = this.optionsData
    // colorCombo = colorCombo
    //   ? props.colors[`${colorCombo}Combo`]
    //   : props.colors.classicCombo;
    // const newColors = props.colors.computeColors(colorPalettes, colorCombo);
    // this.colors = { ...props.colors, ...newColors };
    this.colors = { ...props.colors }
  }

  render() {
    const {
      classicCombo,
      contrastCombo,
      funkyCombo,
      funkyContrastCombo,
    } = this.colors

    let collectionItem = this.props.collectionItem
    if (Object.keys(collectionItem).length < 1) {
      return null
    }
    if (!collectionItem.featuredImage || !collectionItem.name) {
      return null
    }

    // const locale = collectionItem.fields.locale

    // collectionItem.momentPublished = !collectionItem.datePublished
    //   ? ""
    //   : moment(collectionItem.datePublished)
    //       .locale(locale)
    //       .format("Do MMM YYYY")
    collectionItem.path =
      collectionItem.path ||
      (locales.length > 1
        ? collectionItem.fields.localizedPath
        : collectionItem.fields.shortPath)

    switch (this.props.layout.name) {
      case `classicRow`:
        return (
          <ClassicRowListEntry
            collectionItem={collectionItem}
            colors={this.colors}
            styleData={this.styleData}
            layout={this.props.layout}
            blockOptionsData={this.props.blockOptionsData}
            passCSS={this.props.passCSS}
          />
        )
        break
      case `testimonial`:
        return (
          <TestimonialListEntry
            collectionItem={collectionItem}
            colors={this.colors}
            styleData={this.styleData}
            layout={this.props.layout}
            blockOptionsData={this.props.blockOptionsData}
            passCSS={this.props.passCSS}
          />
        )
        break
      case `event`:
        return (
          <EventListEntry
            collectionItem={collectionItem}
            colors={this.colors}
            styleData={this.styleData}
            layout={this.props.layout}
            blockOptionsData={this.props.blockOptionsData}
            passCSS={this.props.passCSS}
          />
        )
        break
      case ``:
      case `default`:
        return (
          <DefaultListEntry
            collectionItem={collectionItem}
            colors={this.colors}
            styleData={this.styleData}
            layout={this.props.layout}
            blockOptionsData={this.props.blockOptionsData}
            passCSS={this.props.passCSS}
          />
        )
        break
      default:
        return null
    }
  }
}

export default CollectionItem

export const collectionItemsFragment = graphql`
  fragment CollectionItem on ContentfulCollectionItem {
    id
    internal {
      type
    }
    type
    name
    author
    featuredImage {
      id
      title
      description
      fluid(maxWidth: 1000, maxHeight: 1000, quality: 80) {
        base64
        aspectRatio
        src
        srcSet
        sizes
      }
    }
    content {
      id
      childMarkdownRemark {
        id
        excerpt(pruneLength: 200)
        html
      }
    }
    datePublished
    dateLastEdit
    categories
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
    fields {
      menuName
      shortPath
      localizedPath
      locale
    }
  }
`
