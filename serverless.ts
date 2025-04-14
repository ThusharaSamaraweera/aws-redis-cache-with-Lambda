import { helloFunctions } from './src/functions/hello';
import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: "aws-serverless-typescript-api",
  frameworkVersion: "3",
  plugins: ["serverless-dotenv-plugin", "serverless-plugin-typescript", "serverless-offline"],
  provider: {
    name: "aws",
    runtime: "nodejs18.x",
    region: "us-east-1",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    logs: {
      restApi: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
  },
  // import the function via paths
  functions: { ...helloFunctions },
  package: { individually: true },
  custom: {},
};

module.exports = serverlessConfiguration;
