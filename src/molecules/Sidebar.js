import React from "react"
import FaFacebookSquare from "react-icons/lib/fa/facebook-square"
import FaInstagram from "react-icons/lib/fa/instagram"
import FaYoutubeSquare from "react-icons/lib/fa/youtube-square"
import typography, { rhythm, scale } from "../utils/typography"
import colors from "../utils/colors"
import { metadata, contact } from "../utils/siteSettings.json"

import Section from "../blocks/Section"

class Sidebar extends React.Component {
  constructor(props) {
    super(props)
    const colorCombo = colors.sidebarCombo
    const newColors = colors.computeColors([1], colorCombo)
    this.colors = { ...colors, ...newColors }
  }

  render() {
    const {
      classicCombo,
      contrastCombo,
      funkyCombo,
      funkyContrastCombo,
    } = this.colors

    return (
      <aside
        className="sidebar"
        css={{
          ...colors[classicCombo].style,
          width: `100%`,
          "> .section": {
            paddingBottom: 0,
            "> div": {
              padding: 0,
              " .blockGallery": {
                "> .column": {
                  maxWidth: 250,
                },
              },
            },
          },
        }}
      >
        <Section
          block={this.props.block}
          colors={this.colors}
          location={this.props.location}
        />
        <h3
          css={{
            textAlign: `center`,
            marginTop: 0,
          }}
        >
          Gardons le contact
        </h3>
        <div
          css={{
            ...scale(1),
            textAlign: `center`,
            maxWidth: 200,
            margin: `auto`,
            paddingBottom: rhythm(1),
            display: `flex`,
            justifyContent: `space-between`,
            justifyContent: `space-evenly`,
          }}
        >
          {contact.facebook && (
            <a
              href={`https://www.facebook.com/${contact.facebook}/`}
              target="_blank"
              rel="me noopener"
            >
              <FaFacebookSquare />
            </a>
          )}
          {contact.instagram && (
            <a href={contact.instagram} target="_blank" rel="me noopener">
              <FaInstagram />
            </a>
          )}
          {contact.youtube && (
            <a href={contact.youtube} target="_blank" rel="me noopener">
              <FaYoutubeSquare />
            </a>
          )}
        </div>
      </aside>
    )
  }
}

export default Sidebar
