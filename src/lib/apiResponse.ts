export const apiResponse = {
  //Success response
  _200: (body: { [key: string]: any }) => {
    const data = { data: body };
    return {
      statusCode: 200,
      body: JSON.stringify(data, null, 2),
    };
  },
  _500: (err: Error) => {
    const body = {
      errorMessage: err.message,
      error: err.name,
    };
    return {
      statusCode: 500,
      body: JSON.stringify(body, null, 2),
    };
  },
};
