import React from "react"
import { Link } from "gatsby"

import { rhythm, scale } from "../../../utils/typography"
// import colors from "../utils/colors"

export default ({ block, colors }) => {
  const { classicCombo, contrastCombo, funkyCombo, funkyContrastCombo } = colors

  return (
    <Link
      to={block.path}
      className="stylishLink"
      css={{
        display: `block`,
        " h3, h4, h5, h6": {
          color: `inherit`,
          textAlign: `left`,
          marginBottom: 0
        }
      }}
    >
      <img
        src={block.featuredImage.src}
        srcSet={block.featuredImage.srcSet}
        sizes={`280px`}
        css={{
          width: 280,
          height: 173,
          objectFit: `cover`,
          border: `solid 2px ${colors[classicCombo].border}`
        }}
      />
      <h3>{block.name}</h3>
      {block.datePublished && (
        <h6
          css={{
            lineHeight: rhythm(1 / 3)
          }}
        >
          {block.datePublished}
        </h6>
      )}
    </Link>
  )
}
