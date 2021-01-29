import { v4 as uuid } from 'uuid'
import AWS from 'aws-sdk'
import commonMiddleware from '../lib/commonMiddleware'
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

export const handler = commonMiddleware(createContent)
