// Route: POST /product

const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-east-1' })

const util = require('../util.js')

const dynamodb = new AWS.DynamoDB.DocumentClient()
const tableName = process.env.BASKET_TABLE

module.exports = async (event) => {
  try {
    let userName = util.getUserName(event.headers)
    let params = {
      TableName: tableName,
      Key: {
        userName: userName,
      }
    }

    await dynamodb.delete(params).promise()
    return {
      statusCode: 204,
      headers: util.getResponseHeaders(),
    }
  } catch (err) {
    console.log('Error: ',  err)
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