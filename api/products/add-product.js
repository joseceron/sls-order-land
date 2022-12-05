// Route: POST /product

const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-east-1' })

const moment = require('moment')
const { v4: uuidv4 } = require('uuid')
const util = require('../util.js')

const dynamodb = new AWS.DynamoDB.DocumentClient()
const tableName = process.env.PRODUCT_TABLE

exports.handler = async (event) => {
  try {
    let item = JSON.parse(event.body)
   
    item.id = uuidv4()
    item.timestamp = moment().unix()

    console.log(item)

    let data = await dynamodb.put({
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