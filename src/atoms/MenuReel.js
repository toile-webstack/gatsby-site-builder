import React from 'react'
import { Cluster } from '@bit/marccoet.toile.nuds-layout-primitives'

import { rhythm, scale } from '../utils/typography'

const MenuReel = ({ icon, name, menu, currentLocale, location }) => {
  const currentMenu = menu && menu[currentLocale]
  //   const homepage = _.find(currentMenu, `homepage`)
  //   const homepageLink = (homepage && homepage.path) || `/`
  return (
    <nav>
      <Cluster
        {...{
          as: 'ul',
          space: rhythm(1),
          justifyContent: 'flex-end',
          style: {
            // in 'style' because it would have lower specificity than the same rule specified in the cms settings
            'list-style-type': 'none',
          },
          css: {
            // margin: 0,
            // padding: `${rhythm(1 / 4)} ${rhythm(1)}`,
          },
        }}
      >
        <li>
          <a href="…">Shop</a>
        </li>
        <li>
          <a href="…">Space Bears</a>
        </li>
        <li>
          <a href="…">Mars Cars</a>
        </li>
        <li>
          <a href="…">Contact</a>
        </li>
        <li>
          <a href="…">Shop</a>
        </li>
        <li>
          <a href="…">Space Bears</a>
        </li>
        <li>
          <a href="…">Mars Cars</a>
        </li>
        <li>
          <a href="…">Contact</a>
        </li>
      </Cluster>
    </nav>
  )
}

export default MenuReel
