import { AWS } from '@serverless/typescript';

export const helloFunctions: AWS['functions'] = {
  hello: {
    handler: `src/functions/hello/handler.main`,
    events: [
      {
        http: {
          method: 'get',
          path: 'hello',
        },
      },
    ],
  }
};
