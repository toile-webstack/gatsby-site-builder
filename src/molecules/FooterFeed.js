import React from 'react'

import { rhythm, scale } from '../utils/typography'
import colors from '../utils/colors'

const { contrastCombo } = colors

const localeFooter = {
  fr: (
    <p>
      Feed by Design aide ce projet à voir le jour
      <br />
      Notre portfolio est sur{' '}
      <a href="http://www.feedbydesign.com" target="_blank">
        feedbydesign.com
      </a>{' '}
      et on a une page{' '}
      <a href="https://www.facebook.com/feedbydesign/" target="_blank">
        Facebook
      </a>
    </p>
  ),
  en: (
    <p>
      Feed by Design is helping this project arise
      <br />
      Our portfolio is on{' '}
      <a href="http://www.feedbydesign.com" target="_blank">
        feedbydesign.com
      </a>{' '}
      and we have a{' '}
      <a href="https://www.facebook.com/feedbydesign/" target="_blank">
        Facebook
      </a>{' '}
      page
    </p>
  ),
}

class FooterFeed extends React.Component {
  render() {
    // const locale = window.location.href.split("/")[3].substring(0, 2)
    const { currentLocale } = this.props
    const locale =
      (currentLocale &&
        currentLocale.substring(0, 2).match(/fr|en/gi) &&
        currentLocale.substring(0, 2).match(/fr|en/gi)[0]) ||
      'en'

    return (
      <footer
        lang={locale}
        css={{
          textAlign: `center`,
          color: colors[contrastCombo].body,
          width: `100%`,
          margin: `${rhythm(1)} 0 ${rhythm(1)}`,
          '> p': {
            background: colors[contrastCombo].background,
            // color: `black`,
            padding: rhythm(1 / 2),
            width: `100%`,
            marginBottom: 0,
            '> a': {
              color: `inherit`,
              fontWeight: `bold`,
              textDecoration: `none`,
              cursor: `pointer`,
              ':hover': {
                // borderBottom: `thick solid`,
                // color: `rgb(43, 201, 175)`
                color: colors[contrastCombo].linkHover,
              },
            },
          },
        }}
      >
        {localeFooter[locale]}
      </footer>
    )
  }
}

export default FooterFeed
