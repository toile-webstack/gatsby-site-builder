import React from "react";

import typography, { rhythm, scale } from "../utils/typography";
import { metadata, contact } from "../utils/siteSettings.json";
import colors from "../utils/colors";

import SocialIcons from "../atoms/SocialIcons";
import ContactInfos from "../atoms/ContactInfos";
import Attribution from "../atoms/Attribution";

import Section from "../blocks/Section";

// Mock Data
if (process.env.NODE_ENV === "development") {
  contact.name = contact.name || "Moa Alphonse Bertelan de la Longue Adresse";
  contact.phone = contact.phone || "0000/000.000";
  contact.email =
    contact.email || "alphonse.bertelan@ohlalongueadressemail.com";
  contact.facebook = contact.facebook || "monchat";
  contact.linkedin = contact.linkedin || "https://www.linkedin.com/";
  contact.instagram = contact.instagram || "https://www.instagram.com/";
  contact.twitter = contact.twitter || "https://twitter.com/";
}

let phone = null;
let email = null;
// prettier-ignore
if (typeof window !== "undefined" && (contact.phone || contact.email)) {
  if (contact.phone) {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      phone = <a href={`tel:${contact.phone}`}>{contact.phone}</a>
    }
    else {phone = <span>{contact.phone}</span>}
  }
  if (contact.email)
    email = <a href={`mailto:${contact.email}`} target="_top">{contact.email}</a>
}

class Footer extends React.Component {
  constructor(props) {
    super(props);
    const colorCombo = colors.footerCombo;
    const newColors = colors.computeColors([1], colorCombo);
    this.colors = { ...colors, ...newColors };
  }

  render() {
    const {
      classicCombo,
      contrastCombo,
      funkyCombo,
      funkyContrastCombo
    } = this.colors;
    const { section } = this.props;

    return (
      <footer
        className="footer"
        css={{
          ...colors[classicCombo].style,
          ...scale(-0.2),
          lineHeight: 1.3,
          textAlign: `center`,
          width: `100%`,
          padding: `${rhythm(1 / 4)} ${rhythm(1)}`,
          "> p": {
            margin: 0
          },
          " a": {
            fontWeight: `bold`,
            textDecoration: `none`
          },
          " svg, img": {
            ...scale(0.2),
            margin: `0 ${rhythm(1 / 8)}`
          }
          // " img": {
          //   display: `inline`,
          //   height: typography.options.baseFontSize,
          //   width: typography.options.baseFontSize,
          //   verticalAlign: `bottom`,
          //   color: `red`
          // }
        }}
      >
        {section ? (
          <Section
            block={section}
            // customContentTypeList={this.props.data.customContentType}
            colors={this.colors}
            location={this.props.location}
            csss={{
              padding: 0,
              "& div": {
                padding: 0
              },
              "& p": {
                marginBottom: rhythm(1 / 8)
              }
            }}
            shortCodeMatchees={{
              "social-icons": <SocialIcons key="1" contact={contact} />,
              "contact-infos": (
                <ContactInfos
                  {...{ key: "2", name: contact.name, email, phone }}
                />
              ),
              attribution: <Attribution key="3" />
            }}
          />
        ) : (
          [
            <SocialIcons key="1" contact={contact} />,
            <ContactInfos
              {...{ key: "2", name: contact.name, email, phone }}
            />,
            <Attribution key="3" />
          ]
        )}
      </footer>
    );
  }
}

export default Footer;
