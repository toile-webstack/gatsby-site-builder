import React from 'react'
// import Layout from './Layout'
import Page from './Page'
import Head from './Head'
// import Page from './Page'
import Section from './Section'

// export { Layout }

// export const View = ({ Markup, useData, data }) => {
//   const d = useData(data)
//   return <Markup {...d} />
// }

// const View = ({ Markup, slots, data }) => {
//     return <Markup>

//     </Markup>
// }

const Site = ({ page, locale, locales, location, path }) => {
  return (
    <>
      <Head />
      <Page {...{ data: page, locale, locales, location, path }}>
        <Section />
        {/* <Head>
        <Meta></Meta>
        <Scripts></Scripts>
      </Head>
      <Menu></Menu>
      <Page>
        <Head>
          <Meta></Meta>
          <Scripts></Scripts>
        </Head>
        <Body>
          <Sections>
            <Heading></Heading>
            <SectionBody></SectionBody>
            <Articles></Articles>
          </Sections>
        </Body>
      </Page>
      <Footer></Footer> */}
      </Page>
    </>
  )
}

export default Site
