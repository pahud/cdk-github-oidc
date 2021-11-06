[![npm version](https://badge.fury.io/js/@pahud%2Fcdk-github-oidc.svg)](https://badge.fury.io/js/@pahud%2Fcdk-github-oidc)
[![PyPI version](https://badge.fury.io/py/pahud-cdk-github-oidc.svg)](https://badge.fury.io/py/pahud-cdk-github-oidc)
[![release](https://github.com/pahud/cdk-github-oidc/actions/workflows/release.yml/badge.svg)](https://github.com/pahud/cdk-github-oidc/actions/workflows/release.yml)

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)


# cdk-github-oidc

Inspired by [aripalo/aws-cdk-github-oidc](https://github.com/aripalo/aws-cdk-github-oidc), this construct library allows you to create a `Github OpenID Connect Identity Provider` trust relationship with the `Provider` construct as well as federated IAM roles for one or multiple Github repositories.

This construct is still in `experimental` stage and may have breaking changes. However, we aim to make this library as simple as possible.

## Sample

```ts
import { Provider } from '@pahud/cdk-github-oidc';

// create a new provider
const provider = new Provider(stack, 'GithubOpenIdConnectProvider')
// create an IAM role from this provider
provider.createRole('demo-role', 
  // sharing this role across multiple repositories
  [
    { owner: 'octo-org', repo: 'first-repo' },
    { owner: 'octo-org', repo: 'second-repo' },
    { owner: 'octo-org', repo: 'third-repo' },
  ]
)
```

## Import the provider

Each AWS account can only have one GitHub OIDC identity provider. To import the existing one, use `Provider.fromAccount()`:

```ts
// import the provider
const provider = Provider.fromAccount(stack, 'GithubOpenIdConnectProvider')
// create a iam role from the imported provider
provider.createRole(...)
```


## Workflow sample

```yaml
name: demo
on:
  workflow_dispatch: {}
jobs:
  deploy:
    name: Upload to Amazon S3
    runs-on: ubuntu-latest
    env:
      AWS_REGION: us-east-1
    permissions:
      id-token: write # needed to interact with GitHub's OIDC Token endpoint.
      contents: read
    steps:
    - name: Checkout
      uses: actions/checkout@v2

    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@master
      with:
        role-to-assume: ${{ secrets.AWS_ROLE_ARN_TO_ASSUME }}
        aws-region: ${{ env.AWS_REGION }}

    - name: Sync files to S3
      run: |
        aws s3 sync ./ s3://${{ secrets.AWS_BUCKET }}
  ```

## Projects using this library
- [pahud/gitpod-workspace](https://github.com/pahud/gitpod-workspace)
- [pahud/github-codespace](https://github.com/pahud/github-codespace)
- [pahud/vscode](https://github.com/pahud/vscode)

## Reference
- [Configuring OpenID Connect in Amazon Web Services](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services) from GitHub Docs
- [aripalo/aws-cdk-github-oidc](https://github.com/aripalo/aws-cdk-github-oidc) by [Ari Palo](https://github.com/aripalo)
