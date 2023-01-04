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
  const limit = Number(headers.limit)
  const start = Number(headers.start)
  const productId = headers.productId
  return { limit, start, productId}
}

module.exports = {
  getUserId,
  getUserName,
  getIdToken,
  getResponseHeaders,
  getPaginationParams
}