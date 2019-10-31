const tinycolor = require("tinycolor2");
const { colors } = require("./siteSettings.json");

const initialColors = colors;

// let colors = {
//   number: "",
//   option: "",
//   patern: "",
//   palettes: [
//     {
//       name: "blue",
//       neutral: "rgb(255, 255, 255)",
//       primary: "rgb(0, 38, 100)",
//       secondary: "rgb(255, 121, 0)",
//     },
//     {
//       name: "grey",
//       neutral: "rgb(255, 255, 255)",
//       primary: "rgb(182, 209, 255)",
//       secondary: "rgb(255, 121, 0)"
//     }
//   ]
// }

colors.palettes.forEach(palette => {
  // Convert colors to tiny Colors
  tinycolor(palette.primary).isValid()
    ? (palette.primary = tinycolor(palette.primary))
    : (palette.light = null);
  tinycolor(palette.secondary).isValid()
    ? (palette.secondary = tinycolor(palette.secondary))
    : (palette.secondary = null);
  tinycolor(palette.neutral).isValid()
    ? (palette.neutral = tinycolor(palette.neutral))
    : (palette.neutral = null);

  // TODO: Check that light colors are indeed light, medium, dark
  // basic test to put the only defined color in light, medium or dark regarding to its saturation
  // NOTE: Assume that there is always only one saturation corresponding to light, medium and dark
  // let paletteArray = [palette.light, palette.medium, palette.dark]
  // palette = {}
  // for (let i = 0; i < paletteArray.length; i++) {
  //   if (paletteArray[i] && paletteArray[i].isLight()) {
  //     palette.light = paletteArray[i]
  //     palette.medium = palette.light.darken()
  //   } else if (paletteArray[i] && paletteArray[i].isDark()) {
  //     palette.dark = paletteArray[i]
  //   } else if (paletteArray[i]) {
  //     palette.medium = paletteArray[i]
  //   }
  // }

  // NOTE: working solution to deduct colors
  // if (!(palette.light && palette.medium && palette.dark)) {
  //   // if light is not at its place
  //   if (palette.light && palette.light.getLuminance() < 0.33) {
  //     palette.dark = palette.light.clone()
  //     palette.light = null
  //   } else if (palette.light && palette.light.getLuminance() < 0.66) {
  //     palette.medium = palette.light.clone()
  //     palette.light = null
  //     // if medium is not at its place
  //   } else if (palette.medium && palette.medium.getLuminance() <= 0.33) {
  //     palette.dark = palette.medium.clone()
  //     palette.medium = null
  //   } else if (palette.medium && palette.medium.getLuminance() >= 0.66) {
  //     palette.light = palette.medium.clone()
  //     palette.medium = null
  //     // if dark is not at its place
  //   } else if (palette.dark && palette.dark.getLuminance() > 0.66) {
  //     palette.light = palette.dark.clone()
  //     palette.dark = null
  //   } else if (palette.dark && palette.dark.getLuminance() > 0.33) {
  //     palette.medium = palette.dark.clone()
  //     palette.dark = null
  //   }
  //
  //   // Create undefined colors
  //   if (!!palette.light) {
  //     palette.medium = palette.light.clone().darken(33)
  //     palette.dark = palette.light.clone().darken(66)
  //   } else if (!!palette.medium) {
  //     palette.light = palette.medium.clone().lighten(33)
  //     palette.dark = palette.medium.clone().darken(33)
  //   } else if (!!palette.dark) {
  //     palette.medium = palette.dark.clone().lighten(33)
  //     palette.light = palette.dark.clone().lighten(66)
  //   }
  // }
});

// TODO: Define the basis of colors to work with depending on colorsNumber and the colors that are defined
// TODO: If user wants more palettes than the ones defined. Imply based on colorPatern

// Transform Tinycolors to RGB strings
colors.palettes.forEach(palette => {
  // Convert colors to rgb strings
  palette.primary = palette.primary && palette.primary.toRgbString();
  palette.secondary = palette.secondary && palette.secondary.toRgbString();
  palette.neutral = palette.neutral && palette.neutral.toRgbString();
});

// TODO: Define usage of colors based on colorOption
// let background, header, body, border
//
// switch (colors.colorOption) {
//   case "inverted":
//     background = colorBlack
//     header = colorWhite
//     body = colorWhite
//     border = colorWhite
//     break
//   case "funky":
//     background = colorBlack
//     header = colorStrong1
//     body = colorWhite
//     border = colorWhite
//     break
//   default:
//     background = colors.palettes[0].light
//     header = colors.palettes[0].dark
//     body = colors.palettes[0].dark
//     border = colors.palettes[0].dark
// }

// Return processed color palette
// const processedColors = {
//   palettes: colors.palettes,
//   background,
//   header,
//   body,
//   border
// }

