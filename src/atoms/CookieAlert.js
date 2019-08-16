import React from 'react';
// import PropTypes from 'prop-types'
// import { Flex, Box, Fixed, Text, Button } from '../elements'
// import { Translations } from '.'
import { rhythm, scale } from '../utils/typography';
import colors from '../utils/colors';

import Section from '../blocks/Section';

const OkButton = ({ handleClick, style }) => (
  <button
    {...{
      onClick: handleClick,
      css: {
        display: 'block',
        margin: `${rhythm(1)} auto 0`,
        ...style,
      },
    }}
  >
    OK
  </button>
);

class CookieAlert extends React.Component {
  constructor(props) {
    super(props);
    const newColors = colors.computeColors([1], 'classic');
    this.colors = { ...colors, ...newColors };

    this.state = {
      cookieAccepted: true,
    };
  }

  componentDidMount() {
    this.checkCookie();
  }

  checkCookie = () => {
    const cookieAccepted = localStorage.getItem('accepts-cookies') === 'true';
    this.setState({ cookieAccepted });
  };

  handleClick = () => {
    localStorage.setItem('accepts-cookies', 'true');
    this.setState({ cookieAccepted: true });
  };

  render() {
    const {
      classicCombo,
      contrastCombo,
      funkyCombo,
      funkyContrastCombo,
    } = this.colors;
    const { section } = this.props;

    if (!section) {
      return null;
    }

    return (
      <div
        {...{
          css: {
            position: 'fixed',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            opacity: this.state.cookieAccepted ? 0 : 1,
            bottom: this.state.cookieAccepted ? '-100vh' : 0,
            visibility: this.state.cookieAccepted ? 'hidden' : 'visible',
            left: 0,
            right: 0,
            zIndex: 20,
            ...scale(-0.1),
            // paddingBottom: rhythm(1),
            // ...scale(-0.2),
            // lineHeight: 1.3,
            transition: this.state.cookieAccepted
              ? 'bottom .5s ease-in, opacity .5s ease-out, visibility 0s ease 1s'
              : 'bottom .5s ease-out, opacity 1s ease-in',
          },
        }}
      >
        <Section
          block={section}
          // customContentTypeList={this.props.data.customContentType}
          colors={this.colors}
          location={this.props.location}
          csss={{
            paddingBottom: 0,
          }}
          cookieButton={({ style }) => (
            <OkButton handleClick={this.handleClick} style={style} />
          )}
        />
      </div>
    );
  }
}

export default CookieAlert;
