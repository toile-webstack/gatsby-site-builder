import React from "react";
import Link from "gatsby-link";
import Img from "gatsby-image";
import MdFormatQuote from "react-icons/lib/md/format-quote";

import { rhythm, scale } from "../../../utils/typography";
// import colors from "../utils/colors"
import {
  addLayoutOptions,
  gridLayout,
  listItemStyle
} from "../../../utils/computeGrid";

import Html from "../../../atoms/Html";
import LinkOrNotCollectionItem from "../../../atoms/LinkOrNotCollectionItem";

export default ({
  collectionItem,
  colors,
  styleData,
  layout,
  blockOptionsData,
  passCSS
}) => {
  const {
    classicCombo,
    contrastCombo,
    funkyCombo,
    funkyContrastCombo
  } = colors;
  const image = collectionItem.featuredImage;
  const { excerpt, html } = collectionItem.content.childMarkdownRemark;
  const linkToPage = blockOptionsData.linkToPage === false ? false : true;

  const layoutList = [{}];
  const childrenColumns = (layout &&
    layout.children &&
    layout.children.columns) || ["1"];
  const layoutOptionsData = {
    columns: childrenColumns,
    shape: layout && layout.shape,
    align: layout && layout.align
  };
  const parentMaxWidth = (passCSS && passCSS.maxWidth) || 1000;
  const { layout: childLayout, list: childrenList } = addLayoutOptions(
    layoutOptionsData,
    parentMaxWidth,
    layoutList
  );
  const { imageStyle } = childrenList[0][0];
  const { itemStyle } = childrenList[0][0];

  const inner = [
    <div
      key="item"
      css={{
        ...itemStyle,
        position: `relative`,
        flexFlow: `column`,
        maxHeight: imageStyle[` .image`].height
        // padding: `0 ${rhythm(1 / 2)}`,
        // overflow: `hidden`,
      }}
    >
      <MdFormatQuote
        css={{
          // position: `absolute`,
          // top: `-${rhythm(2)}`,
          // left: `-${rhythm(2)}`,
          ...scale(2)
          // ...colors[funkyContrastCombo].style,
          // background: `none`,
        }}
      />
      <blockquote>
        <Html
          html={html}
          css={
            {
              // height: `61.8%`,
              // overflow: `hidden`,
            }
          }
        />
        <footer
          css={{
            textAlign: `right`
          }}
        >
          {collectionItem.name}
        </footer>
      </blockquote>
      {collectionItem.momentPublished && (
        <small
          css={{
            lineHeight: rhythm(1 / 3),
            marginBottom: rhythm(1 / 2)
          }}
        >
          {collectionItem.momentPublished}
        </small>
      )}
    </div>
  ];

  // TODO: call author instead of name
  return (
    <LinkOrNotCollectionItem
      blockOptionsData={blockOptionsData}
      collectionItem={collectionItem}
      colors={colors}
    >
      {inner}
    </LinkOrNotCollectionItem>
  );
};
