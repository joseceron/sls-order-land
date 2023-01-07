const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-east-1' })

const { PutObjectCommand } = require('@aws-sdk/client-s3')
const { s3Client } = require('../libs/s3Client')
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")

const util = require('../util.js')
const BUCKET_NAME = process.env.BUCKET_NAME

module.exports = async (event) => {
  try {
    const name = event.queryStringParameters.name
    const BUCKET = BUCKET_NAME;
    let catalogPath = `uploaded/${name}`;
    let contentType = 'text/csv'
    let sourceUrl = null

    if(event.queryStringParameters.fileType && 
      event.queryStringParameters.fileType == 'image') {
      catalogPath = `images/${name}`;
      contentType = 'image/jpg'
      sourceUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${catalogPath}`
    } 

    const params = {
      Bucket: BUCKET,
      Key: catalogPath,
      ContentType: contentType,
    }

    const command = new PutObjectCommand(params);
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
    return {
      statusCode: 200,
      headers: util.getResponseHeaders(),
      body: JSON.stringify({
        url: signedUrl,
        sourceUrl
      })
    }
  } catch (err) {
    console.log('Error: ', err)
    return {
      statusCode: err.statusCode ? err.statusCode : 500,
      headers: util.getResponseHeaders(),
      body: JSON.stringify({
        error: err.name ? err.name : 'Exception',
        message: err.message ? err.message : 'Unknown Error'
      })
    }
  }
}