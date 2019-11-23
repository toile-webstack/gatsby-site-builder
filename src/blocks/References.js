import React, { useState } from 'react'
import { graphql } from 'gatsby'
import _ from 'lodash'

import Carousel from '../atoms/Carousel'

import { mapStyle } from '../utils/processCss'
import { rhythm } from '../utils/typography'
import {
  addLayoutOptions,
  // gridLayout,
  // listItemStyle,
} from '../utils/computeGrid'
import { internalJson, useColors } from '../utils'

import CollectionItem from './references/CollectionItem'
import PageReference from './references/PageReference'

const ColumnWrapper = ({ maxWidth, children, className }) => (
  <div
    className={`column ${className || ''}`}
    // maxWidth={itemStyle.maxWidth}
    css={{
      display: `flex`,
      flexFlow: `column`,
      width: `100%`,
      maxWidth,
      // "> div": {
      //   ...this.colors[classicCombo].style,
      //   ":hover": {
      //     ...this.colors[funkyCombo].style,
      //   },
      // },
    }}
  >
    {children}
  </div>
)

const wordAll = {
  fr: 'Tout',
  en: 'All',
  nl: 'Alles',
}

const References = ({
  block,
  colors: colorsLib,
  location,
  className = '',
  passCSS,
}) => {
  if (!block.references) return null

  const {
    options: optionsData,
    style: styleData,
    references,
    node_locale,
  } = block
  const options = internalJson(optionsData)
  const style = mapStyle(internalJson(styleData))

  const colors = useColors({ options, colorsLib })
  const { isColored, classicCombo, funkyCombo, funkyContrastCombo } = colors
  const { id, name, hideCategories, mode } = options

  // CATEGORIES
  // TODO: do this at build time
  let categories = ['']
  if (hideCategories !== true) {
    references.forEach(reference => {
      if (!reference.categories || !reference.categories[0]) return null

      reference.categories.forEach(cat => {
        if (cat !== '' && _.indexOf(categories, cat) === -1) {
          categories.push(cat)
        }
      })
    })
    categories = _.sortBy(categories)
  }
  const [selectedCategory, setSelectedCategory] = useState('')

  const parentMaxWidth = passCSS?.maxWidth || 1000

  // let layout = gridLayout(this.optionsData, parentMaxWidth, block.references)
  const { layout, list } = addLayoutOptions(
    options,
    parentMaxWidth,
    block.references
  )
  const carouselDisplay = mode === `carousel`

  const inner = list.map(column => {
    const { itemStyle, imageStyle } = column[0]

    return column.map((reference, key) => {
      if (
        selectedCategory &&
        _.indexOf(reference.categories, selectedCategory) === -1
      ) {
        return null
      }

      switch (reference.__typename) {
        case `ContentfulPage`:
          return (
            <ColumnWrapper {...{ key, maxWidth: itemStyle.maxWidth }}>
              <PageReference
                {...{
                  key,
                  page: reference,
                  colors,
                  location,
                  layout,
                  blockOptionsData: options,
                  passCSS: imageStyle,
                }}
              />
            </ColumnWrapper>
          )
        default:
          return (
            <ColumnWrapper {...{ key, maxWidth: itemStyle.maxWidth }}>
              <CollectionItem
                {...{
                  key,
                  collectionItem: reference,
                  colors,
                  location,
                  layout,
                  blockOptionsData: options,
                  passCSS: imageStyle,
                }}
              />
            </ColumnWrapper>
          )
      }
    })
  })

  return (
    <div
      {...{
        id,
        name,
        className: `block blockReferences ${className}`,
        css: {
          width: `100%`,
          maxWidth: `1000px`,
          margin: `auto`,
          flexGrow: 1,
          display: `flex`,
          flexFlow: `column`,
          // ...passCSS,
          ...(isColored ? colors[classicCombo].style : {}),
          ...style,
        },
      }}
    >
      {categories.length > 1 && (
        <div
          className="blockReferences-categories"
          css={{
            display: `flex`,
            flexFlow: `row wrap`,
            justifyContent: `center`,
          }}
        >
          {categories &&
            categories.map(cat => {
              const combo =
                selectedCategory === cat ? funkyContrastCombo : funkyCombo
              // const combo = funkyContrastCombo
              const category = cat || wordAll[node_locale.split('-')[0]]

              return (
                <div
                  key={category}
                  role="button"
                  onClick={() => {
                    setSelectedCategory(cat)
                  }}
                  onKeyPress={() => {
                    setSelectedCategory(cat)
                  }}
                  tabIndex="0"
                  css={{
                    ...colors[combo].style,
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
          justifyContent: [`space-around`, `space-evenly`],
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
          ...passCSS,
          ...colors[classicCombo].style,
          ...style,
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

// TODO: delete when we have refactored CollectionItem and PageReference
// class BlockReferences extends React.Component {
//   constructor(props) {
//     super(props)
//     // _json_ fields
//     const { options, style } = props.block
//     this.optionsData = internalJson(options)
//     this.styleData = mapStyle(internalJson(style))

//     // Colors
//     let { colorPalettes, colorCombo, hideCategories } = this.optionsData
//     colorCombo = colorCombo
//       ? props.colors[`${colorCombo}Combo`]
//       : props.colors.classicCombo
//     colorPalettes = colorPalettes || props.colors.colorPalettes
//     const newColors = props.colors.computeColors(colorPalettes, colorCombo)
//     this.colors = { ...props.colors, ...newColors }

//     this.categories = ['']

//     if (hideCategories !== true) {
//       props.block.references.forEach(reference => {
//         if (!reference.categories || !reference.categories[0]) return null

//         reference.categories.forEach(cat => {
//           if (cat !== '' && _.indexOf(this.categories, cat) === -1) {
//             this.categories.push(cat)
//           }
//         })
//       })
//       this.categories = _.sortBy(this.categories)
//     }

//     this.state = {
//       selectedCategory: '',
//     }
//   }

//   render() {
//     const {
//       classicCombo,
//       contrastCombo,
//       funkyCombo,
//       funkyContrastCombo,
//     } = this.colors

//     const block = this.props.block
//     if (Object.keys(block).length < 1) {
//       return null
//     }
//     const { node_locale } = block

//     const parentMaxWidth =
//       (this.props.passCSS && this.props.passCSS.maxWidth) || 1000

//     // let layout = gridLayout(this.optionsData, parentMaxWidth, block.references)
//     const { layout, list } = addLayoutOptions(
//       this.optionsData,
//       parentMaxWidth,
//       block.references
//     )

//     const carouselDisplay =
//       this.optionsData.mode && this.optionsData.mode === `carousel`

//     const inner = list.map((column, key) => {
//       // if (Object.keys(reference).length < 1) {
//       //   return null
//       // }
//       // const itemStyle = listItemStyle(layout, key)
//       const itemStyle = column[0].itemStyle
//       const imageStyle = column[0].imageStyle

//       return column.map((reference, key) => {
//         const { selectedCategory } = this.state

//         if (
//           selectedCategory &&
//           _.indexOf(reference.categories, selectedCategory) === -1
//         ) {
//           return null
//         }
//         switch (reference.__typename) {
//           case `ContentfulCollectionItem`:
//             return (
//               <ColumnWrapper>
//                 <CollectionItem
//                   key={key}
//                   collectionItem={reference}
//                   colors={this.colors}
//                   location={this.props.location}
//                   layout={layout}
//                   blockOptionsData={this.optionsData}
//                   passCSS={imageStyle}
//                 />
//               </ColumnWrapper>
//             )
//             break
//           case `ContentfulPage`:
//             return (
//               <ColumnWrapper>
//                 <PageReference
//                   key={key}
//                   page={reference}
//                   colors={this.colors}
//                   location={this.props.location}
//                   layout={layout}
//                   blockOptionsData={this.optionsData}
//                   passCSS={imageStyle}
//                 />
//               </ColumnWrapper>
//             )
//             break
//           default:
//         }
//       })

//       // return (
//       //   <div
//       //     key={key}
//       //     css={{
//       //       padding: `${rhythm(1 / 4)} ${rhythm(1 / 8)}`
//       //     }}
//       //   >
//       //     {reference.id}
//       //   </div>
//       // )
//     })

//     const { id: htmlId, name: htmlName } = this.optionsData

//     return (
//       <div
//         id={htmlId}
//         name={htmlName}
//         className="block blockReferences"
//         css={{
//           width: `100%`,
//           maxWidth: `1000px`,
//           margin: `auto`,
//           flexGrow: 1,
//           display: `flex`,
//           flexFlow: `column`,
//         }}
//       >
//         {this.categories.length > 1 && (
//           <div
//             className="blockReferences-categories"
//             css={{
//               display: `flex`,
//               flexFlow: `row wrap`,
//               justifyContent: `center`,
//             }}
//           >
//             {this.categories &&
//               this.categories.map((cat, i) => {
//                 const combo =
//                   this.state.selectedCategory === cat
//                     ? funkyContrastCombo
//                     : funkyCombo
//                 // const combo = funkyContrastCombo
//                 let category = cat
//                 if (cat === '')
//                   switch (node_locale.split('-')[0]) {
//                     case 'fr':
//                       category = 'Tout'
//                       break
//                     case 'en':
//                       category = 'All'
//                       break
//                     case 'nl':
//                       category = 'Alles'
//                       break
//                     default:
//                   }
//                 return (
//                   <div
//                     key={i}
//                     onClick={() => {
//                       this.setState({ selectedCategory: cat })
//                     }}
//                     css={{
//                       margin: `${rhythm(1 / 4)} ${rhythm(1 / 4)}`,
//                       padding: `${rhythm(1 / 8)} ${rhythm(1 / 4)}`,
//                       cursor: `pointer`,
//                       border: `solid 1px`,
//                       ...this.colors[combo].style,
//                     }}
//                   >
//                     {category}
//                   </div>
//                 )
//               })}
//           </div>
//         )}
//         <div
//           css={{
//             padding: rhythm(1),
//             display: `flex`,
//             flexFlow: `row wrap`,
//             justifyContent: `space-around`,
//             justifyContent: `space-evenly`,
//             alignItems: `flex-start`,
//             width: `100%`,
//             margin: `0 auto`,
//             // "> a": {
//             //   width: `100%`,
//             //   maxWidth:
//             //     block.references.length < 3
//             //       ? `calc((1000px - ${rhythm(2)}) / ${block.references.length})`
//             //       : `calc((1000px - ${rhythm(2)}) / 3)`,
//             //   // margin: `auto`,
//             //   padding: `${rhythm(1 / 2)} ${rhythm(1 / 8)}`
//             // },
//             ' .image': {
//               // height: `200px` // TODO: check if it does not scew up block references but wes posing problem for Testimonials
//             },
//             ' h3': {
//               marginTop: 0,
//             },
//             ...this.props.passCSS,
//             ...this.colors[classicCombo].style,
//             ...this.styleData,
//             // " a.button:hover": {
//             //   ...this.colors[funkyContrastCombo].style,
//             //   borderColor: this.colors[classicCombo].border
//             // }
//           }}
//         >
//           {carouselDisplay ? <Carousel>{inner}</Carousel> : inner}
//         </div>
//       </div>
//     )
//   }
// }

export default References

export const blockReferencesFragment = graphql`
  fragment BlockReferences on ContentfulBlockReferences {
    id
    name
    node_locale
    __typename
    references {
      ...CollectionItem
      ...PageReference
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
