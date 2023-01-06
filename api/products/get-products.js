// GET /products

const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-east-1'})

const util = require('../util.js')

const dynamodb = new AWS.DynamoDB.DocumentClient()
const tableName = process.env.PRODUCT_TABLE

module.exports = async (event) => {
  try {
    console.log(event.headers)
    let { limit, start, productId } = util.getPaginationParams(event.headers)
    
    const params = {
      TableName: tableName,
      Limit: limit,
      ScanIndexForward: false // order item desc (sort key)
    }

    if (start > 0) {
      params.ExclusiveStartKey = {
        id: productId,
        timestamp: start
      }
    }
    let data = await dynamodb.scan(params).promise()

    return {
      statusCode: 200,
      headers: util.getResponseHeaders(),
      body: JSON.stringify(data)
    }
  } catch (err) {
    console.log('Error: ', err)
    return {
      statusCode: err.statusCode ? err.statusCode : 500,
      headers: util.getResponseHeaders(),
      body: JSON.stringify({
        err: err.name ? err.name : 'Exception',
        message: err.message ? err.message : 'Unknown error'
      })
    }
  }
}