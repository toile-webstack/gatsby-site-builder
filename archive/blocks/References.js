import React from 'react'
import Img from 'gatsby-image'
import _ from 'lodash'
import MdClose from 'react-icons/lib/md/close'

import Carousel from '../atoms/Carousel'

import { mapStyle } from '../utils/processCss'
import { rhythm, scale } from '../utils/typography'
import {
  addLayoutOptions,
  gridLayout,
  listItemStyle,
} from '../utils/computeGrid'
// import colors from "../utils/colors"
// import {
//   replaceShortCodes,
//   withSimpleLineBreaks,
//   protectEmail
// } from "../utils/processHtml"

import CollectionItem from './references/CollectionItem'
import PageReference from './references/PageReference'

class BlockReferences extends React.Component {
  constructor(props) {
    super(props)
    // _json_ fields
    this.optionsData = JSON.parse(props.block.options._json_)
    this.styleData = mapStyle(JSON.parse(props.block.style._json_))
    // Colors
    let { colorPalettes, colorCombo, hideCategories } = this.optionsData
    colorCombo = colorCombo
      ? props.colors[`${colorCombo}Combo`]
      : props.colors.classicCombo
    colorPalettes = colorPalettes || props.colors.colorPalettes
    const newColors = props.colors.computeColors(colorPalettes, colorCombo)
    this.colors = { ...props.colors, ...newColors }

    this.categories = ['']

    if (hideCategories !== true) {
      props.block.references.forEach(reference => {
        reference.categories.forEach(cat => {
          if (cat !== '' && _.indexOf(this.categories, cat) === -1) {
            this.categories.push(cat)
          }
        })
      })
      this.categories = _.sortBy(this.categories)
    }

    this.state = {
      selectedCategory: '',
    }
  }

  render() {
    const {
      classicCombo,
      contrastCombo,
      funkyCombo,
      funkyContrastCombo,
    } = this.colors

    const block = this.props.block
    if (Object.keys(block).length < 1) {
      return null
    }
    const { node_locale } = block

    const parentMaxWidth =
      (this.props.passCSS && this.props.passCSS.maxWidth) || 1000

    // let layout = gridLayout(this.optionsData, parentMaxWidth, block.references)
    const { layout, list } = addLayoutOptions(
      this.optionsData,
      parentMaxWidth,
      block.references,
    )

    const carouselDisplay =
      this.optionsData.mode && this.optionsData.mode === `carousel`

    const inner = list.map((column, key) => {
      // if (Object.keys(reference).length < 1) {
      //   return null
      // }
      // const itemStyle = listItemStyle(layout, key)
      const itemStyle = column[0].itemStyle
      const imageStyle = column[0].imageStyle

      const ColumnWrapper = props => (
        <div
          key={key}
          className="column"
          // maxWidth={itemStyle.maxWidth}
          css={{
            display: `flex`,
            flexFlow: `column`,
            width: `100%`,
            maxWidth: itemStyle.maxWidth,
            // "> div": {
            //   ...this.colors[classicCombo].style,
            //   ":hover": {
            //     ...this.colors[funkyCombo].style,
            //   },
            // },
          }}
        >
          {props.children}
        </div>
      )

      return column.map((reference, key) => {
        const { selectedCategory } = this.state
        if (
          selectedCategory &&
          _.indexOf(reference.categories, selectedCategory) === -1
        ) {
          return null
        }
        switch (reference.internal.type) {
          case `ContentfulCollectionItem`:
            return (
              <ColumnWrapper>
                <CollectionItem
                  key={key}
                  collectionItem={reference}
                  colors={this.colors}
                  location={this.props.location}
                  layout={layout}
                  blockOptionsData={this.optionsData}
                  passCSS={imageStyle}
                />
              </ColumnWrapper>
            )
            break
          case `ContentfulPage`:
            return (
              <ColumnWrapper>
                <PageReference
                  key={key}
                  page={reference}
                  colors={this.colors}
                  location={this.props.location}
                  layout={layout}
                  blockOptionsData={this.optionsData}
                  passCSS={imageStyle}
                />
              </ColumnWrapper>
            )
            break
          default:
        }
      })

      // return (
      //   <div
      //     key={key}
      //     css={{
      //       padding: `${rhythm(1 / 4)} ${rhythm(1 / 8)}`
      //     }}
      //   >
      //     {reference.id}
      //   </div>
      // )
    })

    const { id: htmlId, name: htmlName } = this.optionsData

    return (
      <div
        id={htmlId}
        name={htmlName}
        className="block blockReferences"
        css={{
          width: `100%`,
          maxWidth: `1000px`,
          margin: `auto`,
          flexGrow: 1,
          display: `flex`,
          flexFlow: `column`,
        }}
      >
        {this.categories.length > 1 && (
          <div
            className="blockReferences-categories"
            css={{
              display: `flex`,
              flexFlow: `row wrap`,
              justifyContent: `center`,
            }}
          >
            {this.categories &&
              this.categories.map((cat, i) => {
                const combo =
                  this.state.selectedCategory === cat
                    ? funkyContrastCombo
                    : funkyCombo
                // const combo = funkyContrastCombo
                let category = cat
                if (cat === '')
                  switch (node_locale.split('-')[0]) {
                    case 'fr':
                      category = 'Tout'
                      break
                    case 'en':
                      category = 'All'
                      break
                    case 'nl':
                      category = 'Alles'
                      break
                    default:
                  }
                return (
                  <div
                    key={i}
                    onClick={() => {
                      this.setState({ selectedCategory: cat })
                    }}
                    css={{
                      margin: `${rhythm(1 / 4)} ${rhythm(1 / 4)}`,
                      padding: `${rhythm(1 / 8)} ${rhythm(1 / 4)}`,
                      cursor: `pointer`,
                      border: `solid 1px`,
                      ...this.colors[combo].style,
                    }}
                  >
                    {category}
                  </div>
                )
              })}
          </div>
        )}
        <div
          css={{
            padding: rhythm(1),
            display: `flex`,
            flexFlow: `row wrap`,
            justifyContent: `space-around`,
            justifyContent: `space-evenly`,
            alignItems: `flex-start`,
            width: `100%`,
            margin: `0 auto`,
            // "> a": {
            //   width: `100%`,
            //   maxWidth:
            //     block.references.length < 3
            //       ? `calc((1000px - ${rhythm(2)}) / ${block.references.length})`
            //       : `calc((1000px - ${rhythm(2)}) / 3)`,
            //   // margin: `auto`,
            //   padding: `${rhythm(1 / 2)} ${rhythm(1 / 8)}`
            // },
            ' .image': {
              // height: `200px` // TODO: check if it does not scew up block references but wes posing problem for Testimonials
            },
            ' h3': {
              marginTop: 0,
            },
            ...this.props.passCSS,
            ...this.colors[classicCombo].style,
            ...this.styleData,
            // " a.button:hover": {
            //   ...this.colors[funkyContrastCombo].style,
            //   borderColor: this.colors[classicCombo].border
            // }
          }}
        >
          {carouselDisplay ? <Carousel>{inner}</Carousel> : inner}
        </div>
      </div>
    )
  }
}

export default BlockReferences

export const blockReferencesFragment = graphql`
  fragment BlockReferences on ContentfulBlockReferences {
    id
    name
    node_locale
    internal {
      type
    }
    references {
      ...CollectionItem
      ...PageReference
    }
    options {
      # _json_
      internal {
        content
      }
      # colorPalettes
      # colorCombo
    }
    style {
      # _json_
      internal {
        content
      }
    }
  }
`
