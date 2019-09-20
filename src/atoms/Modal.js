import React from "react";
import MdClose from "react-icons/lib/md/close";

import { rhythm, scale } from "../utils/typography";

export default props => {
  return (
    <dialog
      onClick={e => {
        e.stopPropagation();
        props.close();
      }}
      onWheel={e => e.preventDefault()}
      css={{
        position: `fixed`,
        top: 0,
        left: 0,
        width: `100vw`,
        height: `100vh`,
        backgroundColor: `rgba(255, 255, 255, 0.5)`,
        // padding: 0,
        border: `none`,
        // boxSizing: `border-box`,
        display: `flex`,
        justifyContent: `center`,
        alignItems: `center`,
        zIndex: 100,
        cursor: `pointer`,
        "> div": {
          position: `relative`,
          backgroundColor: `inherit`,
          width: `80vw`,
          height: `80vh`,
          display: `flex`,
          flexDirection: `column`,
          justifyContent: `center`,
          cursor: `auto`,
          backgroundColor: `rgb(255, 255, 255)`
        },
        " .image, img": {
          // width: `auto`,
          maxWidth: `75vw`,
          height: `auto`,
          maxHeight: `75vh`,
          objectFit: `contain!important`,
          borderRadius: `0`
        },
        ...props.style
      }}
    >
      <div
        onClick={e => {
          e.stopPropagation();
        }}
      >
        {props.children}
        <MdClose
          onClick={() => {
            props.close();
          }}
          css={{
            position: `absolute`,
            top: 0,
            right: 0,
            fontSize: rhythm(2),
            textAlign: `right`,
            cursor: `pointer`,
            ":hover": {
              // color: props.colors[props.colors.classicCombo].linkHover
            }
          }}
        />
      </div>
    </dialog>
  );
};

// export default ({ children, passCSS }) => {
//   return (
//     <div
//       css={{
//         position: `fixed`,
//         left: 0,
//         right: 0,
//         top: 0,
//         height: `100vh`,
//         background: `rgba(255, 255, 255, 0.2)`,
//         display: `flex`,
//         justifyContent: `center`
//       }}
//     >
//       <div>HELLO</div>
//     </div>
//   )
// }
