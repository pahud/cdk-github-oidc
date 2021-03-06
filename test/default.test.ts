import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Provider } from '../src';

let app: App;
let stack: Stack;

beforeEach(() => {
  app = new App();
  stack = new Stack(app, 'demo-stack');
});

test('create a default provider', () => {
  // GIVEN

  // WHEN
  new Provider(stack, 'Provider');
  // match snapshot
  const t = Template.fromStack(stack);
  expect(t).toMatchSnapshot();
  // we should have the provider
  t.hasResourceProperties('Custom::AWSCDKOpenIdConnectProvider', {
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

test('create iam role for single repository', () => {
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
              Ref: 'ProviderProviderProviderBCE1C93C',
            },
          },
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('create iam role for single repository specific branch', () => {
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
              Ref: 'ProviderProviderProviderBCE1C93C',
            },
          },
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('create iam role for single repository specific tag', () => {
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
              Ref: 'ProviderProviderProviderBCE1C93C',
            },
          },
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('create iam role for multiple repositories', () => {
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
              Ref: 'ProviderProviderProviderBCE1C93C',
            },
          },
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('create an iam role from the imported provider', () => {
  // GIVEN
  const provider = Provider.fromAccount(stack, 'Provider');
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
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':iam::',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':oidc-provider/token.actions.githubusercontent.com',
                ],
              ],
            },
          },
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('throw with empty repo', () => {
  // GIVEN
  const provider = new Provider(stack, 'Provider');
  // WHEN
  // we should throw an error
  expect(() => {
    provider.createRole('gh-oidc-role',
      [
      // empty repo
      ],
    );
  }).toThrow(/Error - at least one repository is required/);
});