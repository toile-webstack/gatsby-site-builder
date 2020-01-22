// TODO: Extract in a plugin
import { typoRhythm, rhythm, scale } from './typography'

const addLayoutOptions = (options = {}, parentMaxWidth = 1000, list) => {
  const layout = options.layout || {}
  layout.align =
    layout.align ||
    options.align ||
    (layout.name === 'imgUnder' && 'bottom') ||
    ``
  layout.columns = layout.columns || options.columns || ['1']
  layout.shape = layout.shape || options.shape || ``
  layout.rows = eval(layout.rows) || eval(options.rows) || 1
  layout.name = layout.name || ''

  switch (layout.align) {
    case `top`:
      layout.align = `flex-start`
      break
    case `bottom`:
      layout.align = `flex-end`
      break
    case `center`:
      layout.align = `center`
      break
    case `stretch`:
      layout.align = `stretch`
      break
    default:
      layout.align = `baseline`
  }

  layout.maxWidth = parentMaxWidth - typoRhythm * 2
  const paternLength = layout.columns.length
  layout.containerMaxWidths = []
  layout.imageMaxWidths = []
  layout.imageMaxHeights = []

  if (list) {
    // duplicate or triplicate or... if multiple rows
    if (layout.rows > 1) {
      for (let j = layout.columns.length - 1; j >= 0; j--) {
        for (let k = 1; k < layout.rows + 1; k++) {
          layout.columns[(j + 1) * layout.rows - k] = layout.columns[j]
        }
      }
    }
    // construct whole columns list
    list.forEach((listItem, i) => {
      layout.columns[i] = layout.columns[i] || layout.columns[i - paternLength]
    })
    // fraction or percentage max width
    list = list.map((listItem, i, list) => {
      if (layout.columns[i].match('%')) {
        layout.containerMaxWidths[i] = layout.columns[i]
        // TODO: not working with images
      } else {
        const fraction = eval(layout.columns[i]) || 1
        layout.containerMaxWidths[i] = layout.maxWidth * fraction
        layout.imageMaxWidths[i] =
          layout.containerMaxWidths[i] - (typoRhythm * 2) / 4
        layout.imageMaxHeights[i] = !layout.shape
          ? `100%`
          : layout.shape.match(/square|circle/)
          ? layout.imageMaxWidths[i]
          : layout.shape.match(/landscape/)
          ? layout.imageMaxWidths[i] * 0.618
          : `100%`
      }
      listItem.itemStyle = {
        width: `100%`,
        // maxWidth: layout.containerMaxWidths[i],
        // width: layout.columns[i].match("%")
        //   ? layout.containerMaxWidths[i]
        //   : `100%`,
        maxWidth: layout.columns[i].match('%')
          ? `100%`
          : layout.containerMaxWidths[i],
        flexGrow: layout.align === `stretch` ? 1 : 0,
        display: `flex`,
        alignContent: `flex-start`,
        alignItems: `flex-start`,
        // padding: `${rhythm(1)} ${rhythm(1 / 4)}`
        // " .image": {
        //   height: layout.childMaxHeights[i],
        //   borderRadius: layout.shape && layout.shape.match(/circle/) ? `50%` : `0`
        // }
      }
      listItem.imageStyle = {
        width: `100%`,
        maxWidth: layout.columns[i].match('%')
          ? `100%`
          : layout.containerMaxWidths[i],
        padding: rhythm(1 / 4),
        ' .image': {
          height: layout.imageMaxHeights[i],
          borderRadius:
            layout.shape && layout.shape.match(/circle/) ? `50%` : `0`,
        },
      }
      listItem.previewStyle = {
        width: `100%`,
        maxWidth: layout.containerMaxWidths[i],
        // padding: rhythm(1 / 4),
        ' .image': {
          height: layout.imageMaxHeights[i],
          borderRadius:
            layout.shape && layout.shape.match(/circle/) ? `50%` : `0`,
        },
      }
      return listItem
    })

    // Account for multiple rows in each column
    let newList = []
    list.forEach((listItem, i) => {
      if (newList[Math.floor(i / layout.rows)]) {
        newList[Math.floor(i / layout.rows)].push(listItem)
      } else {
        newList[Math.floor(i / layout.rows)] = [listItem]
      }
    })

    list = newList
  }
  return { layout, list }
}

export { addLayoutOptions }

const gridLayout = (options = {}, parentMaxWidth = 1000, list) => {
  const layout = options.layout || {}
  layout.align = layout.align || options.align || ``
  layout.columns = layout.columns || options.columns || ['1']
  layout.shape = layout.shape || options.shape || ``
  layout.rows = layout.rows || options.rows || 1

  switch (layout.align) {
    case `top`:
      layout.align = `flex-start`
      break
    case `bottom`:
      layout.align = `flex-end`
      break
    case `center`:
      layout.align = `center`
      break
    case `stretch`:
      layout.align = `stretch`
      break
    default:
      layout.align = `baseline`
  }

  layout.maxWidth = parentMaxWidth - typoRhythm * 2
  const paternLength = layout.columns.length
  layout.containerMaxWidths = []
  layout.imageMaxWidths = []
  layout.imageMaxHeights = []

  if (list) {
    list.forEach((listItem, i, list) => {
      // complement layout columns patern based on what is entered
      layout.columns[i] = layout.columns[i] || layout.columns[i - paternLength]

      if (layout.columns[i].match('%')) {
        layout.containerMaxWidths[i] = layout.columns[i]
      } else {
        const fraction = eval(layout.columns[i]) || 1
        // let colNumerator = 1
        // // let colDenominator = list.length < 4 ? list.length : 3
        // let colDenominator = 1
        // const divisionAsArray = layout.columns[i].split("/")
        // colNumerator = divisionAsArray[0]
        //   ? parseFloat(divisionAsArray[0])
        //   : colNumerator
        // colDenominator = divisionAsArray[1]
        //   ? parseFloat(divisionAsArray[1])
        //   : colDenominator

        // layout.childMaxWidths[i] =
        //   (parentMaxWidth - typoRhythm * 2) * colNumerator / colDenominator
        // layout.containerMaxWidths[i] =
        //   layout.maxWidth * colNumerator / colDenominator
        layout.containerMaxWidths[i] = layout.maxWidth * fraction
        layout.imageMaxWidths[i] =
          layout.containerMaxWidths[i] - (typoRhythm * 2) / 4
        // layout.childMaxHeights[i] =
        //   (layout.maxWidth - typoRhythm * 5 / 2) * colNumerator / colDenominator
        layout.imageMaxHeights[i] = !layout.shape
          ? `100%`
          : layout.shape.match(/square|circle/)
          ? layout.imageMaxWidths[i]
          : layout.shape.match(/landscape/)
          ? layout.imageMaxWidths[i] * 0.618
          : `100%`
      }
    })
  }
  return layout
}

export { gridLayout }

const listItemStyle = (layout, i) => {
  return {
    width: `100%`,
    maxWidth: layout.containerMaxWidths[i],
    // padding: `${rhythm(1)} ${rhythm(1 / 4)}`
    // " .image": {
    //   height: layout.childMaxHeights[i],
    //   borderRadius: layout.shape && layout.shape.match(/circle/) ? `50%` : `0`
    // }
  }
}
const listImageStyle = (layout, i) => {
  return {
    width: `100%`,
    maxWidth: layout.containerMaxWidths[i],
    padding: rhythm(1 / 4),
    ' .image': {
      height: layout.imageMaxHeights[i],
      borderRadius: layout.shape && layout.shape.match(/circle/) ? `50%` : `0`,
    },
  }
}

export { listItemStyle, listImageStyle }
