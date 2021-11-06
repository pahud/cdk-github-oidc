import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import { Provider } from '../src';

let app: cdk.App;
let stack: cdk.Stack;

beforeEach(() => {
  app = new cdk.App();
  stack = new cdk.Stack(app, 'demo-stack');
});

test('create a default provider)', () => {
  // GIVEN
  // WHEN
  new Provider(stack, 'Provider');
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

test('create iam role for single repository)', () => {
  // GIVEN
  const provider = new Provider(stack, 'Provider');
  // WHEN
  provider.createRole('gh-oidc-role',
    [
      { owner: 'octo-org', repo: 'repo' },
    ],
  );
  // we should have a correct IAM role
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [
        {
          Action: 'sts:AssumeRoleWithWebIdentity',
          Condition: {
            StringLike: {
              'token.actions.githubusercontent.com:sub': [
                'repo:octo-org/repo:*',
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

test('create iam role for single repository specific branch)', () => {
  // GIVEN
  const provider = new Provider(stack, 'Provider');
  // WHEN
  provider.createRole('gh-oidc-role',
    [
      { owner: 'octo-org', repo: 'repo', filter: 'ref:refs/heads/demo-branch' },
    ],
  );
  // we should have a correct IAM role and `StringLike` condition.
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [
        {
          Action: 'sts:AssumeRoleWithWebIdentity',
          Condition: {
            StringLike: {
              'token.actions.githubusercontent.com:sub': [
                'repo:octo-org/repo:ref:refs/heads/demo-branch',
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

test('create iam role for single repository specific tag)', () => {
  // GIVEN
  const provider = new Provider(stack, 'Provider');
  // WHEN
  provider.createRole('gh-oidc-role',
    [
      { owner: 'octo-org', repo: 'repo', filter: 'ref:refs/tags/demo-tag' },
    ],
  );
  // we should have a correct IAM role and `StringLike` condition.
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [
        {
          Action: 'sts:AssumeRoleWithWebIdentity',
          Condition: {
            StringLike: {
              'token.actions.githubusercontent.com:sub': [
                'repo:octo-org/repo:ref:refs/tags/demo-tag',
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

test('create iam role for multiple repositories)', () => {
  // GIVEN
  const provider = new Provider(stack, 'Provider');
  // WHEN
  provider.createRole('gh-oidc-role',
    [
      { owner: 'octo-org', repo: 'first-repo' },
      { owner: 'octo-org', repo: 'second-repo' },
      { owner: 'octo-org', repo: 'third-repo' },
    ],
  );
  // we should have a correct IAM role
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [
        {
          Action: 'sts:AssumeRoleWithWebIdentity',
          Condition: {
            StringLike: {
              'token.actions.githubusercontent.com:sub': [
                'repo:octo-org/first-repo:*',
                'repo:octo-org/second-repo:*',
                'repo:octo-org/third-repo:*',
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