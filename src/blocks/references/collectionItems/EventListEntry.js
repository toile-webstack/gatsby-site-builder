import React from "react";
import Link from "gatsby-link";
import Img from "gatsby-image";
import Moment from "react-moment";

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

  // Date and time in the 1st column
  // title and excerpt in the 2nd column
  const layoutList = [{}, {}];
  const childrenColumns = (layout &&
    layout.children &&
    layout.children.columns) || ["1/4", "3/4"];
  const layoutOptionsData = {
    columns: childrenColumns,
    shape: layout.shape,
    align: layout.align
  };
  const parentMaxWidth = (passCSS && passCSS.maxWidth) || 1000;
  const { layout: childLayout, list: childrenList } = addLayoutOptions(
    layoutOptionsData,
    parentMaxWidth,
    layoutList
  );
  const { itemStyle: dateStyle } = childrenList[0][0];
  const { itemStyle } = childrenList[1][0];

  const inner = [
    <div
      key="leftCol"
      css={{
        ...dateStyle,
        // flexFlow: `column`,
        justifyContent: `flex-end`,
        // width: `auto`, // to condense de date div
        marginBottom: rhythm(1)
      }}
    >
      <Moment
        locale={collectionItem.fields.locale}
        format="Do MMM YYYY"
        css={{
          ...scale(0.2),
          padding: rhythm(1 / 2),
          ...colors[funkyContrastCombo].style
          // lineHeight: rhythm(1 / 3),
          // marginBottom: rhythm(1 / 2),
        }}
      >
        {collectionItem.datePublished}
      </Moment>
      {/* <p
        css={{
          ...scale(0.2),
          padding: rhythm(1 / 2),
          ...colors[funkyContrastCombo].style,
          // lineHeight: rhythm(1 / 3),
          // marginBottom: rhythm(1 / 2),
        }}
      >
        {collectionItem.momentPublished}
      </p> */}
    </div>,
    <div
      key="rightCol"
      css={{
        ...itemStyle,
        display: `flex`,
        flexFlow: `column`,
        // maxHeight: imageStyle[` .image`].height,
        padding: `0 ${rhythm(1 / 2)}`,
        overflow: `hidden`
      }}
    >
      <h4
        css={{
          ...scale(0.4),
          color: `inherit`
        }}
      >
        {collectionItem.name}
      </h4>
      <hr
        css={{
          flexShrink: 0,
          width: `100%`,
          marginBottom: rhythm(1 / 2),
          height: 1,
          backgroundColor: colors[funkyCombo].body
        }}
      />
      <Html
        html={excerpt}
        passCSS={{
          // fontSize: `10px`,
          ...scale(-0.2)
        }}
      />
    </div>
  ];

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
