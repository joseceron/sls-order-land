const getUserId = (headers) => {
  return headers.app_user_id
}

const getUserName = (headers) => {
  return headers.app_user_name
}

const getIdToken = (headers) => {
  return headers.Authorization
}

const getResponseHeaders = () => {
  return {
    "Access-Control-Allow-Origin": "*"
  }
}

const getPaginationParams = (headers) => {
  const limit = headers && headers.limit ? parseInt(headers.limit) : 5
  const start = headers && headers.start ? parseInt(headers.start) : 0
  const productId = headers && headers.product_id ? headers.product_id : null
  return { limit, start, productId}
}

module.exports = {
  getUserId,
  getUserName,
  getIdToken,
  getResponseHeaders,
  getPaginationParams
}