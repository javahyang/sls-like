async function createLike(event, context) {
  // context : meta 정보 등. user_id 등을 담기도 한다.
  // custom 데이터는 event, context 모두에 담을 수 있다

  return {
    statusCode: 200,
    body: JSON.stringify({ event, context }) // 람다에서는 반드시 JSON.stringify 버전으로 보내야한다. 아니면 에러!
  }
}

export const handler = createLike;