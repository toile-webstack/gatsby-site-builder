import React from 'react'
import {
  FaFacebookSquare,
  FaLinkedin,
  FaInstagram,
  FaYoutubeSquare,
  FaSoundcloud,
  FaTwitterSquare,
  FaGithub,
} from 'react-icons/fa'
// import IconBandcamp from "../atoms/bandcamp-button-circle-whiteblack-32.png";

export default ({ contact }) => (
  <p>
    {contact.facebook && (
      <a href={contact.facebook} target="_blank" rel="me noopener noreferrer">
        <FaFacebookSquare />
      </a>
    )}
    {contact.twitter && (
      <a href={contact.twitter} target="_blank" rel="me noopener noreferrer">
        <FaTwitterSquare />
      </a>
    )}
    {contact.linkedin && (
      <a href={contact.linkedin} target="_blank" rel="me noopener noreferrer">
        <FaLinkedin />
      </a>
    )}
    {contact.instagram && (
      <a href={contact.instagram} target="_blank" rel="me noopener noreferrer">
        <FaInstagram />
      </a>
    )}
    {contact.youtube && (
      <a href={contact.youtube} target="_blank" rel="me noopener noreferrer">
        <FaYoutubeSquare />
      </a>
    )}
    {contact.soundcloud && (
      <a href={contact.soundcloud} target="_blank" rel="me noopener noreferrer">
        <FaSoundcloud />
      </a>
    )}
    {contact.github && (
      <a href={contact.github} target="_blank" rel="me noopener noreferrer">
        <FaGithub />
      </a>
    )}
    {/* {contact.bandcamp && (
      <a href={contact.bandcamp} target="_blank" rel="me noopener noreferrer">
        <img src={IconBandcamp} />
      </a>
    )} */}
  </p>
)
