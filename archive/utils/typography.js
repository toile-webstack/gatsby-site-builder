import Typography from "typography";
import verticalRhythm from "compass-vertical-rhythm";

import {
  MOBILE_MEDIA_QUERY,
  TABLET_MEDIA_QUERY
} from "typography-breakpoint-constants";
import {
  fonts,
  typography as typographyOptions,
  style
} from "./siteSettings.json";
import colors, {
  classicCombo,
  contrastCombo,
  funkyCombo,
  funkyContrastCombo,
  palettes,
  classic,
  contrast
} from "./colors.js";

const options = {
  // title: ,//The theme title.
  baseFontSize: "16px", //The base font size in pixels, defaults to 16px.
  baseLineHeight: 1.45, //The base line height using the css unitless number, defaults to 1.45.
  // scaleRatio: 2.15,//The "scale ratio" for the theme. This value is the ratio between the h1 font size and the baseFontSize. So if the scale ratio is 2 and the baseFontSize is 16px then the h1 font size is 32px.
  // scaleRatio: `major twelfth`, // We can also use modular scales https://github.com/KyleAMathews/modularscale/blob/master/src/index.coffee
  // googleFonts: ,//An array specifying Google Fonts for this project.

  // TODO: add open sans as the last option for fonts
  headerFontFamily: fonts.header, //An array of strings specifying the font family stack for headers e.g. ['Helvetica', 'sans-serif']. Defaults to a system UI font stack.
  bodyFontFamily: fonts.body, //An array of strings specifying the font family stack for the body, defaults to ['georgia', 'serif'].
  headerColor: colors[classicCombo].header, //A css color string to be set on headers. Defaults to inherit.
  bodyColor: colors[classicCombo].body, //A css color string to be set for body text. Defaults to hsl(0,0%,0%,0.8).
  // headerWeight: "400", //Specify the font weight for headers. Defaults to bold.
  bodyWeight: 400, //Specify the font weight for body text. Defaults to normal.
  boldWeight: 700, //Specify the font weight for "bold" (b, strong, dt, th) elements. Defaults to bold.
  blockMarginBottom: 0, //Specify the default margin-bottom for block elements. Defaults to one "rhythm unit" (i.e. the height of the base line height).
  // includeNormalize: ,//Include normalize.css. We include normalize.CSS by default but if you're already including it elsewhere in your project, you can disable including it here by passing false.
  ...typographyOptions,
  overrideStyles: ({ adjustFontSizeTo, scale, rhythm }, options, styles) => {
    // const vr = verticalRhythm({
    //   baseFontSize: '17px',
    //   baseLineHeight: '28px',
    // })
    return {
      //////// Examples
      // h1: {
      //   fontFamily: ['Montserrat', 'sans-serif'].join(','),
      // },
      // blockquote: {
      //   ...adjustFontSizeTo("19px"),
      //   // color: gray(41),
      //   fontStyle: "italic",
      //   paddingLeft: rhythm(13 / 16),
      //   marginLeft: rhythm(-1),
      //   borderLeft: `${rhythm(3 / 16)} solid ${gray(10)}`
      // },
      // 'blockquote > :last-child': {
      //   marginBottom: 0,
      // },
      // "blockquote cite": {
      //   ...adjustFontSizeTo(options.baseFontSize),
      //   color: options.bodyColor,
      //   fontStyle: "normal",
      //   fontWeight: options.bodyWeight
      // },
      ////////
      html: {
        scrollBehavior: "smooth"
      },
      body: {
        // background: colors[classicCombo].background,
        // textAlign: `center`,
        ...colors[classicCombo].style
      },
      " :focus": {
        outline: `none`
      },
      // "*::selection": {
      //   background: colors[classicCombo].linkHover,
      //   color: colors[classicCombo].background
      // },
      "#___gatsby > div": {
        // display: `flex`,
        // position: `relative`
      },
      h1: {
        marginBottom: rhythm(1),
        textAlign: `center`
      },
      h2: {
        marginBottom: rhythm(1 / 2),
        marginTop: rhythm(1)
        // display: `inline`
      },
      " h3, h4": {
        marginBottom: rhythm(1 / 4),
        marginTop: rhythm(1)
        // display: `inline`
      },
      " p, ul": {
        marginBottom: rhythm(1 / 2)
        // display: `inline`
      },
      ".blockFreeText > div > :first-child": {
        marginTop: 0
      },
      ".blockFreeText > div > :last-child": {
        marginBottom: 0
      },
      li: {
        marginBottom: 0
      },
      img: {
        // display: `block`,
        // margin: `auto`,
        width: `100%`,
        maxWidth: `300px`,
        maxHeight: `200px`,
        objectFit: `contain`
      },
      ".gatsby-image-wrapper": {
        margin: `auto`
        // width: `100%`
      },
      ".gatsby-image-wrapper > img": {
        display: `inline`,
        maxWidth: `none`,
        maxHeight: `none`
      },
      ul: {
        textAlign: `initial`
      },
      a: {
        cursor: `pointer`,
        color: `inherit`,
        textShadow: `none`,
        backgroundImage: `none`,
        textDecoration: `underline`
      },
      "a:hover": {
        // color: colors[funkyCombo].body,
        textDecoration: `none`
      },
      form: {
        display: `flex`,
        flexFlow: `column`,
        marginBottom: 0,
        position: `relative`
      },
      "form > *": {
        width: `100%`,
        marginBottom: rhythm(1 / 3)
      },
      "input, textarea": {
        width: `100%`,
        padding: `0 5px`,
        border: `solid 1px ${colors[classicCombo].border}`,
        borderRadius: `10px`
        // background: colors.palettes[0].neutral
      },
      "a.button, button, input[type='submit']": {
        textDecoration: `none`,
        cursor: `pointer`,
        border: `solid 2px`,
        borderRadius: `10px`,
        padding: `5px 10px`,
        // display: `inline`,
        display: `inline-block`
        // ...colors[classicCombo].style
      },
      "input[type='submit']": {
        marginTop: rhythm(1)
      },
      "input:invalid, textarea:invalid": {
        boxShadow: `none`
      },
      "a.button:hover, button:hover, input[type='submit']:hover": {
        // ...colors[funkyContrastCombo].style,
        // borderColor: colors[classicCombo].border
      },
      "input[type='radio'], input[type='checkbox']": {
        // display: `none`,
        // "-webkit-appearance": `none`,
        appearance: `none`,
        opacity: 0,
        position: `absolute`,
        width: `100%`
      },
      "input[type='radio'] + label > span, input[type='checkbox'] + label > span": {
        display: `inline-block`,
        width: rhythm(1 / 2),
        height: rhythm(1 / 2),
        // background: colors[classicCombo].background,
        border: `solid 3px`,
        borderRadius: `50%`,
        marginRight: rhythm(1 / 6)
      },
      "input[type='checkbox'] + label > span": {
        borderRadius: `0`
      },
      "input::placeholder, textarea::placeholder": {
        // color: colors.palettes[0].primary
      },
      blockquote: {
        // ...scale(2 / 5),
        // borderLeftStyle: `solid`,
        // borderLeftWidth: `${rhythm(6 / 16)}`,
        // borderLeft: `${rhythm(6 / 16)} solid ${colors[classicCombo].border}`,
        // paddingLeft: rhythm(10 / 16),
        fontStyle: "italic",
        margin: `0`
        // marginLeft: 0,
        // marginRight: 0
      },
      "blockquote small": {
        float: `right`
      },
      ".unstyledLink": {
        color: `inherit`,
        textDecoration: `inherit`
      },
      ".stylishLink": {
        fontWeight: `bold`,
        textDecoration: `none`
      },
      ".announcement1": {
        display: `block`,
        maxWidth: `800px`,
        margin: `${rhythm(1)} auto`,
        padding: rhythm(1),
        borderStyle: `solid`,
        borderWidth: `thick`,
        fontWeight: `bold`
      },
      ".block": {
        boxSizing: `border-box`
      },
      table: {
        marginBottom: rhythm(1 / 2),
        border: `none`
      },
      "th, td": {
        borderColor: `inherit`,
        borderRight: `1px solid`,
        textAlign: `center!important`
      },
      "th:last-child, td:last-child": {
        borderRight: `none`
      },
      td: {
        borderBottom: `none`
      },
      ...style
    };
  }
};

const typography = new Typography(options);

// Rhythm(1) in pixels
typography.typoRhythm =
  parseFloat(options.baseFontSize) * parseFloat(typography.rhythm(1));

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles();
}

// typography.colors = { colorOption, palettes, ...colors }

export default typography;
