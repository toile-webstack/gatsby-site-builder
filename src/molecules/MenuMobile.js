import React from "react";
import { Link } from "gatsby";
import _ from "lodash";

import { rhythm, scale } from "../utils/typography";
import colors from "../utils/colors";

import MenuLocale from "../atoms/MenuLocaleSideBySide";
import MenuBurgerIcon from "../atoms/MenuBurgerIcon";
import MenuDrawer from "../atoms/MenuDrawerTop";

// menu is like {
//   en-BE: [
//     {name: 'Homepage', path: '/en-BE/'},
//     {name: 'Contact', path: '/en-BE/contact/'}
//   ],
//   fr-BE: [
//     {name: 'Accueil', path: '/fr-BE/'},
//     {name: 'Contacte-moi', path: '/fr-BE/contact/'}
//   ]
// }

class Menu extends React.Component {
  // PROPS: icon, name, menu, passCss, currentLocale
  constructor(props) {
    super(props);
    const colorCombo = colors.menuCombo;
    const newColors = colors.computeColors([1], colorCombo);
    this.colors = { ...colors, ...newColors };

    this.state = {
      open: false
    };
  }

  render() {
    // const locale = window.location.href.split("/")[3].substring(0, 2)
    const { currentLocale } = this.props;
    const currentMenu = this.props.menu && this.props.menu[currentLocale];
    const homepage = _.find(currentMenu, `homepage`);
    const homepageLink = (homepage && homepage.path) || `/`;
    const {
      classicCombo,
      contrastCombo,
      funkyCombo,
      funkyContrastCombo
    } = this.colors;
    // const locale =
    //   (currentLocale &&
    //     currentLocale.substring(0, 2).match(/fr|en/gi) &&
    //     currentLocale.substring(0, 2).match(/fr|en/gi)[0]) ||
    //   "en"

    return (
      <div>
        <nav
          className="menu"
          css={{
            ...this.colors[classicCombo].style,
            ...this.props.passCss,
            width: `100%`,
            zIndex: 100,
            // background: this.colors[classicCombo].background,
            // display: `grid`,
            // gridTemplateColumns: `32px auto ${rhythm(1)}`,
            // gridGap: rhythm(1 / 4),
            // justifyItems: `start`,
            display: `flex`,
            alignItems: `center`,
            boxShadow: `0 2px 10px rgba(0, 0, 0, .2)`,
            // borderBottom: `solid 1px ${this.colors[classicCombo].border}`,
            padding: `${rhythm(1 / 4)} ${rhythm(1)}`,
            // textAlign: `left`
            " *:not(:last-child)": {
              marginRight: rhythm(1 / 4)
            }
          }}
        >
          <Link
            className="unstyledLink"
            // TODO: link to homepage of same locale
            to={homepageLink}
            css={{
              height: 32
            }}
          >
            <img src={this.props.icon} />
          </Link>
          <Link className="unstyledLink" to={homepageLink}>
            <h4
              css={{
                marginBottom: 0,
                color: `inherit`,
                ":hover": {
                  color: `inherit`
                }
              }}
            >
              {this.props.name}
            </h4>
          </Link>
          <span css={{ flexGrow: 1 }} />
          {this.props.menu && Object.keys(this.props.menu).length > 1 && (
            <MenuLocale
              menu={this.props.menu}
              currentLocale={this.props.currentLocale}
              location={this.props.location}
              onClick={() => {
                this.setState({ open: false });
              }}
            />
          )}
          {currentMenu && currentMenu.length < 2 ? null : (
            <MenuBurgerIcon
              open={this.state.open}
              colors={this.colors}
              toggleOpen={() => {
                this.setState({ open: !this.state.open });
              }}
            />
          )}
        </nav>
        {this.props.menu && (
          <MenuDrawer
            currentMenu={currentMenu}
            open={this.state.open}
            colors={this.colors}
            close={() => {
              this.setState({ open: false });
            }}
          />
        )}
        {this.state.open && (
          <div
            onClick={() => {
              this.setState({ open: false });
            }}
            css={{
              position: `fixed`,
              top: 0,
              left: 0,
              width: `100%`,
              height: `100%`,
              opacity: `0`,
              zIndex: 90
            }}
          />
        )}
      </div>
    );
  }
}

export default Menu;
