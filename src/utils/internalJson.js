const internalJson = o =>
  (o && o.internal && o.internal.content && JSON.parse(o.internal.content)) ||
  o ||
  {};

export default internalJson;
