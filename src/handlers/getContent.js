import AWS from 'aws-sdk'
import middy from '@middy/core'
import httpJsonBodyParser from '@middy/http-json-body-parser'
import httpEventNomalizer from '@middy/http-event-normalizer'
import httpErrorHandler from '@middy/http-error-handler'
import createError from 'http-errors'

const dynamodb = new AWS.DynamoDB.DocumentClient()

export async function getContentById(id) {
  let content

  try {
    const result = await dynamodb
      .get({
        TableName: process.env.BOARD_TABLE_NAME,
        Key: { id }
      })
      .promise()

    content = result.Item
  } catch (error) {
    console.error(error)
    throw new createError.InternalServerError(error)
  }

  if (!content) {
    throw new createError.NotFound(`Content with ID "${id}" not found!`)
  }

  return content
}

async function getContent(event, context) {
  const { id } = event.pathParameters
  const content = await getContentById(id)

  return {
    statusCode: 200,
    body: JSON.stringify(content)
  }
}

export const handler = middy(getContent).use(httpJsonBodyParser()).use(httpEventNomalizer()).use(httpErrorHandler())
