const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-east-1' })

const ses = new AWS.SES()
const util = require('./util.js')
const nodemailer = require('nodemailer')

exports.handler = async (event, context) => {
  const { 
    senderEmail, 
    senderName, 
    message, 
    base64Data, 
    date } = JSON.parse(event.body)
  console.log(base64Data)

  const base64RemoveDataURI = base64Data.replace(
    'data:application/pdf;base64', ''
  )

 

  try {
    const transporter = nodemailer.createTransport({SES: ses})

    const emailProps = await transporter.sendMail({
      from: senderName,
      to: senderEmail,
      subject: date,
      text: message,
      html: '<div>' + message + '</div>',
      attachments: [{
        filename: 'TEST_FILE_NAME.pdf',
        content: base64RemoveDataURI,
        encoding: 'base64'
      }]
    })
    return {
      statusCode: 200,
      headers: util.getResponseHeaders(),
      body: JSON.stringify(emailProps)
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
