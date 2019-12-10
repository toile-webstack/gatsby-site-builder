import React from 'react'
import FaFacebookSquare from 'react-icons/lib/fa/facebook-square'
import FaLinkedinSquare from 'react-icons/lib/fa/linkedin-square'
import FaInstagram from 'react-icons/lib/fa/instagram'
import FaYoutubeSquare from 'react-icons/lib/fa/youtube-square'
import FaSoundcloud from 'react-icons/lib/fa/soundcloud'
import FaTwitterSquare from 'react-icons/lib/fa/twitter-square'
import FaGithub from 'react-icons/lib/fa/github'

// import IconBandcamp from "../atoms/bandcamp-button-circle-whiteblack-32.png";

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
    {contact.twitter && (
      <a href={contact.twitter} target="_blank" rel="me noopener">
        <FaTwitterSquare />
      </a>
    )}
    {contact.linkedin && (
      <a href={contact.linkedin} target="_blank" rel="me noopener">
        <FaLinkedinSquare />
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
    {contact.github && (
      <a href={contact.github} target="_blank" rel="me noopener">
        <FaGithub />
      </a>
    )}
    {/* {contact.bandcamp && (
      <a href={contact.bandcamp} target="_blank" rel="me noopener">
        <img src={IconBandcamp} />
      </a>
    )} */}
  </p>
)
