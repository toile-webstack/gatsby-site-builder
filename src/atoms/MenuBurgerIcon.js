import React from "react";
// import { Link } from "gatsby"
import MdMenu from "react-icons/lib/md/menu";
import MdClose from "react-icons/lib/md/close";

import { rhythm, scale } from "../utils/typography";

export default props => {
  return props.open ? (
    <MdClose
      onClick={() => {
        props.toggleOpen();
      }}
      css={{
        fontSize: rhythm(1),
        textAlign: `right`,
        cursor: `pointer`,
        ":hover": {
          color: props.colors[props.colors.classicCombo].linkHover
        }
      }}
    />
  ) : (
    <MdMenu
      onClick={() => {
        props.toggleOpen();
      }}
      css={{
        fontSize: rhythm(1),
        textAlign: `right`,
        cursor: `pointer`,
        ":hover": {
          color: props.colors[props.colors.classicCombo].linkHover
        }
      }}
    />
  );
};
