const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-east-1' })
const S3 = AWS.S3

const csv = require('csv-parser')

const util = require('../util.js')
const BUCKET_NAME = process.env.BUCKET_NAME

module.exports = async(event) => {
  try {
    const s3 = new S3({ region: process.env.REGION })
    const promises = event.Records.map(record => {
      return new Promise((resolve, reject) => {
        const keyName = decodeURIComponent(record.s3.object.key)
        console.log(keyName)
        
        const params = {
          Bucket: BUCKET_NAME,
          // Key: record.s3.object.key
          Key: keyName
        }

        const results = []

        s3.getObject(params)
          .createReadStream()
          .pipe(csv())
          .on('data', (data) => {
            results.push(data)
          })
          .on('error', (error) => {
            reject(error)
          })
          .on('end', () => {
            resolve(results)
          })

      })
    })

    const resolvedResults = await Promise.all(promises)
    console.log(resolvedResults)

    for (const record of event.Records) {
      await s3.copyObject({
        Bucket: BUCKET_NAME,
        CopySource: `${BUCKET_NAME}/${record.s3.object.key}`,
        Key: record.s3.object.key.replace('uploaded', 'parsed')
      }).promise();
  
      await s3.deleteObject({
        Bucket: BUCKET_NAME,
        Key: record.s3.object.key
      }).promise();
    }

    return {
      statusCode: 200,
      headers: util.getResponseHeaders(),
      body: JSON.stringify({response: 'success'})
    }
  } catch (err) {
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