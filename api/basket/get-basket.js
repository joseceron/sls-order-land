// Route: GET /basket

const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-east-1' })

const _ = require('underscore')
const util = require('../util.js')

const dynamodb = new AWS.DynamoDB.DocumentClient()
const tableName = process.env.BASKET_TABLE

module.exports = async (event) => {
  try {
    let userName = util.getUserName(event.headers)
    let params = {
      TableName: tableName,
      KeyConditionExpression: 'userName = :userName',
      ExpressionAttributeValues: {
        ':userName': userName
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
        headers: util.getResponseHeaders(),
      }
    }
  } catch (err) {
    console.log('ERROR: ', err)
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