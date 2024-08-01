import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();

exports.handler = async (event: any) => {
  const params = {
    TableName: process.env.PERSONS_TABLE,
    Key: {
      id: event.pathParameters.id
    }
  };

  try {
    const result = await dynamoDb.get(params).promise();
    if (result.Item) {
      return {
        statusCode: 200,
        body: JSON.stringify(result.Item)
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Person not found' })
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not retrieve person' })
    };
  }
};
