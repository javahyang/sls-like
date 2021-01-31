import { v4 as uuid } from 'uuid'
import AWS from 'aws-sdk'
import middy from '@middy/core'
import httpJsonBodyParser from '@middy/http-json-body-parser'
import httpEventNomalizer from '@middy/http-event-normalizer'
import httpErrorHandler from '@middy/http-error-handler'
import createError from 'http-errors'

// 함수가 실행될 때마다 새로 client를 생성할 필요가 없기 때문에 글로벌 변수로 생성
const dynamodb = new AWS.DynamoDB.DocumentClient()

async function createLike(event, context) {
  const { contentId } = event.body
  const now = new Date()

  const like = {
    id: uuid(),
    contentId,
    createdAt: now.toISOString() //ISO 타입이 데이터베이스에 날짜 넣는 기본 형식
  }

  try {
    await dynamodb
      .put({
        TableName: process.env.LIKES_TABLE_NAME,
        Item: like
      })
      .promise()
  } catch (error) {
    console.error(error)
    throw new createError.InternalServerError(error)
  }

  return {
    statusCode: 201,
    body: JSON.stringify(like)
  }
}

export const handler = middy(createLike) // middy 미들웨어를 사용하기 위해서 middy 로 감싸준다
  .use(httpJsonBodyParser()) // 미들웨어의 각 함수를 이용할 때는 반드시 () 를 붙여준다
  .use(httpEventNomalizer())
  .use(httpErrorHandler())
