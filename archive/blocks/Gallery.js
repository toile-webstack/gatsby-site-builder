import React from 'react'
import Img from 'gatsby-image'

import { mapStyle } from '../utils/processCss'
import { typoRhythm, rhythm, scale } from '../utils/typography'
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

import Modal from '../atoms/Modal'
import Link from '../atoms/Link'

class BlockGallery extends React.Component {
  constructor(props) {
    super(props)
    // _json_ fields
    this.optionsData = props.block.options
    this.optionsData = this.optionsData._json_
      ? JSON.parse(props.block.options._json_)
      : this.optionsData
    this.styleData = props.block.style
    this.styleData = this.styleData._json_
      ? mapStyle(JSON.parse(props.block.style._json_))
      : this.styleData
    // Colors
    let { colorPalettes, colorCombo } = this.optionsData
    this.isColored = !!colorPalettes || !!colorCombo
    colorCombo = colorCombo
      ? props.colors[`${colorCombo}Combo`]
      : props.colors.classicCombo
    colorPalettes = colorPalettes || props.colors.colorPalettes
    const newColors = props.colors.computeColors(colorPalettes, colorCombo)
    this.colors = { ...props.colors, ...newColors }
    this.state = {
      showModal: false,
    }
    this.closeModal = this.closeModal.bind(this)
  }

  closeModal() {
    this.setState({ showModal: false })
  }

  render() {
    // console.log(this.props.passCSS)
    // console.log(this.props)
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

    const parentMaxWidth =
      (this.props.passCSS && this.props.passCSS.maxWidth) || 1000

    // const layout = gridLayout(this.optionsData, parentMaxWidth, block.gallery)
    const { layout, list } = addLayoutOptions(
      this.optionsData,
      parentMaxWidth,
      block.gallery,
    )

    const { id: htmlId, name: htmlName, links = [] } = this.optionsData

    return (
      <div
        id={htmlId}
        name={htmlName}
        className="block blockGallery"
        css={{
          padding: rhythm(1),
          display: `flex`,
          flexFlow: `row wrap`,
          justifyContent: `space-around`,
          justifyContent: `space-evenly`,
          alignItems: layout.align || `baseline`,
          width: `100%`,
          maxWidth: `1000px`,
          margin: `0 auto`,

          ...this.props.passCSS,
          ...(this.isColored ? this.colors[classicCombo].style : {}),
          // ...this.colors[classicCombo].style,
          ...this.styleData,
          // " a.button:hover": {
          //   ...this.colors[funkyContrastCombo].style,
          //   borderColor: this.colors[classicCombo].border
          // }
        }}
      >
        {list.map((column, colCount) => {
          // const imageStyle = listImageStyle(layout, i)
          const itemStyle = column[0].itemStyle
          const imageStyle = column[0].imageStyle

          return (
            <div
              key={colCount}
              className="column"
              css={{
                display: `flex`,
                flexFlow: `column`,
                width: `100%`,
                maxWidth: itemStyle.maxWidth,
              }}
            >
              {column.map((image, imCount) => {
                const to = links[colCount]
                return (
                  <Link
                    tag="div"
                    key={imCount}
                    onClick={() => {
                      if (this.optionsData.popup) {
                        this.setState({ showModal: image.id })
                      }
                    }}
                    css={{
                      ...imageStyle,
                      display: 'block',
                      ' .gatsby-image-wrapper': {
                        cursor: to ? `pointer` : 'auto',
                      },
                    }}
                    to={to}
                    // colors={this.colors}
                  >
                    {this.optionsData.gallery &&
                      this.optionsData.gallery.showTitle &&
                      image.title && <div>{image.title}</div>}
                    {this.state.showModal === image.id ? (
                      <Modal
                        close={() => {
                          this.closeModal()
                        }}
                      >
                        <Img
                          className="image"
                          title={image.title}
                          sizes={image.responsiveSizes}
                        />
                      </Modal>
                    ) : null}
                    <Img
                      className="image"
                      title={image.title}
                      sizes={image.responsiveSizes}
                      css={{
                        cursor: this.optionsData.popup ? `pointer` : `auto`,
                      }}
                    />
                    {this.optionsData.gallery &&
                      this.optionsData.gallery.showDescription &&
                      image.description && <div>{image.description}</div>}
                  </Link>
                )
              })}
            </div>
          )
        })}
      </div>
    )
  }
}

export default BlockGallery

export const blockGalleryFragment = graphql`
  fragment BlockGallery on ContentfulBlockGallery {
    id
    name
    internal {
      type
    }
    gallery {
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