const palettes = colors.palettes;
const mainCombo = colors.mainCombo || "classic";

const computeBase = mainCombo => {
  let base = { classicCombo: mainCombo };
  switch (mainCombo) {
    case "classic":
      base.contrastCombo = "contrast";
      base.funkyCombo = "funky";
      base.funkyContrastCombo = "funkyContrast";
      break;
    case "contrast":
      base.contrastCombo = "classic";
      base.funkyCombo = "funkyContrast";
      base.funkyContrastCombo = "funky";
      break;
    case "funky":
      base.contrastCombo = "funkyContrast";
      base.funkyCombo = "classic";
      base.funkyContrastCombo = "contrast";
      break;
    case "funkyContrast":
      base.contrastCombo = "funky";
      base.funkyCombo = "contrast";
      base.funkyContrastCombo = "classic";
      break;
    default:
      base.classicCombo = "classic";
      base.contrastCombo = "contrast";
      base.funkyCombo = "funky";
      base.funkyContrastCombo = "funkyContrast";
  }
  return base;
};
const {
  classicCombo,
  contrastCombo,
  funkyCombo,
  funkyContrastCombo
} = computeBase(mainCombo);
// TODO: replace the eval hack
const menuCombo = eval(colors.menuCombo + "Combo") || classicCombo;
const footerCombo = eval(colors.footerCombo + "Combo") || contrastCombo;
const sidebarCombo = eval(colors.sidebarCombo + "Combo") || classicCombo;

class Combo {
  constructor(background, header, body, border, linkHover) {
    this.background = background;
    this.header = header;
    this.body = body;
    this.border = border;
    this.linkHover = linkHover;
  }
  get style() {
    return this.getStyle();
  }
  getStyle() {
    return {
      color: this.body,
      backgroundColor: this.background,
      borderColor: this.border,
      " h1, h2, h3, h4, h5, h6": {
        color: this.header
      },
      " a:hover": {
        color: this.linkHover
      },
      " *::selection": {
        background: this.linkHover,
        color: this.background
      },
      " input, textarea": {
        backgroundColor: colors.palettes[0].neutral,
        color: colors.palettes[0].primary,
        borderColor: this.border
      },
      " a.button:not(block a.button), button:not(block button)": {
        color: this.body,
        backgroundColor: this.background,
        borderColor: this.border
      },
      " input[type='submit']": {
        color: this.body,
        backgroundColor: this.background,
        borderColor: this.border
      },
      " a.button:hover, button:hover, input[type='submit']:hover": {
        color: this.background,
        backgroundColor: this.body,
        borderColor: this.border
      }
    };
  }
}

const computeCombos = colorPalettes => {
  colorPalettes = colorPalettes.map(p => palettes[p - 1]);

  const classic = new Combo(
    colorPalettes[0].neutral,
    colorPalettes[0].primary,
    colorPalettes[0].primary,
    colorPalettes[0].primary,
    colorPalettes[0].secondary
  );
  // const classic = new Combo(
  //   `initial`,
  //   `initial`,
  //   `initial`,
  //   `initial`,
  //   `initial`
  // )
  const contrast = new Combo(
    colorPalettes[0].primary,
    colorPalettes[0].neutral,
    colorPalettes[0].neutral,
    colorPalettes[0].neutral,
    colorPalettes[0].secondary
  );
  const funky = new Combo(
    colorPalettes[0].neutral,
    colorPalettes[0].secondary,
    colorPalettes[0].secondary,
    colorPalettes[0].secondary,
    colorPalettes[0].primary
  );
  const funkyContrast = new Combo(
    colorPalettes[0].secondary,
    colorPalettes[0].neutral,
    colorPalettes[0].neutral,
    colorPalettes[0].neutral,
    colorPalettes[0].primary
  );
  return { classic, contrast, funky, funkyContrast };
};

const { classic, contrast, funky, funkyContrast } = computeCombos([1]);

const computeColors = (colorPalettes = [1], colorCombo = `classic`) => {
  const combos = computeBase(colorCombo);
  const styles = computeCombos(colorPalettes);
  return { ...combos, ...styles, colorPalettes };
};

//prettier-ignore
export {
  menuCombo, footerCombo, sidebarCombo,
  classicCombo, contrastCombo, funkyCombo, funkyContrastCombo,
  classic, contrast, funky, funkyContrast,
  palettes,
  computeBase, computeCombos, computeColors
}

//prettier-ignore
export default {
  menuCombo, footerCombo, sidebarCombo,
  ...computeColors([1], classicCombo),
  classicCombo, contrastCombo, funkyCombo, funkyContrastCombo,
  classic, contrast, funky, funkyContrast,
  palettes,
  computeBase, computeCombos, computeColors
}
