import React from 'react';

import { rhythm, scale } from '../utils/typography';

import {
  replaceShortCodes,
  withSimpleLineBreaks,
  protectEmail,
  targetBlank,
} from '../utils/processHtml';

export default ({ html, passCSS, shortCodeMatchees, ...rest }) => {
  html = protectEmail(html);
  html = withSimpleLineBreaks(html);
  // html = targetBlank(html)
  html = replaceShortCodes(html, shortCodeMatchees);
  // const arrayOfComponents
  return (
    <div
      {...rest}
      css={{
        width: `100%`,
        whiteSpace: `pre-line`,
        // whiteSpace: `pre-wrap`,
        ...passCSS,
      }}
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
};
