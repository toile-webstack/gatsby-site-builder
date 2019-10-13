import React from 'react'
import { For } from 'react-loops'
import { useForm } from '../logic'
import { canonize } from '../../utils/utils'
import { removeFirst } from '../utils'
import { backgroundImageWithCover } from '../../libs/functional-styles'
import {
  Stack,
  Box,
  Center,
  Cluster,
  Sidebar,
  Switcher,
  Cover,
  Grid,
  Frame,
  Reel,
} from '../../libs/layout-primitives'

export SEO from './SEO'
export Scripts from './Scripts'

export const Header = ({
  fields: { featuredImage, main, semanticHeader, layout, options, style },
}) => {
  const Element = semanticHeader ? 'header' : 'div'

  // console.log(main)
  //   if (layout) {
  //     const {
  //       markup: { layout: layoutMarkup },
  //     } = layout
  //   }

  return (
    <Stack as={Element} data-elem="header">
      {featuredImage?.file?.url && (
        <img {...{ src: featuredImage?.file?.url }} />
      )}
      {main}
    </Stack>
  )
}

export const Sections = ({ children }) => {
  return <Stack data-elem="sections">{children}</Stack>
}

export const Section = ({
  fields: {
    backgroundImage,
    content,
    layoutSection,
    name,
    options,
    semanticSection,
    style,
  } = {},
}) => {
  const Element = semanticSection ? 'section' : 'div'
  const bgUrlUnformatted = backgroundImage?.file?.url
  const bgUrl =
    bgUrlUnformatted && `https:${bgUrlUnformatted}?fm=jpg&fl=progressive`

  const contentLength = content.length
  const contentSorted =
    Array.isArray(content) &&
    content.reduce(
      (acc, elem, i) => {
        // if (!elem) return acc

        const isLastElem = i === contentLength - 1
        const elemType = elem?.type?.name || elem?.type

        const header = i === 0 && elemType === 'Header' && elem
        const article = i === 0 && elemType === 'Article' && elem
        const collection = elemType === 'Collection' && elem
        const nonArticled = !header && !article && !collection && elem

        // COLLECT non articles in articles
        // if the current comp in non articled, we add it to temp list
        const currentNonArticled = [
          ...acc.nonArticledAccu,
          ...(nonArticled ? [nonArticled] : []),
        ]
        // "close" an Article component if the current comp is not non articled or if it is the last comp of the content
        const articleFromAccu = (isLastElem || !nonArticled) &&
          !!currentNonArticled.length && (
            <Article
              key={currentNonArticled[0]?.key}
              fields={{ content: currentNonArticled }}
            />
          )
        // COLLECT articles
        // the current list of articles
        const articlesAccu = [
          ...acc.articlesAccu,
          ...(articleFromAccu ? [articleFromAccu] : []),
          ...(article ? [article] : []),
        ]

        // COLLECT COLLECTIONS
        const collectionFromAccu = (isLastElem || collection || header) &&
          !!articlesAccu.length && (
            <Articles
              //   key={
              //     articlesAccu[0]?.key ||
              //     articlesAccu[0]?.props?.fields?.content[0]?.key
              //   }
              fields={{ content: articlesAccu }}
            />
          )

        return {
          ...acc,
          ...(header && { header }),
          collections: [
            ...acc.collections,
            ...(collectionFromAccu ? [collectionFromAccu] : []),
            ...(collection ? [collection] : []),
          ],
          articlesAccu: collectionFromAccu ? [] : articlesAccu,
          nonArticledAccu: articleFromAccu ? [] : currentNonArticled,
        }
      },
      { nonArticledAccu: [], header: null, articlesAccu: [], collections: [] },
    )

  const { header: headerOfSection, collections } = contentSorted

  //   const headerOfSection =
  //     content && content[0]?.type?.name === 'Header' ? content[0] : null
  //   const articles = headerOfSection ? removeFirst(content) : content

  return (
    <Element
      data-elem="section"
      css={{
        ...backgroundImageWithCover({ url: bgUrl }),
      }}
    >
      {headerOfSection}
      <For of={collections}>{collection => collection}</For>
    </Element>
  )
}

export const Collection = ({
  fields: { documents, layoutPage, layoutSection, layoutPreview },
}) => {
  return (
    <Switcher data-elem="collection">
      {documents.map(d => {
        // console.log(d)
        return <div key={d.name}>{d.name}</div>
      })}
    </Switcher>
  )
}

export const Articles = ({ children, fields: { content } }) => {
  return <Switcher data-elem="articles">{children || content}</Switcher>
}

export const Article = ({ fields: { content, options, style } }) => {
  return <Stack data-elem="article">{content}</Stack>
}

export const BlockFreeText = ({ fields: { content, options, style } }) => {
  return <div>{content}</div>
}

export const BlockForm = ({
  meta: { name },
  fields: { form, successMessage, errorMessage, options, style },
}) => {
  const { children: formElement } = useForm({
    formName: canonize(name),
    formFields: form?.formFields,
    successMessage,
    errorMessage,
  })
  return formElement
}

export const BlockGallery = ({ fields: { gallery, options, style } }) => {
  return !gallery ? null : (
    <div>
      {gallery.map((img, i) => (
        <img {...{ key: `${img.title}-${i}`, src: img?.file?.url }} />
      ))}
    </div>
  )
}

export const BlockReferences = ({ fields: { references, options, style } }) => {
  return !references || !references[0] ? null : (
    <div>{references.map(({ content }) => content)}</div>
  )
}

export const BlockCta = ({ fields: { callToAction, options, style } }) => {
  return <div>{callToAction}</div>
}
