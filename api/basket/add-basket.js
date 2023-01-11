// Route: POST /product

const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-east-1' })

const util = require('../util.js')

const dynamodb = new AWS.DynamoDB.DocumentClient()
const tableName = process.env.BASKET_TABLE

module.exports = async (event) => {
  try {
    let userName = util.getUserName(event.headers)
    console.log(userName)
    let items = JSON.parse(event.body).items
    console.log(items)

    let item = {
      userName,
      items
    }
    await dynamodb.put({
      TableName: tableName,
      Item: item
    }).promise()
    return {
      statusCode: 201,
      headers: util.getResponseHeaders(),
      body: JSON.stringify(item)
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