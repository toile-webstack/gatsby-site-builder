import React from 'react'
import For from 'react-loops'

import { layoutStyles as ls } from '../../libs/nuds-layout-primitives'

const Block = ({ block }) => {
  console.log(block)
  const {
    id,
    name,
    _typename,
    options,
    style,

    blocks,
    main,
    form,
    successMessage,
    errorMessage,
    gallery,
    references,
  } = block
  return null
}

const Composite = ({ children, ...props }) => {
  return <div {...props}>{children}</div>
}

const Leaf = ({ ...props }) => {
  return <div {...props} />
}

const Wrapper = Composite

const Heading = Wrapper

const FeaturedImage = ({ alt, ...props }) => {
  return <img alt={alt || ''} {...props} />
}

const List = ({ children, ...props }) => {
  return <div {...props}>{children}</div>
}

const Item = ({ ...props }) => {
  return <div {...props} />
}

const Matryoshka = ({
  wrapper,
  heading: {
    featuredImage,
    title,
    subtitle,
    body: bodyHeading,
    ...heading
  } = {},
  list,
  item,
  items,
  children,
}) => {
  return (
    <Wrapper {...wrapper}>
      {/* <Heading {...heading}>
        <FeaturedImage {...featuredImage} />
        <Title {...title} />
        <SubTitle {...subtitle} />
        <Body {...bodyHeading} />
      </Heading> */}
      <List {...list}>
        <For
          of={children}
          as={(child, { index }) => (
            <Item {...{ ...item, ...(items && items[index]) }} />
          )}
        />
      </List>
    </Wrapper>
  )
}

export default Block
