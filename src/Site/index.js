import React from 'react'
// import Layout from './Layout'
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

const Lay = ({ children }) => <div>{children}</div>

const Site = () => {
  return (
    <Lay>
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
    </Lay>
  )
}

export default Site
