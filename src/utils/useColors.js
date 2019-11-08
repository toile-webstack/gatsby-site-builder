const useColors = ({ options, colorsLib }) => {
  const isColored = !!options.colorPalettes || !!options.colorCombo
  const colorCombo = options.colorCombo
    ? colorsLib[`${options.colorCombo}Combo`]
    : colorsLib.classicCombo
  const colorPalettes = options.colorPalettes || colorsLib.colorPalettes
  const newColors = colorsLib.computeColors(colorPalettes, colorCombo)
  const colors = { ...colorsLib, ...newColors, isColored }

  return colors
}

export default useColors
