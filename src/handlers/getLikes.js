import AWS from 'aws-sdk'
import middy from '@middy/core'
import httpJsonBodyParser from '@middy/http-json-body-parser'
import httpEventNomalizer from '@middy/http-event-normalizer'
import httpErrorHandler from '@middy/http-error-handler'
import createError from 'http-errors'

const dynamodb = new AWS.DynamoDB.DocumentClient()

async function getLikes(event, context) {
  let likes;

  try {
    const result = await dynamodb.scan({
      TableName: process.env.LIKES_TABLE_NAME
    }).promise()

    likes = result.Items;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error)
  }

  return {
    statusCode: 200,
    body: JSON.stringify(likes)
  }
}

export const handler = middy(getLikes)
  .use(httpJsonBodyParser())
  .use(httpEventNomalizer())
  .use(httpErrorHandler())
