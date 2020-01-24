import React from 'react'
import { graphql } from 'gatsby'
import { For } from 'react-loops'

import { mapStyle } from '../utils/processCss'
// import { rhythm } from '../utils/typography'
import {
  addLayoutOptions,
  // gridLayout,
  // listItemStyle
} from '../utils/computeGrid'
import { internalJson, useColors } from '../utils'

import { FreeText, Form, Gallery, References } from '.'
import { LSection } from '../t-layouts'

const Section = ({
  block: section,
  location,
  colors: colorsLib,
  passCSS,
  className = '',
  csss,
  shortCodeMatchees,
  cookieButton,
}) => {
  if (typeof section === `undefined` || !section) return null

  const { options: optionsData, style: styleData, blocks } = section
  const options = internalJson(optionsData)
  const style = mapStyle(internalJson(styleData))

  const colors = useColors({ options, colorsLib })
  const { isColored, classicCombo } = colors
  const { id, name } = options

  const parentMaxWidth = passCSS?.maxWidth || 1000

  const { layout, list } = addLayoutOptions(options, parentMaxWidth, blocks)

  return (
    <LSection
      {...{
        id,
        name,
        className: `block section ${className || ''}`,
        css: {
          ...csss,
          ...(isColored ? colors[classicCombo].style : {}),
          ...style,
        },
      }}
    >
      <div
        css={{
          alignItems: layout.align || `baseline`,
        }}
      >
        {list &&
          list.map((column, colI) => {
            const { id: colFirstId } = (column && column[0]) || { id: colI }
            if (Object.keys(column).length < 1) {
              return null
            }
            const { itemStyle } = column[0]

            return (
              <div
                key={colFirstId}
                className="column section-column"
                css={{
                  maxWidth: itemStyle.maxWidth,
                }}
              >
                <For
                  of={column}
                  as={block => {
                    const blockProps = {
                      key: block.id,
                      block,
                      colors,
                      location,
                      passCSS: itemStyle,
                    }

                    switch (block.__typename) {
                      case `ContentfulBlockFreeText`:
                        return (
                          <FreeText
                            {...{
                              ...blockProps,
                              shortCodeMatchees,
                              cookieButton,
                            }}
                          />
                        )
                      case `ContentfulBlockForm`:
                        return <Form {...{ ...blockProps }} />
                      case `ContentfulBlockGallery`:
                        return <Gallery {...{ ...blockProps }} />
                      case `ContentfulBlockReferences`:
                        return <References {...{ ...blockProps }} />
                      default:
                        return null
                    }
                  }}
                />
              </div>
            )
          })}
      </div>
    </LSection>
  )
}

export default Section

// export const sectionFragment = graphql`
//   fragment Section on ContentfulSection {
//     id
//     name
//     __typename
//     blocks {
//       ...BlockFreeText
//       ...BlockForm
//       ...BlockGallery
//       ...BlockReferences
//     }
//     options {
//       internal {
//         content
//       }
//     }
//     style {
//       internal {
//         content
//       }
//     }
//   }
// `
