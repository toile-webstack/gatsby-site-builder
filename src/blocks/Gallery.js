import React, { useState } from 'react'
import Img from 'gatsby-image'
import { graphql } from 'gatsby'

import { mapStyle } from '../utils/processCss'
import { rhythm } from '../utils/typography'
import {
  addLayoutOptions,
  // gridLayout,
  // listItemStyle,
} from '../utils/computeGrid'
// import colors from "../utils/colors"
// import {
//   replaceShortCodes,
//   withSimpleLineBreaks,
//   protectEmail
// } from "../utils/processHtml"
import { internalJson, useColors } from '../utils'

import Modal from '../atoms/Modal'
import Link from '../atoms/Link'

import { LBlockGallery } from '../t-layouts'

const Gallery = ({
  block,
  colors: colorsLib,
  // location,
  className = '',
  passCSS,
}) => {
  if (Object.keys(block).length < 1) return null
  if (block.gallery.length < 1) return null

  const [showModal, setShowModal] = useState(false)
  const closeModal = () => {
    setShowModal(false)
  }

  const { options: optionsData, style: styleData } = block
  const options = internalJson(optionsData)
  const style = mapStyle(internalJson(styleData))

  const colors = useColors({ options, colorsLib })
  const { isColored, classicCombo } = colors

  const parentMaxWidth = passCSS?.maxWidth || 1000

  // const layout = gridLayout(this.optionsData, parentMaxWidth, block.gallery)
  const { layout, list } = addLayoutOptions(
    options,
    parentMaxWidth,
    block.gallery
  )

  const { id, name, links = [] } = options

  return (
    <LBlockGallery
      {...{
        id,
        name,
        className: `block blockGallery ${className || ''}`,
        css: {
          // padding: rhythm(1),
          // display: `flex`,
          // flexFlow: `row wrap`,
          // justifyContent: [`space-around`, `space-evenly`],
          // width: `100%`,
          // maxWidth: `1000px`,
          // margin: `0 auto`,

          alignItems: layout.align || `baseline`,

          ...passCSS,
          ...(isColored ? colors[classicCombo].style : {}),
          // ...this.colors[classicCombo].style,
          ...style,
          // " a.button:hover": {
          //   ...this.colors[funkyContrastCombo].style,
          //   borderColor: this.colors[classicCombo].border
          // }
        },
      }}
    >
      {list.map((column, colCount) => {
        // const imageStyle = listImageStyle(layout, i)
        const { itemStyle, imageStyle } = column[0]

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
                    if (options.popup) {
                      setShowModal(image.id)
                    }
                  }}
                  css={{
                    ...imageStyle,
                    display: 'block',
                    // cursor: `pointer`,
                    ' .gatsby-image-wrapper': {
                      cursor: to ? `pointer` : 'auto',
                    },
                  }}
                  to={to}
                  // colors={this.colors}
                >
                  {options.gallery?.showTitle && image.title && (
                    <div>{image.title}</div>
                  )}
                  {showModal === image.id ? (
                    <Modal close={closeModal}>
                      <Img
                        className="image"
                        // title={image.title}
                        fluid={image.fluid}
                      />
                    </Modal>
                  ) : null}
                  <Img
                    className="image"
                    // title={image.title}
                    fluid={image.fluid}
                    style={{
                      cursor: to || options.popup ? `pointer` : `auto`,
                    }}
                  />
                  {options.gallery &&
                    options.gallery.showDescription &&
                    image.description && <div>{image.description}</div>}
                </Link>
              )
            })}
          </div>
        )
      })}
    </LBlockGallery>
  )
}

export default Gallery

export const blockGalleryFragment = graphql`
  fragment BlockGallery on ContentfulBlockGallery {
    id
    name
    __typename
    gallery {
      id
      title
      description
      fluid(maxWidth: 1000, quality: 80) {
        ...GatsbyContentfulFluid
      }
    }
    options {
      internal {
        content
      }
      # colorPalettes
      # colorCombo
    }
    style {
      internal {
        content
      }
    }
  }
`
