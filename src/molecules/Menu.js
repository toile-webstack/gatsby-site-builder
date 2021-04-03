import React from 'react'
import { Link } from 'gatsby'
import _ from 'lodash'

import { rhythm, scale } from '../utils/typography'
import colors from '../utils/colors'

import MenuLocale from '../atoms/MenuLocaleSideBySide'
import MenuSplitLinks from '../atoms/MenuSplitLinks'
import MenuBurgerIcon from '../atoms/MenuBurgerIcon'
import MenuDrawer from '../atoms/MenuDrawerTop'

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
    super(props)
    const colorCombo = colors.menuCombo
    const newColors = colors.computeColors([1], colorCombo)
    this.colors = { ...colors, ...newColors }

    this.state = {
      open: false,
      localesOpen: false,
      showMobileMenu: false,
      showName: true,
    }
  }

  componentDidMount() {
    if (typeof window !== 'undefined' && this.props.menu) {
      this.menuPusher = document.querySelector(`.menuPusher`)
      this.menuLinks = document.querySelector(`.menuLinks`)
      // this.windowWidth = window.innerWidth
      // this.menu = document.querySelector(`.menu`)
      // this.menuName = document.querySelector(`.menuName`)

      this.decideMenuToShow()
      this.decideToShowName()
      window.addEventListener('resize', this.listen)
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.listen)
  }

  listen = () => {
    // console.log(this.state.menuPusherWidth, this.state.menuLinksWidth)
    this.decideMenuToShow()
    this.decideToShowName()
  }

  decideMenuToShow() {
    if (
      Math.abs(this.menuPusher.offsetWidth - this.menuLinks.offsetWidth) > 40
    ) {
      this.setState({ showMobileMenu: false })
    } else {
      this.setState({ showMobileMenu: true })
    }
  }

  decideToShowName() {
    if (window.innerWidth < 450) {
      this.setState({ showName: false })
    } else {
      this.setState({ showName: true })
    }
  }

  render() {
    // console.log(this.state.menuPusherWidth)

    // const locale = window.location.href.split("/")[3].substring(0, 2)
    const { currentLocale } = this.props
    const currentMenu = this.props.menu && this.props.menu[currentLocale]
    const homepage = _.find(currentMenu, `homepage`)
    const homepageLink = (homepage && homepage.path) || `/`
    const {
      classicCombo,
      contrastCombo,
      funkyCombo,
      funkyContrastCombo,
    } = this.colors
    // const locale =
    //   (currentLocale &&
    //     currentLocale.substring(0, 2).match(/fr|en/gi) &&
    //     currentLocale.substring(0, 2).match(/fr|en/gi)[0]) ||
    //   "en"

    return (
      <div
        css={{
          position: `sticky`,
          top: 0,
          left: 0,
          zIndex: 100,
        }}
      >
        <nav
          className="menu"
          css={{
            ...this.colors[classicCombo].style,
            position: 'relative',
            zIndex: 100,
            width: `100%`,
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
            '> *': {
              flexShrink: 0,
            },
            ' *:not(:last-child)': {
              marginRight: rhythm(1 / 4),
            },
          }}
        >
          <Link
            className="unstyledLink"
            // TODO: link to homepage of same locale
            to={homepageLink}
            css={{
              height: 32,
            }}
          >
            <img
              src={this.props.icon}
              css={{
                maxWidth: 32,
                maxHeight: 32,
              }}
            />
          </Link>
          <Link className="unstyledLink menuName" to={homepageLink}>
            <h4
              css={{
                display: this.state.showName ? `block` : `none`,
                margin: 0,
                color: `inherit`,
                ':hover': {
                  color: `inherit`,
                },
              }}
            >
              {this.props.name}
            </h4>
          </Link>
          <div
            className="menuPusher"
            css={{
              flexGrow: 1,
              display: `flex`,
              justifyContent: `flex-end`,
              position: `relative`,
              height: rhythm(1),
            }}
          >
            {this.props.menu && (
              <MenuSplitLinks
                currentMenu={currentMenu}
                open={this.state.open}
                colors={this.colors}
                show={!this.state.showMobileMenu}
                location={this.props.location}
                passCSS={
                  {
                    // maxWidth: this.state.menuPusherWidth
                  }
                }
              />
            )}
          </div>
          {this.props.menu && Object.keys(this.props.menu).length > 1 && (
            <MenuLocale
              menu={this.props.menu}
              currentLocale={this.props.currentLocale}
              location={this.props.location}
              open={this.state.localesOpen}
              toggleOpen={() => {
                this.setState({
                  open: false,
                  localesOpen: !this.state.localesOpen,
                })
              }}
            />
          )}
          {!currentMenu ||
          currentMenu.length < 2 ||
          !this.state.showMobileMenu ? null : (
            <MenuBurgerIcon
              open={this.state.open}
              colors={this.colors}
              toggleOpen={() => {
                this.setState({ open: !this.state.open })
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
              this.setState({ open: false })
            }}
            passCSS={{
              right: rhythm(1 / 2),
              left: rhythm(1 / 2),
            }}
          />
        )}
        {this.state.open && (
          <div
            onClick={() => {
              this.setState({ open: false })
            }}
            css={{
              position: `fixed`,
              top: 0,
              left: 0,
              width: `100%`,
              height: `100%`,
              opacity: `0`,
              zIndex: 90,
            }}
          />
        )}
      </div>
    )
  }
}

export default Menu
