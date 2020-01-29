import Hug from '../../libs/Hug'

export const customHug = ({ Views, useData, data, children }) => {
  const view = data?.options?.view
  const userMarkup = data?.options?.Markup
  const Markup = userMarkup || (view && Views[view]) || Views.default
  return Hug({ data, children, useData, Markup })
}

export const dumb = ''
