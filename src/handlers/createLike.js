async function createLike(event, context) {
  const { title, type } = JSON.parse(event.body);
  const now = new Date();

  const like = {
    title,
    type,
    createdAt: now.toISOString(), //ISO 타입이 데이터베이스에 날짜 넣는 기본 형식
  };

  return {
    statusCode: 201,
    body: JSON.stringify(like)
  }
}

export const handler = createLike;