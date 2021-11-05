# cdk-github-oidc

Inspired by [aripalo/aws-cdk-github-oidc](https://github.com/aripalo/aws-cdk-github-oidc), this repository allows you to create a `Github OpenID Connect Identity Provider` with the `OpenIdConnectProvider` CDK construct and generate federated IAM roles from this provider used in one or multiple Github repositories.

# Sample

```ts
import { OpenIdConnectProvider } from 'cdk-github-oidc';

// create the provider
const provider = new OpenIdConnectProvider(stack, 'GithubOpenIdConnectProvider')
// create an IAM role from this provider
provider.createRole('demo-role', 
  // sharing this role across multiple repositories
  [
    { owner: 'pahud', repo: 'gitpod-workspace' },
    { owner: 'pahud', repo: 'github-codespace' },
    { owner: 'pahud', repo: 'vscode' },
  ]
)
```