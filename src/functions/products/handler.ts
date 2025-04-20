import { APIGatewayProxyEvent } from "aws-lambda";
import { apiResponse } from "../../lib/apiResponse";
import { middyfy } from "../../lib/middyWrapper";
import { getCache, setCache } from "../../common/redis";

const dummyGetProductsDB = async () => {
  console.log("Getting products from database");
  return [
    {
      id: 1,
      name: "Product 1",
      price: 100,
    },
    {
      id: 2,
      name: "Product 2",
      price: 200,
    },
  ];
};

export const getProducts = async (event: APIGatewayProxyEvent) => {
  try {
    // Get products from cache first
    const cachedProducts = await getCache("products", "DEFAULT_FIELD");

    // If products are found in cache, return them
    if (cachedProducts) {
      console.log("Products found in cache");
      return apiResponse._200({
        products: cachedProducts,
      });
    }

    console.log("Products not found in cache");

    // If cache is empty, get products from database
    const products = await dummyGetProductsDB();
    // Set products in cache 
    await setCache("products", "DEFAULT_FIELD", JSON.stringify(products), 3600);

    return apiResponse._200({
      products,
    });
  } catch (error) {
    console.error(error);
    return apiResponse._500(error as Error);
  }
};

export const main = middyfy(getProducts);
