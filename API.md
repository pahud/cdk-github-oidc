# API Reference <a name="API Reference"></a>

## Constructs <a name="Constructs"></a>

### Provider <a name="@pahud/cdk-github-oidc.Provider"></a>

The Github OpenID Connect Provider.

#### Initializers <a name="@pahud/cdk-github-oidc.Provider.Initializer"></a>

```typescript
import { Provider } from '@pahud/cdk-github-oidc'

new Provider(scope: Construct, id: string)
```

##### `scope`<sup>Required</sup> <a name="@pahud/cdk-github-oidc.Provider.parameter.scope"></a>

- *Type:* [`@aws-cdk/core.Construct`](#@aws-cdk/core.Construct)

---

##### `id`<sup>Required</sup> <a name="@pahud/cdk-github-oidc.Provider.parameter.id"></a>

- *Type:* `string`

---

#### Methods <a name="Methods"></a>

##### `createRole` <a name="@pahud/cdk-github-oidc.Provider.createRole"></a>

```typescript
public createRole(id: string, repo: RepositoryConfig[], roleProps?: RoleProps)
```

###### `id`<sup>Required</sup> <a name="@pahud/cdk-github-oidc.Provider.parameter.id"></a>

- *Type:* `string`

---

###### `repo`<sup>Required</sup> <a name="@pahud/cdk-github-oidc.Provider.parameter.repo"></a>

- *Type:* [`@pahud/cdk-github-oidc.RepositoryConfig`](#@pahud/cdk-github-oidc.RepositoryConfig)[]

a list of repositories using this role.

---

###### `roleProps`<sup>Optional</sup> <a name="@pahud/cdk-github-oidc.Provider.parameter.roleProps"></a>

- *Type:* [`@aws-cdk/aws-iam.RoleProps`](#@aws-cdk/aws-iam.RoleProps)

properties to create this role.

---


#### Properties <a name="Properties"></a>

##### `provider`<sup>Required</sup> <a name="@pahud/cdk-github-oidc.Provider.property.provider"></a>

```typescript
public readonly provider: IOpenIdConnectProvider;
```

- *Type:* [`@aws-cdk/aws-iam.IOpenIdConnectProvider`](#@aws-cdk/aws-iam.IOpenIdConnectProvider)

---

#### Constants <a name="Constants"></a>

##### `issuer` <a name="@pahud/cdk-github-oidc.Provider.property.issuer"></a>

- *Type:* `string`

The issuer of the OIDC provider claim or the "provider URL".

> https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services#adding-the-identity-provider-to-aws

---

##### `thumbprint` <a name="@pahud/cdk-github-oidc.Provider.property.thumbprint"></a>

- *Type:* `string`

The thumbprint of the OIDC provider claim.

> https://github.com/aws-actions/configure-aws-credentials

---

## Structs <a name="Structs"></a>

### RepositoryConfig <a name="@pahud/cdk-github-oidc.RepositoryConfig"></a>

Represents a GitHub repository.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { RepositoryConfig } from '@pahud/cdk-github-oidc'

const repositoryConfig: RepositoryConfig = { ... }
```

##### `owner`<sup>Required</sup> <a name="@pahud/cdk-github-oidc.RepositoryConfig.property.owner"></a>

```typescript
public readonly owner: string;
```

- *Type:* `string`

The owner of the repository.

---

##### `repo`<sup>Required</sup> <a name="@pahud/cdk-github-oidc.RepositoryConfig.property.repo"></a>

```typescript
public readonly repo: string;
```

- *Type:* `string`

The name of the repository.

---

##### `filter`<sup>Optional</sup> <a name="@pahud/cdk-github-oidc.RepositoryConfig.property.filter"></a>

```typescript
public readonly filter: string;
```

- *Type:* `string`
- *Default:* '*'

The sub prefix string from the JWT token used to be validated by AWS.

Appended after `repo:${owner}/${repo}:`
in an IAM role trust relationship. The default value '*' indicates all branches and all tags from this repo.

Example:
repo:octo-org/octo-repo:ref:refs/heads/demo-branch - only allowed from `demo-branch`
repo:octo-org/octo-repo:ref:refs/tags/demo-tag - only allowed from `demo-tag`.
repo:octo-org/octo-repo:pull_request - only allowed from the `pull_request` event.
repo:octo-org/octo-repo:environment:Production - only allowd from `Production` environment name.

> https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect#configuring-the-oidc-trust-with-the-cloud

---



