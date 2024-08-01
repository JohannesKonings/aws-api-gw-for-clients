import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigateway from '@aws-cdk/aws-apigateway';

export class ServerStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, 'PersonsTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    const generatePersonLambda = new lambda.Function(this, 'GeneratePersonLambda', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'generate-person.handler',
      code: lambda.Code.fromAsset('lambda')
    });

    const getPersonLambda = new lambda.Function(this, 'GetPersonLambda', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'get-person.handler',
      code: lambda.Code.fromAsset('lambda')
    });

    const api = new apigateway.RestApi(this, 'PersonsApi', {
      restApiName: 'Persons Service'
    });

    const generatePersonIntegration = new apigateway.LambdaIntegration(generatePersonLambda);
    api.root.addResource('generate').addMethod('POST', generatePersonIntegration);

    const getPersonIntegration = new apigateway.LambdaIntegration(getPersonLambda);
    api.root.addResource('person').addMethod('GET', getPersonIntegration);
  }
}
