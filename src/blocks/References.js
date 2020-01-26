import React, { useState, useMemo, useEffect } from 'react'
// import { graphql } from 'gatsby'
import qs from 'qs'

import { navigate } from '@reach/router'

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

import View from '../../libs/nuds-view-component'

const ColumnWrapper = ({ maxWidth, children, className }) => (
  <div
    className={`column ${className || ''}`}
    // maxWidth={itemStyle.maxWidth}
    css={{
      display: `flex`,
      flexFlow: `column`,
      width: `100%`,
      maxWidth,
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
  const raw = `${family}${familyIndex ? `|${familyIndex}` : ''}:${label}`
  return { family, familyIndex, label, raw }
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
    categories: { families: catFamiliesOptions, showQueryString } = {},
  } = options

  // CATEGORIES
  const categories = useMemo(() => {
    let showCategories = false
    // const familiesObj = {}
    let families = Array.isArray(catFamiliesOptions) ? catFamiliesOptions : []
    const allObj = {}
    let all = []
    const byFamilyObj = {}
    // catFamiliesOptions can be set to something like ["place", "main"]
    // to indicate we want to show the place family first

    if (hideCategories !== true) {
      // fill in the arrays "all" and each one in "byFamily"
      // construct the 'all' array ordered
      references.forEach(reference => {
        const refCats = reference.categories || []

        refCats.forEach(cat => {
          if (!cat) return null

          const {
            family,
            // familyIndex, label,
            raw,
          } = decomposeCategory(cat)
          // NOTE: this would add the empty tag we need for each family
          // allObj[`${family}:`] = true
          // NOTE: this would be usefull if we need to populate families without a family order option
          // familiesObj[family] = true
          families =
            families.indexOf(family) > -1 ? families : [...families, family]
          allObj[raw] = true
        })
      })
      all = Object.keys(allObj).sort()
      showCategories = all.length > 0
      // families = Object.keys(familiesObj)

      all.forEach(rawCat => {
        const catSmart = decomposeCategory(rawCat)
        const { family } = catSmart

        byFamilyObj[family] = byFamilyObj[family]
          ? [...byFamilyObj[family], catSmart]
          : [
              {
                family,
                // raw: `${catFamily}:${wAll}`,
                label: wAll,
              },
              catSmart,
            ]
      })
    }

    return {
      all, // [ ...allCats ]
      families, // families ordered by options
      byFamilyObj, // families of cats with an empty value at the start (for the "all" button)
      show: showCategories, // bool
    }
  }, [catFamiliesOptions, hideCategories])

  // Declare state when categories are empty
  const [stateCategories, setCatState] = useState({ ...categories.byFamilyObj })

  // Compare current querry string and state and sync
  useEffect(() => {
    const { search } = location
    const queryParams = qs.parse(search, {
      ignoreQueryPrefix: true,
      comma: true,
      encode: false,
    })
    // always an array. Can be empty
    const qsCategories = Array.isArray(queryParams.categories)
      ? queryParams.categories
      : (queryParams.categories && [queryParams.categories]) || []

    if (qsCategories.length > 0) {
      const qsCatsByFamily = qsCategories.reduce((acc, rawCat) => {
        const { family } = decomposeCategory(rawCat)
        return {
          ...acc,
          [family]: [...(acc[family] || []), rawCat],
        }
      }, {})
      setCatState(prevState => {
        const newState = { ...prevState }
        Object.entries(qsCatsByFamily).forEach(([family, rawCats]) => {
          if (!newState[family]) return null

          newState[family] = newState[family].map(smartCat => {
            const isSelected = rawCats.indexOf(smartCat.raw) > -1
            return {
              ...smartCat,
              ...(isSelected ? { isSelected: true } : null),
            }
          })
        })
        return newState
      })
    }
  }, [])
  useEffect(() => {
    if (showQueryString) {
      // Handle query strings for categories
      const qsStringifyOptions = {
        addQueryPrefix: true,
        encode: false,
        arrayFormat: 'comma',
      }

      const cats = Object.values(stateCategories).reduce((acc, currFamily) => {
        const selectedCats = currFamily
          .filter(({ isSelected }) => isSelected)
          .map(({ raw }) => raw)
        return [...acc, ...selectedCats]
      }, [])

      const queryString =
        cats.length < 1
          ? '.'
          : qs.stringify({ categories: cats }, qsStringifyOptions)
      navigate(`${queryString}`, { replace: true })
    }
  }, [stateCategories])

  const resetFamilyCategories = family => {
    setCatState(prevState => {
      const newState = { ...prevState }
      newState[family] = newState[family].map(
        ({ isSelected, ...catSmart }) => catSmart
      )
      return newState
    })
  }
  const selectCategory = ({ family, raw }) => {
    if (!raw) {
      resetFamilyCategories(family)
    } else {
      setCatState(prevState => {
        const newState = { ...prevState }
        newState[family] = newState[family].map(catSmart =>
          catSmart.raw === raw
            ? { ...catSmart, isSelected: !catSmart.isSelected }
            : catSmart
        )
        return newState
      })
    }
  }

  const showRef = refCats => {
    let filter = false

    const selectedByFamily = {}
    // Loop over each family in stateCategories
    Object.entries(stateCategories).forEach(([family, familyCats]) => {
      familyCats.forEach(catSmart => {
        // if no tag is selected in a family, we don't care about it
        if (catSmart.isSelected) {
          filter = true
          selectedByFamily[family] = [
            ...(selectedByFamily[family] || []),
            catSmart.raw,
          ]
        }
      })
    })

    if (!filter) return true

    // construct a condition to show based on selected
    // // in one family, can have any cat selected
    // // must have a corresponding tag if something is selected in a family
    const showByFamily = Object.entries(selectedByFamily).map(
      ([family, catRawArray]) => {
        return catRawArray.some(cat => {
          // we have to strip "main:" from raw names in our cats
          const catToCheck = /^main:/.test(cat) ? cat.split(':')[1] : cat
          return refCats.indexOf(catToCheck) > -1
        })
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

        // Original branch
        //     switch (reference.__typename) {
        //       case `ContentfulPage`:
        //         return (
        //           <ColumnWrapper {...{ key, maxWidth: itemStyle.maxWidth }}>
        //             <PageReference
        //               {...{
        //                 key,
        //                 page: reference,
        //                 colors,
        //                 location,
        //                 layout,
        //                 blockOptionsData: options,
        //                 passCSS: imageStyle,
        //               }}
        //             />
        //           </ColumnWrapper>
        //         )
        //       default:
        //         return (
        //           <ColumnWrapper {...{ key, maxWidth: itemStyle.maxWidth }}>
        //             <CollectionItem
        //               {...{
        //                 key,
        //                 collectionItem: reference,
        //                 colors,
        //                 location,
        //                 layout,
        //                 blockOptions: options,
        //                 passCSS: imageStyle,
        //               }}
        //             />
        //           </ColumnWrapper>
        //         )
        //     }
        //   })
        // })

        // beta branch
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
        categories.families.map((family, i) => {
          const familyCats = stateCategories[family]
          if (!familyCats) return null

          const noCatSelected = familyCats.reduce((acc, currVal) => {
            if (acc === false) return false
            return !currVal.isSelected
          }, true)
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
              {familyCats.map(catSmart => {
                const { isSelected, label, raw } = catSmart

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

const useReferences = ({
  block,
  colors: colorsLib,
  location,
  className = '',
  passCSS,
  locale: localeUnsafe,
  ...rest
}) => {
  const {
    options,
    style,
    references,
    // node_locale,
  } = block

  const locale = localeUnsafe.split('-')[0]
  const wAll = wordAll[locale]
  const mNoMatch = messageNoMatch[locale]
  // const colors = useColors({ options, colorsLib })
  // const { isColored, classicCombo, funkyCombo, funkyContrastCombo } = colors
  const {
    id,
    name,
    hideCategories,
    mode,
    categories: { families: catFamiliesOptions, showQueryString } = {},
  } = options

  // CATEGORIES
  const categories = useMemo(() => {
    let showCategories = false
    // const familiesObj = {}
    let families = Array.isArray(catFamiliesOptions) ? catFamiliesOptions : []
    const allObj = {}
    let all = []
    const byFamilyObj = {}
    // catFamiliesOptions can be set to something like ["place", "main"]
    // to indicate we want to show the place family first

    if (hideCategories !== true) {
      // fill in the arrays "all" and each one in "byFamily"
      // construct the 'all' array ordered
      references.forEach(reference => {
        const refCats = reference.categories || []

        refCats.forEach(cat => {
          if (!cat) return null

          const {
            family,
            // familyIndex, label,
            raw,
          } = decomposeCategory(cat)
          // NOTE: this would add the empty tag we need for each family
          // allObj[`${family}:`] = true
          // NOTE: this would be usefull if we need to populate families without a family order option
          // familiesObj[family] = true
          families =
            families.indexOf(family) > -1 ? families : [...families, family]
          allObj[raw] = true
        })
      })
      all = Object.keys(allObj).sort()
      showCategories = all.length > 0
      // families = Object.keys(familiesObj)

      all.forEach(rawCat => {
        const catSmart = decomposeCategory(rawCat)
        const { family } = catSmart

        byFamilyObj[family] = byFamilyObj[family]
          ? [...byFamilyObj[family], catSmart]
          : [
              {
                family,
                // raw: `${catFamily}:${wAll}`,
                label: wAll,
              },
              catSmart,
            ]
      })
    }

    return {
      all, // [ ...allCats ]
      families, // families ordered by options
      byFamilyObj, // families of cats with an empty value at the start (for the "all" button)
      show: showCategories, // bool
    }
  }, [catFamiliesOptions, hideCategories])

  // Declare state when categories are empty
  const [stateCategories, setCatState] = useState({ ...categories.byFamilyObj })

  // Compare current querry string and state and sync
  useEffect(() => {
    const { search } = location
    const queryParams = qs.parse(search, {
      ignoreQueryPrefix: true,
      comma: true,
      encode: false,
    })
    // always an array. Can be empty
    const qsCategories = Array.isArray(queryParams.categories)
      ? queryParams.categories
      : (queryParams.categories && [queryParams.categories]) || []

    if (qsCategories.length > 0) {
      const qsCatsByFamily = qsCategories.reduce((acc, rawCat) => {
        const { family } = decomposeCategory(rawCat)
        return {
          ...acc,
          [family]: [...(acc[family] || []), rawCat],
        }
      }, {})
      setCatState(prevState => {
        const newState = { ...prevState }
        Object.entries(qsCatsByFamily).forEach(([family, rawCats]) => {
          if (!newState[family]) return null

          newState[family] = newState[family].map(smartCat => {
            const isSelected = rawCats.indexOf(smartCat.raw) > -1
            return {
              ...smartCat,
              ...(isSelected ? { isSelected: true } : null),
            }
          })
        })
        return newState
      })
    }
  }, [])
  useEffect(() => {
    if (showQueryString) {
      // Handle query strings for categories
      const qsStringifyOptions = {
        addQueryPrefix: true,
        encode: false,
        arrayFormat: 'comma',
      }

      const cats = Object.values(stateCategories).reduce((acc, currFamily) => {
        const selectedCats = currFamily
          .filter(({ isSelected }) => isSelected)
          .map(({ raw }) => raw)
        return [...acc, ...selectedCats]
      }, [])

      const queryString =
        cats.length < 1
          ? '.'
          : qs.stringify({ categories: cats }, qsStringifyOptions)
      navigate(`${queryString}`, { replace: true })
    }
  }, [stateCategories])

  const resetFamilyCategories = family => {
    setCatState(prevState => {
      const newState = { ...prevState }
      newState[family] = newState[family].map(
        ({ isSelected, ...catSmart }) => catSmart
      )
      return newState
    })
  }
  const selectCategory = ({ family, raw }) => {
    if (!raw) {
      resetFamilyCategories(family)
    } else {
      setCatState(prevState => {
        const newState = { ...prevState }
        newState[family] = newState[family].map(catSmart =>
          catSmart.raw === raw
            ? { ...catSmart, isSelected: !catSmart.isSelected }
            : catSmart
        )
        return newState
      })
    }
  }

  const showRef = refCats => {
    let filter = false

    const selectedByFamily = {}
    // Loop over each family in stateCategories
    Object.entries(stateCategories).forEach(([family, familyCats]) => {
      familyCats.forEach(catSmart => {
        // if no tag is selected in a family, we don't care about it
        if (catSmart.isSelected) {
          filter = true
          selectedByFamily[family] = [
            ...(selectedByFamily[family] || []),
            catSmart.raw,
          ]
        }
      })
    })

    if (!filter) return true

    // construct a condition to show based on selected
    // // in one family, can have any cat selected
    // // must have a corresponding tag if something is selected in a family
    const showByFamily = Object.entries(selectedByFamily).map(
      ([family, catRawArray]) => {
        return catRawArray.some(cat => {
          // we have to strip "main:" from raw names in our cats
          const catToCheck = /^main:/.test(cat) ? cat.split(':')[1] : cat
          return refCats.indexOf(catToCheck) > -1
        })
      }
    )
    return showByFamily.every(bool => bool)
  }

  // const parentMaxWidth = passCSS?.maxWidth || 1000

  // let layout = gridLayout(this.optionsData, parentMaxWidth, block.references)
  // const { layout, list } = addLayoutOptions(
  //   options,
  //   parentMaxWidth,
  //   block.references.filter(ref => showRef(ref.categories))
  // )
  const carouselDisplay = mode === `carousel`

  return {
    ...rest,
    ...block,
    mNoMatch,
    options,
    carouselDisplay,
    id,
    name,
    className,
    style,
    categories,
    selectCategory,
    stateCategories,
  }
}

const Markup = ({
  mNoMatch,
  options,
  carouselDisplay,
  id,
  name,
  className,
  style,
  categories,
  selectCategory,
  stateCategories,
  references = [],
}) => {
  const inner =
    references.length < 1 ? (
      <div>{mNoMatch}</div>
    ) : (
      references.map(reference => {
        // beta branch
        switch (reference.contentType) {
          case `page`:
            return (
              <PageReference
                {...{
                  key: reference.id,
                  page: reference,
                  // colors,
                  // location,
                  // layout,
                  blockOptionsData: options,
                  // passCSS: imageStyle,
                }}
              />
            )
          default:
            return (
              <CollectionItem
                {...{
                  key: reference.id,
                  collectionItem: reference,
                  // colors,
                  // location,
                  // layout,
                  blockOptionsData: options,
                  // passCSS: imageStyle,
                }}
              />
            )
        }
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
          // ...(isColored ? colors[classicCombo].style : {}),
          ...style,
        },
      }}
    >
      {categories.show &&
        categories.families.map((family, i) => {
          const familyCats = stateCategories[family]
          if (!familyCats) return null

          const noCatSelected = familyCats.reduce((acc, currVal) => {
            if (acc === false) return false
            return !currVal.isSelected
          }, true)
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
              {familyCats.map(catSmart => {
                const { isSelected, label, raw } = catSmart

                //const combo =
                //isSelected || (noCatSelected && !raw)
                //? funkyContrastCombo
                //: funkyCombo

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
                      // ...colors[combo].style,
                    }}
                  >
                    {label}
                  </div>
                )
              })}
            </div>
          )
        })}
      <div
        className="block blockReferences"
        css={{
          // ...(layout.align && { alignItems: layout.align }),
          // ...passCSS,
          // ...colors[classicCombo].style,
          ...style,
        }}
      >
        {carouselDisplay ? <Carousel>{inner}</Carousel> : inner}
      </div>
    </div>
  )
}

const ReferencesO = ({ ...data }) => (
  <View
    {...{
      data,
      useData: useReferences,
      Markup,
    }}
  />
)

export default ReferencesO

// export const blockReferencesFragment = graphql`
//   fragment BlockReferences on ContentfulBlockReferences {
//     id
//     name
//     node_locale
//     __typename
//     references {
//       ...CollectionItem
//       ...PageReference
//     }
//     options {
//       internal {
//         content
//       }
//       # colorPalettes
//       # colorCombo
//     }
//     style {
//       internal {
//         content
//       }
//     }
//   }
// `
