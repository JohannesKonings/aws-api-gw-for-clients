import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const dynamoDb = new DynamoDB.DocumentClient();

exports.handler = async (event: any) => {
  const person = {
    id: uuidv4(),
    name: generateRandomName(),
    age: generateRandomAge(),
    email: generateRandomEmail()
  };

  const params = {
    TableName: process.env.PERSONS_TABLE,
    Item: person
  };

  try {
    await dynamoDb.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(person)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not create person' })
    };
  }
};

function generateRandomName() {
  const names = ['John', 'Jane', 'Alice', 'Bob'];
  return names[Math.floor(Math.random() * names.length)];
}

function generateRandomAge() {
  return Math.floor(Math.random() * 60) + 18;
}

function generateRandomEmail() {
  const domains = ['example.com', 'test.com', 'demo.com'];
  return `${generateRandomName().toLowerCase()}@${domains[Math.floor(Math.random() * domains.length)]}`;
}
