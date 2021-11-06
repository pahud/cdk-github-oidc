import * as cdk from '@aws-cdk/core';
import { Provider } from './';

const app = new cdk.App();

const env = {
  region: process.env.CDK_DEFAULT_REGION,
  account: process.env.CDK_DEFAULT_ACCOUNT,
};

const stack = new cdk.Stack(app, 'demo-stack', { env });

new Provider(stack, 'GithubOpenIdConnectProvider')
  .createRole('gh-oidc-role',
    [
    ],
  );