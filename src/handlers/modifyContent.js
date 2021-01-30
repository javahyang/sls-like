import AWS from 'aws-sdk'
import commonMiddleware from '../lib/commonMiddleware'
import createError from 'http-errors'

const dynamodb = new AWS.DynamoDB.DocumentClient()

async function modifyContent(event, context) {
  const { id } = event.pathParameters
  const { body } = event.body // commonMiddleware 로 JSON parse 된 상태

  const params = {
    TableName: process.env.BOARD_TABLE_NAME,
    Key: { id },
    UpdateExpression: 'set body = :body', // string 형식. DynamoDB가 지원하는 expression 언어를 이용.
    ExpressionAttributeValues: {
      // expression value(:을 사용한) 값 정의
      ':body': body
    },
    ReturnValues: 'ALL_NEW' // update한 값 전부를 리턴
  }

  let updatedContent

  try {
    // DynamoDB 실행. IAM 롤에 updateItem 추가
    const result = await dynamodb.update(params).promise() // result 는 Attributes 반환
    updatedContent = result.Attributes // content의 업데이트된 모든 Attributes 를 받는다
  } catch (error) {
    console.error(error)
    throw new createError.InternalServerError(error)
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedContent)
  }
}

export const handler = commonMiddleware(modifyContent)
