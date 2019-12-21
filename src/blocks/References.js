import React, { useState, useMemo } from 'react'
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
import { LBlockReferences } from '../t-layouts'

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
const messageNoMatch = {
  fr: 'Aucun élément ne correspond à votre recherche',
  en: 'There is no match with this search',
  nl: 'Er is geen overeenkomst met deze zoekopdracht',
}

const decomposeCategory = cat => {
  const catSplit = cat.split(':')
  const [family, familyIndex] =
    catSplit.length > 1 ? catSplit[0].split('|') : ['main']
  const label = catSplit[catSplit.length - 1]
  return { family, familyIndex, label }
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
  const locale = node_locale.split('-')[0]
  const wAll = wordAll[locale]
  const mNoMatch = messageNoMatch[locale]
  const colors = useColors({ options, colorsLib })
  const { isColored, classicCombo, funkyCombo, funkyContrastCombo } = colors
  const {
    id,
    name,
    hideCategories,
    mode,
    categories: { families: catFamiliesOptions } = {},
  } = options

  // CATEGORIES
  // TODO: do this at build time or using memo
  const categories = useMemo(() => {
    let showCategories = false
    let all = []
    // catFamiliesOptions can be set to something like ["place", "main"]
    // to indicate we want to show the place family first
    const byFamily = new Map()
    // Initialize families with a null value corresponding to "All"
    if (Array.isArray(catFamiliesOptions)) {
      catFamiliesOptions.forEach(catFamily => {
        byFamily.set(
          catFamily,
          new Map([
            [
              '',
              {
                family: catFamily,
                // raw: `${catFamily}:${wAll}`,
                label: wAll,
              },
            ],
          ])
        )
      })
    } else {
      byFamily.set(
        'main',
        new Map([
          [
            '',
            {
              family: 'main',
              // raw: `main:${wAll}`,
              label: wAll,
            },
          ],
        ])
      )
    }
    if (!byFamily.has('main') || byFamily.get('main').length < 1) {
      // if we use categories families, we need to initialize the main array with an empty string
      byFamily.set(
        'main',
        new Map([
          [
            '',
            {
              family: 'main',
              // raw: `main:${wAll}`,
              label: wAll,
            },
          ],
        ])
      )
    }
    // End initialize
    // const initialState = new Map(byFamily)
    // fill in the arrays "all" and each one in "byFamily"
    if (hideCategories !== true) {
      references.forEach(reference => {
        const refCats = reference.categories || []

        refCats.forEach(cat => {
          const { family, familyIndex, label } = decomposeCategory(cat)
          // This is the shape of a cat
          const catSmart = { raw: cat, family, familyIndex, label }

          const familyMap = byFamily.get(family)
          if (cat && !familyMap.has(cat)) {
            all = [...all, catSmart]
            familyMap.set(cat, catSmart)
            // byFamily.set(family, [...(byFamily.get || []), catSmart])
          }

          // if (cat !== '' && _.indexOf(categories.main, cat) === -1) {
          //   categories.main = [...categories.main, cat]
          // }
        })
      })

      const catFamilies = Array.from(byFamily.keys())
      catFamilies.forEach(family => {
        const familyMap = byFamily.get(family)
        if (familyMap.size > 1) {
          showCategories = true
        }
        familyMap.set(family, [...familyMap.entries()].sort())
        // familyMap.sort()
        // byFamily.set(family, _.sortBy(familyArray))
      })

      // categories.main = _.sortBy(categories.main)
    }

    return {
      all, // [ ...allCats ]
      byFamily, // Map(
      //     place: [ ...someCats ],
      //     main: [ ...someOtherCats ],
      //   )
      show: showCategories, // bool
      // initialState, // Map(
      //     place: [],
      //     main: [],
      //   )
    }
  }, [catFamiliesOptions, hideCategories])

  // Declare state when categories are empty
  const [stateCategories, setCatState] = useState(new Map(categories.byFamily))
  const resetFamilyCategories = family => {
    setCatState(prevState => {
      const newState = new Map(prevState)
      const familyMap = newState.get(family)
      familyMap.forEach(catSmart => {
        if (Array.isArray(catSmart)) return null
        // familyMap.set(mapKey, { ...catSmart, isSelected: false })
        catSmart.isSelected = false
      })
      return newState
    })
  }
  const selectCategory = ({ family, raw }) => {
    if (!raw) {
      resetFamilyCategories(family)
    } else {
      setCatState(prevState => {
        const newState = new Map(prevState)
        const catToSelect = newState.get(family).get(raw)
        catToSelect.isSelected = !catToSelect.isSelected
        return newState
      })
    }
  }

  const showRef = refCats => {
    let filter = false
    const byFamily = {}
    // Loop over each family in stateCategories
    stateCategories.forEach((familyMap, family) => {
      familyMap.forEach(catSmart => {
        // if no tag is selected in a family, we don't care about it
        if (catSmart.isSelected) {
          filter = true
          byFamily[family] = [...(byFamily[family] || []), catSmart.raw]
        }
      })
    })

    if (!filter) return true

    // construct a condition to show based on selected
    // // in one family, can have any cat selected
    // // must have a corresponding tag if something is selected in a family
    const showByFamily = Object.entries(byFamily).map(
      ([family, catRawArray]) => {
        return catRawArray.some(cat => refCats.indexOf(cat) > -1)
      }
    )
    return showByFamily.every(bool => bool)
  }

  const parentMaxWidth = passCSS?.maxWidth || 1000

  // let layout = gridLayout(this.optionsData, parentMaxWidth, block.references)
  const { layout, list } = addLayoutOptions(
    options,
    parentMaxWidth,
    block.references.filter(ref => showRef(ref.categories))
  )
  const carouselDisplay = mode === `carousel`

  const inner =
    list.length < 1 ? (
      <div>{mNoMatch}</div>
    ) : (
      list.map(column => {
        const { itemStyle, imageStyle } = column[0]

        return column.map((reference, key) => {
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
    )

  return (
    <div
      {...{
        id,
        name,
        className: `block-wrapper ${className}`,
        css: {
          width: `100%`,
          maxWidth: `1000px`,
          margin: `auto`,
          flexGrow: 1,
          display: `flex`,
          flexFlow: `column`,
          ...(isColored ? colors[classicCombo].style : {}),
          ...style,
        },
      }}
    >
      {categories.show &&
        Array.from(stateCategories.entries()).map(([family, familyMap], i) => {
          // console.log(Array.from(familyMap.values()))
          const noCatSelected = Array.from(familyMap.values()).reduce(
            (acc, currVal) => {
              if (acc === false) return false
              return !currVal.isSelected
            },
            true
          )
          return (
            <div
              key={family}
              className="blockReferences-categories"
              css={{
                display: `flex`,
                flexFlow: `row wrap`,
                justifyContent: `center`,
                marginTop: i > 0 ? rhythm(1 / 2) : 0,
              }}
            >
              {Array.from(familyMap.values()).map(catSmart => {
                // TODO: understand why the whole family is put as an array inside this family mapping
                if (Array.isArray(catSmart)) return null

                const { isSelected, label, raw } = catSmart
                // || {
                //  raw: null,
                //  family,
                //  label: wAll,
                // }
                const combo =
                  isSelected || (noCatSelected && !raw)
                    ? funkyContrastCombo
                    : funkyCombo

                return (
                  <div
                    key={raw || label}
                    role="button"
                    onClick={() => {
                      selectCategory(catSmart)
                    }}
                    onKeyPress={() => {
                      selectCategory(catSmart)
                    }}
                    tabIndex="0"
                    css={{
                      margin: `${rhythm(1 / 4)} ${rhythm(1 / 4)}`,
                      padding: `${rhythm(1 / 8)} ${rhythm(1 / 4)}`,
                      cursor: `pointer`,
                      border: `solid 1px`,
                      ...colors[combo].style,
                    }}
                  >
                    {label}
                  </div>
                )
              })}
            </div>
          )
        })}
      <LBlockReferences
        className="block blockReferences"
        css={{
          ...(layout.align && { alignItems: layout.align }),
          ...passCSS,
          ...colors[classicCombo].style,
          ...style,
        }}
      >
        {carouselDisplay ? <Carousel>{inner}</Carousel> : inner}
      </LBlockReferences>
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
