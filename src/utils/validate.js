export function validateUname(value) {
  const validUname = ['admin', 'editor']
  return validUname.some((item) => item === value.trim())
}

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}
