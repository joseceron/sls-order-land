const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-east-1' })

const dynamodb = new AWS.DynamoDB.DocumentClient()
const tableName = process.env.ORDER_TABLE

module.exports = async (event) => {
  for (const record of event.Records) {
    const messageAttributes = record.messageAttributes;
    console.log(
      "Message Attribute: ",
      messageAttributes.AttributeName.stringValue
    );
    const checkoutEventRequest = JSON.parse(record.body)
    // create order item into db
    await createOrder(checkoutEventRequest)
  }
};

const createOrder = async (basketCheckoutEvent) => {
  try {
    console.log('createOrder function');

    // set orderDate for SK of order dynamodb
    const orderDate = new Date().toISOString();
    basketCheckoutEvent.orderDate = orderDate;
    console.log(basketCheckoutEvent);

    await dynamodb.put({
      TableName: tableName,
      Item: basketCheckoutEvent
    }).promise()

  } catch(e) {
    console.error(e);
    throw e;
  }
}

