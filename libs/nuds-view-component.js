const View = ({ Markup, useData, data }) => {
  const d = useData(data)
  return Markup({ ...d })
}

export default View
