import { APIGatewayProxyEvent } from 'aws-lambda';
import { apiResponse } from '../../lib/apiResponse';
import { middyfy } from '../../lib/middyWrapper';

export const hello = async (event: APIGatewayProxyEvent) => {
  try {
  
    return apiResponse._200({
      message: 'Hello Worlds'
    })
  } catch (error) {
    console.error(error);
    return apiResponse._500(error as Error)
  }
};

export const main = middyfy(hello);
