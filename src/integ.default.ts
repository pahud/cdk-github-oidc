import * as cdk from '@aws-cdk/core';
import { Provider } from './';

const app = new cdk.App();

const env = {
  region: process.env.CDK_DEFAULT_REGION,
  account: process.env.CDK_DEFAULT_ACCOUNT,
};

const stack = new cdk.Stack(app, 'demo-stack', { env });

const provider = new Provider(stack, 'GithubOpenIdConnectProvider');
const importedProvider = Provider.fromAccount(stack, 'ImportedGithubOpenIdConnectProvider');
provider.createRole('gh-oidc-role',
  [
    { owner: 'pahud', repo: 'gitpod-workspace' },
    { owner: 'pahud', repo: 'github-codespace' },
    { owner: 'pahud', repo: 'vscode' },
  ],
);
importedProvider.createRole('gh-oidc-role2',
  [
    { owner: 'pahud', repo: 'gitpod-workspace' },
    { owner: 'pahud', repo: 'github-codespace' },
    { owner: 'pahud', repo: 'vscode' },
  ],
);
importedProvider.createRole('gh-oidc-role3',
  [
    { owner: 'pahud', repo: 'gitpod-workspace' },
    { owner: 'pahud', repo: 'github-codespace' },
    { owner: 'pahud', repo: 'vscode' },
  ],
);