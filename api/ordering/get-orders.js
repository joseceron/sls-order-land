const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-east-1' })

const dynamodb = new AWS.DynamoDB.DocumentClient()
const tableName = process.env.ORDER_TABLE

const util = require('../util.js')

module.exports = async (event) => {
  try {

    const params = {
      TableName: tableName,
    }

    let data = await dynamodb.scan(params).promise()

    return {
      statusCode: 200,
      headers: util.getResponseHeaders(),
      body: JSON.stringify(data)
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