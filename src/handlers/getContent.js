import AWS from 'aws-sdk'
import commonMiddleware from '../lib/commonMiddleware'
import createError from 'http-errors'

const dynamodb = new AWS.DynamoDB.DocumentClient()

export async function getContentById(id) {
  let content

  try {
    // get : HASH 키를 베이스로 동작. IAM 파일에 GetItem 허용
    const result = await dynamodb
      .get({
        TableName: process.env.BOARD_TABLE_NAME,
        Key: { id } // ES6 : key 와 valiable 이 같은 경우
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
  const { id } = event.pathParameters // object 로 key-value 값을 갖는다
  const content = await getContentById(id)

  return {
    statusCode: 200,
    body: JSON.stringify(content)
  }
}

export const handler = commonMiddleware(getContent)
