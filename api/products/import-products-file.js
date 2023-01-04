const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-east-1' })

// import { PutObjectCommand } from "@aws-sdk/client-s3"
// import { s3Client } from '../libs/s3Client'
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
const { PutObjectCommand } = require('@aws-sdk/client-s3')
const { s3Client } = require('../libs/s3Client')
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")

const util = require('../util.js')
const BUCKET_NAME = process.env.BUCKET_NAME

module.exports = async (event) => {
  try {
    const name = event.queryStringParameters.name

    const BUCKET = BUCKET_NAME;
    const catalogPath = `uploaded/${name}`;

    const params = {
      Bucket: BUCKET,
      Key: catalogPath,
      ContentType: 'text/csv',
    }

    const command = new PutObjectCommand(params);
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
    return {
      statusCode: 200,
      headers: util.getResponseHeaders(),
      body: JSON.stringify({
        url: signedUrl
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