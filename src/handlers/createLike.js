import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';

// 함수가 실행될 때마다 새로 client를 생성할 필요가 없기 때문에 글로벌 변수로 생성
const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createLike(event, context) {
  const { title, type } = JSON.parse(event.body);
  const now = new Date();

  const like = {
    id: uuid(),
    title,
    type,
    createdAt: now.toISOString(), //ISO 타입이 데이터베이스에 날짜 넣는 기본 형식
  };

  await dynamodb.put({
    TableName: process.env.LIKES_TABLE_NAME,
    Item: like,
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify(like)
  }
}

export const handler = createLike;