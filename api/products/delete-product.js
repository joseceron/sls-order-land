// Route: DELETE /product/{id}

const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-east-1' })

const util = require('../util.js')

const dynamodb = new AWS.DynamoDB.DocumentClient()
const tableName = process.env.PRODUCT_TABLE

exports.handler = async (event) => {
  try {
    let productId = event.pathParameters.productId
    const timestamp = JSON.parse(event.body).timestamp
    
    let params = {
      TableName: tableName,
      Key: {
        id: productId,
        timestamp: timestamp
      }
    }

    console.log(productId)

    await dynamodb.delete(params).promise()
    return {
      statusCode: 204,
      headers: util.getResponseHeaders()
    }

  } catch (err) {
    console.log('Error: ', err)
    return {
      statusCode: err.statusCode ? err.statusCode : 500,
      headers: util.getResponseHeaders(),
      body: JSON.stringify({
        error: err.name ? err.name : 'Exception',
        message: err.message ? err.message : 'Unknown error'
      })
    }
  }
}