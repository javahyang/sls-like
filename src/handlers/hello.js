async function hello(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'first hello! '}),
  };
}

export const handler = hello; // handler 변수명으로 내보내서 serverless.yml 파일에서 hello.handler 로 부름