import React from 'react'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'

import { mapStyle } from '../utils/processCss'
import { typoRhythm, rhythm, scale } from '../utils/typography'
import {
  addLayoutOptions,
  gridLayout,
  listItemStyle,
} from '../utils/computeGrid'
import internalJson from '../utils/internalJson'

import BlockFreeText from './FreeText'
import BlockForm from './Form'
import BlockGallery from './Gallery'
import BlockReferences from './References'

class Section extends React.Component {
  constructor(props) {
    super(props)
    // _json_ fields
    const { options, style } = props.block
    this.optionsData = internalJson(options)
    this.styleData = mapStyle(internalJson(style))
    // Colors
    let { colorPalettes, colorCombo } = this.optionsData
    this.isColored = !!colorPalettes || !!colorCombo
    colorCombo = colorCombo
      ? props.colors[`${colorCombo}Combo`]
      : props.colors.classicCombo
    colorPalettes = colorPalettes || props.colors.colorPalettes
    const newColors = props.colors.computeColors(colorPalettes, colorCombo)
    this.colors = { ...props.colors, ...newColors }
  }

  render() {
    const {
      classicCombo,
      contrastCombo,
      funkyCombo,
      funkyContrastCombo,
    } = this.colors

    const section = this.props.block
    if (typeof section === `undefined` || !section) return null

    const parentMaxWidth =
      (this.props.passCSS && this.props.passCSS.maxWidth) || 1000

    // const layout = gridLayout(this.optionsData, parentMaxWidth, section.blocks)
    const { layout, list } = addLayoutOptions(
      this.optionsData,
      parentMaxWidth,
      section.blocks,
    )
    const { id: htmlId, name: htmlName } = this.optionsData
    const { shortCodeMatchees } = this.props

    return (
      <div
        id={htmlId}
        name={htmlName}
        className="block section"
        css={{
          position: `relative`,
          width: `100%`,
          padding: `${rhythm(1)} 0`,
          ...this.props.csss,
          ...(this.isColored ? this.colors[classicCombo].style : {}),
          // ...this.colors[classicCombo].style,
          ...this.styleData,
        }}
      >
        <div
          css={{
            display: `flex`,
            flexFlow: `row wrap`,
            justifyContent: [`space-around`, `space-evenly`],
            alignItems: layout.align || `baseline`,
            margin: `auto`,
            maxWidth: `1000px`,
            padding: `0 ${rhythm(1)}`,
          }}
        >
          {list &&
            list.map((column, i, blocks) => {
              if (Object.keys(column).length < 1) {
                return null
              }
              // const itemStyle = listItemStyle(layout, i)
              const itemStyle = column[0].itemStyle

              // console.log(itemStyle)
              //
              // const passCSS = {
              //   maxWidth: layout.childMaxWidths[i],
              //   width: `100%`,
              //   margin: `0`
              // }

              return (
                <div
                  key={i}
                  className="column"
                  css={{
                    position: `relative`,
                    display: `flex`,
                    flexFlow: `column`,
                    width: `100%`,
                    // width: itemStyle.width,
                    maxWidth: itemStyle.maxWidth,

                    // justifyContent: `space-around`,
                    // justifyContent: `space-evenly`,
                    // alignItems: layout.align || `baseline`,
                    // margin: `auto`,
                    // maxWidth: `1000px`,
                    // padding: `0 ${rhythm(1)}`
                  }}
                >
                  {column.map((block, i) => {
                    switch (block.internal.type) {
                      case `ContentfulBlockFreeText`:
                        return (
                          <BlockFreeText
                            key={i}
                            block={block}
                            colors={this.colors}
                            location={this.props.location}
                            passCSS={itemStyle}
                            shortCodeMatchees={shortCodeMatchees}
                            cookieButton={this.props.cookieButton}
                          />
                        )
                        break
                      case `ContentfulBlockForm`:
                        return (
                          <BlockForm
                            key={i}
                            block={block}
                            colors={this.colors}
                            location={this.props.location}
                            passCSS={itemStyle}
                          />
                        )
                        break
                      case `ContentfulBlockGallery`:
                        return (
                          <BlockGallery
                            key={i}
                            block={block}
                            colors={this.colors}
                            location={this.props.location}
                            passCSS={itemStyle}
                          />
                        )
                        break
                      case `ContentfulBlockReferences`:
                        return (
                          <BlockReferences
                            key={i}
                            block={block}
                            colors={this.colors}
                            location={this.props.location}
                            passCSS={itemStyle}
                          />
                        )
                        break
                      default:
                    }
                  })}
                </div>
              )
            })}
        </div>
      </div>
    )
  }
}

export default Section

export const sectionFragment = graphql`
  fragment Section on ContentfulSection {
    id
    name
    internal {
      type
    }
    # blocks {
    #   ...BlockFreeText
    #   ...BlockForm
    #   ...BlockGallery
    #   ...BlockReferences
    # }
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
  }
`
