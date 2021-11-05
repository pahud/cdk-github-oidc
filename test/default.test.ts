import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import { OpenIdConnectProvider } from '../src';

let app: cdk.App;
let stack: cdk.Stack;

beforeEach(() => {
  app = new cdk.App();
  stack = new cdk.Stack(app, 'demo-stack');
});

test('create a default provider)', () => {
  // GIVEN
  // WHEN
  new OpenIdConnectProvider(stack, 'Provider');
  // we should have the provider
  Template.fromStack(stack).hasResourceProperties('Custom::AWSCDKOpenIdConnectProvider', {
    ServiceToken: {
      'Fn::GetAtt': [
        'CustomAWSCDKOpenIdConnectProviderCustomResourceProviderHandlerF2C543E0',
        'Arn',
      ],
    },
    ClientIDList: [
      'sts.amazonaws.com',
    ],
    ThumbprintList: [
      'a031c46782e6e6c662c2c87c76da9aa62ccabd8e',
    ],
    Url: 'https://token.actions.githubusercontent.com',
  });
});

test('create iam role for multiple repositories)', () => {
  // GIVEN
  const provider = new OpenIdConnectProvider(stack, 'Provider');
  // WHEN
  provider.createRole('gh-oidc-role',
    [
      { owner: 'pahud', repo: 'first-repo' },
      { owner: 'pahud', repo: 'second-repo' },
      { owner: 'pahud', repo: 'third-repo' },
    ],
  );
  // we should have a correct IAM role
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [
        {
          Action: 'sts:AssumeRoleWithWebIdentity',
          Condition: {
            StringEquals: {
              'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
            },
            StringLike: {
              'token.actions.githubusercontent.com:sub': [
                'repo:pahud/first-repo:*',
                'repo:pahud/second-repo:*',
                'repo:pahud/third-repo:*',
              ],
            },
          },
          Effect: 'Allow',
          Principal: {
            Federated: {
              Ref: 'ProviderE1D0E886',
            },
          },
        },
      ],
      Version: '2012-10-17',
    },
  });
});