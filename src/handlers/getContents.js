import AWS from 'aws-sdk'
import commonMiddleware from '../lib/commonMiddleware'
import createError from 'http-errors'

const dynamodb = new AWS.DynamoDB.DocumentClient()

async function getContents(event, context) {
  let contents

  try {
    const result = await dynamodb
      .scan({
        TableName: process.env.BOARD_TABLE_NAME
      })
      .promise()

    contents = result.Items
  } catch (error) {
    console.error(error)
    throw new createError.InternalServerError(error)
  }

  return {
    statusCode: 200,
    body: JSON.stringify(contents)
  }
}

export const handler = commonMiddleware(getContents)
