// Route: GET /product/{productId}

const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-east-1' })

const util = require('../util.js')

const _ = require('underscore')
const dynamodb = new AWS.DynamoDB.DocumentClient()
const tableName = process.env.PRODUCT_TABLE

module.exports = async (event) => {
  try {
    const productId = decodeURIComponent(event.pathParameters.productId)
    console.log('productId: ', productId)

    const params = {
      TableName: tableName,
      KeyConditionExpression: 'id = :productId',
      ExpressionAttributeValues: {
        ':productId': productId
      },
      Limit: 1
    }

    let data = await dynamodb.query(params).promise()
    if (!_.isEmpty(data.Items)) {
      return {
        statusCode: 200,
        headers: util.getResponseHeaders(),
        body: JSON.stringify(data.Items[0])
      }
    } else {
      return {
        statusCode: 404,
        headers: util.getResponseHeaders()
      }
    }

  } catch (err) {
    console.log('Error: ', err)
    return {
      statusCode: err.statusCode ? err.statusCode : 500,
      headers: util.getResponseHeaders(),
      body: JSON.stringify({
        error: err.name ? err.name : 'Exception',
        message: err.message ? err.message : 'Unknown Error'
      })
    }
  }
}