import {
  Stack, App,
} from 'aws-cdk-lib';
import { Provider } from './';

const app = new App();

const env = {
  region: process.env.CDK_DEFAULT_REGION,
  account: process.env.CDK_DEFAULT_ACCOUNT,
};

const stack = new Stack(app, 'demo-stack', { env });

const provider = new Provider(stack, 'GithubOpenIdConnectProvider');
provider.createRole('gh-oidc-role',
  [
    { owner: 'pahud', repo: 'gitpod-workspace' },
    { owner: 'pahud', repo: 'github-codespace' },
    { owner: 'pahud', repo: 'vscode' },
  ],
);