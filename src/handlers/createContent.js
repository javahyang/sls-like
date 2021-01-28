import { v4 as uuid } from 'uuid'
import AWS from 'aws-sdk'
import middy from '@middy/core'
import httpJsonBodyParser from '@middy/http-json-body-parser'
import httpEventNomalizer from '@middy/http-event-normalizer'
import httpErrorHandler from '@middy/http-error-handler'
import createError from 'http-errors'

const dynamodb = new AWS.DynamoDB.DocumentClient()

async function createContent(event, context) {
  const { body } = event.body
  const now = new Date()

  const content = {
    id: uuid(),
    body,
    createdAt: now.toISOString()
  }

  try {
    await dynamodb
      .put({
        TableName: process.env.BOARD_TABLE_NAME,
        Item: content
      })
      .promise()
  } catch (error) {
    console.error(error)
    throw new createError.InternalServerError(error)
  }

  return {
    statusCode: 201,
    body: JSON.stringify(content)
  }
}

export const handler = middy(createContent)
  .use(httpJsonBodyParser())
  .use(httpEventNomalizer())
  .use(httpErrorHandler())
