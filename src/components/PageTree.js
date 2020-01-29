import React from 'react'
import { For } from 'react-loops'

import Hug from '../../libs/Hug'

import Head from '../Site/Head'
import { Page, Section, Block, FreeText, Gallery, Image } from '.'

const BlockMarkup = ({ children, ...data }) => {
  return (
    <div>
      <h3>{data.name}</h3>
      <p>{data.contentType}</p>
      {children}
    </div>
  )
}

const ReferencesMarkup = ({ children, ...data }) => {
  return (
    <div>
      <h4>{data.path || 'REFERENCE'}</h4>
      <p>{data.contentType}</p>
      {children}
    </div>
  )
}

const testMarkup = {
  component: 'div',
  children: [
    {
      component: 'h1',
      children: 'Tayauuuuu',
    },
    {
      component: 'children',
    },
    // {
    //   component: Children,
    //   children: '{{children}}',
    // },
  ],
}

const BlockHug = ({ data, children }) => {
  return <Hug {...{ data, children, Markup: BlockMarkup }} />
}

const ReferencesHug = ({ data, children }) => {
  return <Hug {...{ data, children, Markup: ReferencesMarkup }} />
}

const PageTree = ({ page, settings, locale, locales, location, path }) => {
  const { metadata: siteMetadata } = settings
  const { id, metadata, scripts, blocks } = page
  const canonicalUrl = siteMetadata.url + path.substr(1)

  return (
    <>
      <Head
        {...{
          lang: locale,
          name: siteMetadata.name,
          title: metadata.title,
          description: metadata.description,
          canonicalUrl,
          // IDEA: use fullPath in sitePage fields for canonical url
          ogType: metadata.ogType,
          //
          ...(scripts && {
            scripts,
            async: true,
            dynamicOnly: true,
            scriptsPrefix: id,
          }),
        }}
      />
      <Page {...{ data: page }}>
        <For
          {...{
            of: blocks,
            as: block => {
              switch (block.contentType) {
                default:
                  return null
                case 'blockFreeText':
                  return (
                    <Block {...{ data: block }}>
                      <FreeText {...{ data: block }} />
                    </Block>
                  )
                case 'blockForm':
                case 'blockGallery':
                  return (
                    <Block {...{ data: block }}>
                      <Gallery {...{ data: block }}>
                        <For
                          {...{
                            of: block.gallery,
                            as: (image, listMeta) => {
                              return (
                                <Image
                                  {...{
                                    data: {
                                      ...image,
                                      // options: block.options,
                                      gallery: block,
                                      listMeta,
                                    },
                                  }}
                                />
                              )
                            },
                          }}
                        />
                      </Gallery>
                    </Block>
                  )
                case 'blockReferences':
                  return <BlockHug {...{ data: block }} />
                case 'section':
                  return (
                    <Section {...{ data: block }}>
                      <For
                        {...{
                          of: block.blocks,
                          as: blockChild => {
                            switch (blockChild.contentType) {
                              case 'blockFreeText':
                                return (
                                  <Block {...{ data: blockChild }}>
                                    <FreeText {...{ data: blockChild }} />
                                  </Block>
                                )
                              case 'blockForm':
                                return <BlockHug {...{ data: blockChild }} />
                              case 'blockGallery':
                                return (
                                  <Block {...{ data: blockChild }}>
                                    <Gallery {...{ data: blockChild }}>
                                      <For
                                        {...{
                                          of: blockChild.gallery,
                                          as: (image, listMeta) => {
                                            return (
                                              <Image
                                                {...{
                                                  data: {
                                                    ...image,
                                                    // options: blockChild.options,
                                                    gallery: blockChild,
                                                    listMeta,
                                                  },
                                                }}
                                              />
                                            )
                                          },
                                        }}
                                      />
                                    </Gallery>
                                  </Block>
                                )
                              case 'blockReferences':
                                return (
                                  <BlockHug {...{ data: blockChild }}>
                                    <For
                                      {...{
                                        of: blockChild.references,
                                        as: reference => {
                                          return (
                                            <ReferencesHug
                                              {...{ data: reference }}
                                            />
                                          )
                                        },
                                      }}
                                    />
                                  </BlockHug>
                                )
                              default:
                                return null
                            }
                          },
                        }}
                      />
                    </Section>
                  )
              }
            },
          }}
        />
      </Page>
    </>
  )
}

export default PageTree
