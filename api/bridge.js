const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-east-1' })
const sqs = new AWS.SQS();

exports.handler = async (event) => {
  console.log('bridge: ', event)

  const checkoutPayload = event.detail
  await sqs.sendMessage({
    QueueUrl: `https://sqs.us-east-1.amazonaws.com/656113873765/sls-order-land-dev-jobs`,
    // QueueUrl: process.env.QUEUE_URL, //prod
    MessageBody: JSON.stringify(checkoutPayload),
    MessageAttributes: {
      AttributeName: {
        StringValue: "Attribute Value",
        DataType: "String",
      },
    },
  }).promise()
  return 'response from bridge'
}