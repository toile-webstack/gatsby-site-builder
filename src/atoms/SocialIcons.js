import React from 'react'
import {
  FaFacebookSquare,
  FaLinkedin,
  FaInstagram,
  FaYoutubeSquare,
  FaSoundcloud,
} from 'react-icons/fa'

// import IconBandcamp from '../atoms/bandcamp-button-circle-whiteblack-32.png'

export default ({ contact }) => (
  <p>
    {contact.facebook && (
      <a
        href={`https://www.facebook.com/${contact.facebook}/`}
        target="_blank"
        rel="me noopener"
      >
        <FaFacebookSquare />
      </a>
    )}
    {contact.linkedin && (
      <a href={contact.linkedin} target="_blank" rel="me noopener">
        <FaLinkedin />
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
    {contact.soundcloud && (
      <a href={contact.soundcloud} target="_blank" rel="me noopener">
        <FaSoundcloud />
      </a>
    )}
    {/* {contact.bandcamp && (
      <a href={contact.bandcamp} target="_blank" rel="me noopener">
        <img src={IconBandcamp} />
      </a>
    )} */}
  </p>
)
