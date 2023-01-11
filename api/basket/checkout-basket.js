// Route: POST /product

const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-east-1' })

const { EventBridgeClient, PutEventsCommand } = require('@aws-sdk/client-eventbridge')

const ebClient = new EventBridgeClient({ region: 'us-east-1'})

const dynamodb = new AWS.DynamoDB.DocumentClient()
const tableName = process.env.BASKET_TABLE

const _ = require('underscore')
const util = require('../util.js')
const deleteBasket = require('./delete-basket')

module.exports = async (event) => {
  try {
    let userName = util.getUserName(event.headers)
    console.log('userName: ', userName)
    const checkoutRequest = JSON.parse(event.body)
    console.log('checkoutRequest: ', checkoutRequest)

    if (checkoutRequest == null) {
      throw new Error(`checkoutRequest should exist: "${checkoutRequest}"`);
    }  
    if (userName == null) {
      throw new Error(`userName should exist in checkoutRequest: "${checkoutRequest}"`);
    }  

    // 1- Get existing basket with items
    const basket = await getBasket(userName);
    // // 2- create an event json object with basket items, 
    // // calculate totalprice, prepare order create json data to send ordering ms 
    let checkoutPayload = prepareOrderPayload(checkoutRequest, basket);
    
    // console.log('QUEUE_URL: ',  process.env.QUEUE_URL)
    // // 3- publish an event to eventbridge - this will subscribe by order microservice and start ordering process.
    // // await sendCheckoutBasketSQS(checkoutPayload)
    const resEvent = await publishCheckoutBasketEvent(checkoutPayload)                           
    console.log('resEvent: ', resEvent)

    // // 4- remove existing basket
    await deleteBasket(event);

    return {
      statusCode: 200,
      headers: util.getResponseHeaders(),
      body: JSON.stringify({checkoutPayload})
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
  
      // copies all properties from basket into checkoutRequest
      Object.assign(checkoutRequest, basket);
      console.log("Success prepareOrderPayload, orderPayload:", checkoutRequest);
      return checkoutRequest;

    } catch(e) {
      console.error(e);
      throw e;
  }    
}

const publishCheckoutBasketEvent = async (checkoutPayload) => {
  console.log("publishCheckoutBasketEvent with payload :", checkoutPayload);
  try {
      // eventbridge parameters for setting event to target system
      const params = {
        Entries: [
          {
            Source: 'com.sls.basket.checkoutbasket',
            Detail: JSON.stringify(checkoutPayload),
            DetailType: 'CheckoutBasket',
            Resources: [ ],
            EventBusName: 'sls-event-bus'
          },
        ],
      };
      console.log('params')
      console.log(params);
   
      const data = await ebClient.send(new PutEventsCommand(params));
  
      console.log("Success, event sent; requestID:", data);
      return data;
    } catch(e) {
      console.error(e);
      throw e;
  }
}
