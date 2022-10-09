export function getQuery(url) {
  const index = url.indexOf('?')
  if (index !== -1) {
    const queryArr = url.substring(index + 1).split('&')
    const obj = {}
    queryArr.forEach((item) => {
      const itemArr = item.split('=')
      obj[itemArr[0]] = itemArr[1]
    })
    return obj
  }
  return null
}
