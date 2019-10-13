import React from 'react'
import { For } from 'react-loops'

import { Stack, Sidebar, Switcher } from '../../libs/layout-primitives'
import { rhythm, scale } from '../utils/typography'

// A View associates data with a layout definition
export const View = ({ data, layout }) => {
  return null
}

// It can represent a full page, a simple block of text, a button, ...
// The data structure it can receive is fixed but it can be mapped
// anyhow through a markup definition
export const LayoutUniversal = ({
  // The markup below is a default Layout definition but other markups could be
  // provided to arrange a layout in another way
  // markup,
  children,
  menu,
  header,
  main,
  aside,
  asides,
  //
  logo,
  shortName,
  links,
  langs, // ???
  featuredImage,
  heading,
  introduction,
}) => {
  // const {logo, text, links, langs} = menu
  return (
    <Stack>
      <Menu {...{ logo, shortName, links, langs }} />
      <Header {...{ featuredImage, heading, introduction }} />
      <Sidebar>
        <Main {...main}>
          <For of={sections}>
            {section => (
              <Section>
                <HeaderOfSection></HeaderOfSection>
                <For of={articles}>
                  {article => (
                    <Article>
                      <For of={blocks}>{block => <Block />}</For>
                    </Article>
                  )}
                </For>
                <FooterOfSection></FooterOfSection>
              </Section>
            )}
          </For>
        </Main>
        <Aside {...aside}>
          <For of={sectionsAside}>
            {section => (
              <Section>
                <For of={columnsAside}>
                  {column => (
                    <Column>
                      <For of={blocks}>{block => <Block />}</For>
                    </Column>
                  )}
                </For>
              </Section>
            )}
          </For>
        </Aside>
      </Sidebar>
      <Footer></Footer>
    </Stack>
  )
}

export const Page = ({ children, ...props }) => (
  <Stack {...{ children, ...props }} />
)

export const Layout = ({ children }) => {
  return children
}

export const Menu = ({ children, logo, shortName, links, langs }) => {
  return (
    <Sidebar>
      <div>
        <span>Logo</span>
        <span>Text</span>
      </div>
      <div>
        <Switcher as="nav">
          <For of={links}>{link => <a>Link</a>}</For>
        </Switcher>
        <nav>
          <For of={langs}>{lang => <a>Langs</a>}</For>
        </nav>
      </div>
    </Sidebar>
  )
}

export const Header = ({ children, featuredImage, heading, introduction }) => {
  return (
    <Stack>
      <span>Featured Image</span>
      <h1>Heading</h1>
      <p>Introduction</p>
    </Stack>
  )
}

export const Footer = () => {
  return null
}

export const Aside = () => {
  return null
}

export const AsidePage = () => {
  return null
}

export const Main = ({ children }) => {
  return children
}

export const Section = ({ children }) => {
  return <section>{children}</section>
}

export const Column = ({ children, ...props }) => {
  return (
    <div
      css={{
        display: `flex`,
        flexFlow: `column`,
        width: `100%`,
        // "> div": {
        //   ...this.colors[classicCombo].style,
        //   ":hover": {
        //     ...this.colors[funkyCombo].style,
        //   },
        // },
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export const Block = ({ children, ...props }) => {
  return (
    <div
      {...{
        css: {
          // FREETEXT
          padding: '1rem',
          //   padding: rhythm(1),
          display: `flex`,
          flexFlow: 'row wrap',
          justifyContent: `center`,
          alignItems: `center`,
          width: `100%`,
          maxWidth: `1000px`,
          margin: `0 auto`,

          // REFERENCES
          //   width: `100%`,
          //   maxWidth: `1000px`,
          //   margin: `auto`,
          //   flexGrow: 1,
          //   display: `flex`,
          //   flexFlow: `column`,
        },
        ...props,
      }}
    >
      {children}
    </div>
  )
}

export const BlockMain = ({ children, ...props }) => (
  <div
    css={{
      padding: rhythm(1),
      display: `flex`,
      flexFlow: `row wrap`,
      justifyContent: [`space-around`, `space-evenly`],
      alignItems: `flex-start`,
      width: `100%`,
      margin: `0 auto`,
      // "> a": {
      //   width: `100%`,
      //   maxWidth:
      //     block.references.length < 3
      //       ? `calc((1000px - ${rhythm(2)}) / ${block.references.length})`
      //       : `calc((1000px - ${rhythm(2)}) / 3)`,
      //   // margin: `auto`,
      //   padding: `${rhythm(1 / 2)} ${rhythm(1 / 8)}`
      // },
      ' .image': {
        // height: `200px` // TODO: check if it does not scew up block references but wes posing problem for Testimonials
      },
      ' h3': {
        marginTop: 0,
      },
      // " a.button:hover": {
      //   ...this.colors[funkyContrastCombo].style,
      //   borderColor: this.colors[classicCombo].border
      // }
    }}
    {...props}
  >
    {children}
  </div>
)

export const ListCategories = ({ children, ...props }) => (
  <div
    css={{
      display: `flex`,
      flexFlow: `row wrap`,
      justifyContent: `center`,
      ' > *': {
        margin: `${rhythm(1 / 4)} ${rhythm(1 / 4)}`,
        padding: `${rhythm(1 / 8)} ${rhythm(1 / 4)}`,
        cursor: `pointer`,
        border: `solid 1px`,
      },
    }}
    {...props}
  >
    {children}
  </div>
)
