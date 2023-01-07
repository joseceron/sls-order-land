const add = require('./add-product')
const del = require('./delete-product')
const getProduct = require('./get-product')
const getProducts = require('./get-products')
const update = require('./update-product')
const importProductsFile = require('./import-products-file')
const importFileParser = require('./import-file-parser')

module.exports = {
  add,
  del,
  getProduct,
  getProducts,
  update,
  importProductsFile,
  importFileParser,
}