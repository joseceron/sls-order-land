// Route: PATCH /note

const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-east-1' })

const util = require('../util.js')

const dynamodb = new AWS.DynamoDB.DocumentClient()
const tableName = process.env.PRODUCT_TABLE

exports.handler = async (event) => {
  try {
    let item = JSON.parse(event.body)

    let data = await dynamodb.put({
      TableName: tableName,
      Item: item,
      ConditionExpression: 'id = :id AND #t = :t',
      ExpressionAttributeNames: {        
        '#t': 'timestamp'
      },
      ExpressionAttributeValues: {
        ':id': item.id,
        ':t': item.timestamp
      }
    }).promise()

    return {
      statusCode: 200,
      headers: util.getResponseHeaders(),
      body: JSON.stringify(item)
    }
  } catch (err) {
    console.log('Error:', err)
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