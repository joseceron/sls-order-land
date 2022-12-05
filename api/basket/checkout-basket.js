// Route: POST /product

const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-east-1' })

const _ = require('underscore')
const moment = require('moment')
const { v4: uuidv4 } = require('uuid')
const util = require('../util.js')

const dynamodb = new AWS.DynamoDB.DocumentClient()
const tableName = process.env.BASKET_TABLE

exports.handler = async (event) => {
  try {
    let userName = util.getUserName(event.headers)
    const checkoutRequest = JSON.parse(event.body)

    if (checkoutRequest == null) {
      throw new Error(`checkoutRequest should exist: "${checkoutRequest}"`);
    }  
    if (userName == null) {
      throw new Error(`userName should exist in checkoutRequest: "${checkoutRequest}"`);
    }  

    // 1- Get existing basket with items
    const basket = await getBasket(userName);

    // 2- create an event json object with basket items, 
    // calculate totalprice, prepare order create json data to send ordering ms 
    var checkoutPayload = prepareOrderPayload(checkoutRequest, basket);
    
    return {
      statusCode: 200,
      headers: util.getResponseHeaders(),
      body: JSON.stringify(checkoutPayload)
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

const getBasket = async (userName) => {
  console.log("getBasket");
  try {
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
      return data.Items[0]
    } else {
      return {}
    }

  } catch(e) {
    console.error(e);
    throw e;
  }
}

const prepareOrderPayload = (checkoutRequest, basket) => {    
  console.log("prepareOrderPayload");
  
  // prepare order payload -> calculate totalprice and combine checkoutRequest and basket items
  // aggregate and enrich request and basket data in order to create order payload    
  try {
      if (basket == null || basket.items == null) {
          throw new Error(`basket should exist in items: "${basket}"`);
      }

      // calculate totalPrice
      let totalPrice = 0;
      basket.items.forEach(item => totalPrice = totalPrice + item.price);
      checkoutRequest.totalPrice = totalPrice;
      console.log(checkoutRequest);
  
      // copies all properties from basket into checkoutRequest
      Object.assign(checkoutRequest, basket);
      console.log("Success prepareOrderPayload, orderPayload:", checkoutRequest);
      return checkoutRequest;

    } catch(e) {
      console.error(e);
      throw e;
  }    
}