import React from "react";

import { rhythm, scale } from "../utils/typography";

export default () => (
  <p
    css={{
      // ...scale(-0.3),
      // lineHeight: `none`
      fontSize: rhythm(0.5),
      width: `100%`
      // opacity: 0.8,

      // display: `flex`,
      // flexFlow: `row wrap`,
      // justifyContent: `center`
    }}
  >
    <span>
      <span>Powered by </span>
      <a href="https://www.toile.io/" target="_blank" rel="noopener">
        toile.io
      </a>
    </span>
    <span css={{ margin: `0 3px` }}>-</span>
    <span>
      <span>Designed by </span>
      <a
        href="http://www.feedbydesign.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        Feed by Design
      </a>
    </span>
  </p>
);
