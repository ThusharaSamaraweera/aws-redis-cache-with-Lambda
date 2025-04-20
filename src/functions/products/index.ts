import { AWS } from '@serverless/typescript';

export const productsFunctions: AWS['functions'] = {
  products: {
    handler: `src/functions/products/handler.main`,
    // Function-specific environment variables
    environment: {
      REDIS_ENDPOINT: '${ssm:/redis/endpoint}',
      REDIS_PASSWORD: '${ssm:/redis/password}'
    },
    events: [
      {
        http: {
          method: 'get',
          path: 'products',
        },
      },
    ],
  }
};
