import React from 'react';
import Link from 'gatsby-link';
import Img from 'gatsby-image';
import Moment from 'react-moment';
import MdFormatQuote from 'react-icons/lib/md/format-quote';

import { rhythm, scale } from '../../../utils/typography';
// import colors from "../utils/colors"
import {
  addLayoutOptions,
  gridLayout,
  listItemStyle,
} from '../../../utils/computeGrid';

import Html from '../../../atoms/Html';
import LinkOrNotCollectionItem from '../../../atoms/LinkOrNotCollectionItem';

export default ({
  collectionItem,
  colors,
  styleData,
  layout,
  blockOptionsData,
  passCSS,
}) => {
  const {
    classicCombo,
    contrastCombo,
    funkyCombo,
    funkyContrastCombo,
  } = colors;
  const image = collectionItem.featuredImage;
  const { excerpt, html } = collectionItem.content.childMarkdownRemark;
  // TODO: delete and replace by linkTo
  const linkToPage = blockOptionsData.linkToPage === false ? false : true;

  // Image on the 1st column
  // title date and excerpt in the 2nd column
  const layoutList = [{}, {}];
  const childrenColumns = (layout &&
    layout.children &&
    layout.children.columns) || ['1/6', '5/6'];
  const layoutOptionsData = {
    columns: childrenColumns,
    shape: layout.shape || 'square',
    align: layout.align,
  };
  const parentMaxWidth = (passCSS && passCSS.maxWidth) || 1000;
  const { layout: childLayout, list: childrenList } = addLayoutOptions(
    layoutOptionsData,
    parentMaxWidth,
    layoutList,
  );
  const { imageStyle } = childrenList[0][0];
  const { itemStyle } = childrenList[1][0];

  const inner = [
    <div
      key="leftCol"
      css={{
        ...imageStyle,
      }}
    >
      <Img
        title={image.title}
        className="image"
        sizes={image.fluid}
      />
    </div>,
    <div
      key="rightCol"
      css={{
        ...itemStyle,
        display: `flex`,
        flexFlow: `column`,
        // maxHeight: imageStyle[` .image`].height,
        padding: `0 ${rhythm(2)} 0 ${rhythm(1 / 2)}`,
        overflow: `hidden`,
      }}
    >
      {/* <h4
				css={{
					...scale(0.4),
					// color: `inherit`,
				}}
			>
				{collectionItem.name}
			</h4> */}
      {/* {collectionItem.datePublished && (
				<Moment
					locale={collectionItem.fields.locale}
					format="Do MMM YYYY"
					css={{
						...scale(-0.2),
						lineHeight: rhythm(1 / 2),
						marginBottom: rhythm(1 / 2),
						// padding: rhythm(1 / 2),
					}}
				>
					{collectionItem.datePublished}
				</Moment>
			)} */}
      {/* <hr
				css={{
					flexShrink: 0,
					width: `100%`,
					marginBottom: rhythm(1 / 2),
					height: 1,
					backgroundColor: colors[funkyCombo].body,
				}}
			/> */}
      <MdFormatQuote
        css={{
          position: `absolute`,
          top: 0,
          right: 0,
          ...scale(2),
          alignSelf: `flex-end`,
          // position: `absolute`,
          // top: `-${rhythm(2)}`,
          // left: `-${rhythm(2)}`,
          // ...colors[funkyContrastCombo].style,
          // background: `none`,
        }}
      />
      <Html
        html={html}
        css={{
          // height: `61.8%`,
          // overflow: `hidden`,
          fontStyle: `italic`,
          // textAlign: `justify`,
          // textJustify: `inter-word`
        }}
      />
      <div
        css={{
          alignSelf: `flex-end`,
        }}
      >
        <strong>{collectionItem.author || collectionItem.name}</strong>
      </div>
    </div>,
  ];

  return (
    <LinkOrNotCollectionItem
      blockOptionsData={blockOptionsData}
      collectionItem={collectionItem}
      colors={colors}
      passCSS={{
        position: `relative`,
      }}
    >
      {inner}
    </LinkOrNotCollectionItem>
  );
};
