import React from 'react'
import { FaFacebookSquare, FaLinkedinSquare, FaInstagram } from 'react-icons/fa'
import { rhythm, scale } from '../utils/typography'
import { contact } from '../utils/siteSettings.json'

export default () => {
  let phone = null
  let email = null
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

  return (
    <div
      css={{
        ...scale(-0.2),
        lineHeight: rhythm(0.8),
        margin: `auto`,
        display: `flex`,
        flexFlow: `column`,
        '> div': {
          display: `flex`,
          flexFlow: `row wrap`,
          justifyContent: `center`,
          ' > *': {
            margin: `0 5px`,
          },
        },
      }}
    >
      {contact.name && (
        <div
          css={{
            fontWeight: `bold`,
          }}
        >
          {contact.name}
        </div>
      )}
      <div>
        {phone}
        <span>{email && phone && ' • '}</span>
        {email}
      </div>
      <div
        css={{
          ...scale(0.2),
          '> a': {
            textDecoration: `none`,
          },
        }}
      >
        {contact.facebook && (
          <a
            href={`https://www.facebook.com/${contact.facebook}/`}
            target="_blank"
          >
            <FaFacebookSquare />
          </a>
        )}
        {contact.linkedin && (
          <a href={contact.linkedin} target="_blank">
            <FaLinkedinSquare />
          </a>
        )}
        {contact.instagram && (
          <a href={contact.instagram} target="_blank">
            <FaInstagram />
          </a>
        )}
      </div>
    </div>
  )
}
