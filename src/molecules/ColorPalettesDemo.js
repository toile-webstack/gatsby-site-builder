import React from "react"
import colors from "../utils/colors"

export default () => (
  <div
    css={{
      display: `flex`,
      justifyContent: `space-around`
    }}
  >
    {colors.palettes.map((palette, id) => {
      return (
        <div
          key={id}
          css={{
            margin: `auto`
          }}
        >
          <div
            css={{
              background: palette.neutral,
              width: 50,
              height: 50
            }}
          >
            N
          </div>
          <div
            css={{
              background: palette.primary,
              color: palette.neutral,
              width: 50,
              height: 50
            }}
          >
            P
          </div>
          <div
            css={{
              background: palette.secondary,
              color: palette.neutral,
              width: 50,
              height: 50
            }}
          >
            S
          </div>
        </div>
      )
    })}
  </div>
)
