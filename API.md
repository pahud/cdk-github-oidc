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

- *Type:* [`constructs.Construct`](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="@pahud/cdk-github-oidc.Provider.parameter.id"></a>

- *Type:* `string`

---


#### Static Functions <a name="Static Functions"></a>

##### `fromAccount` <a name="@pahud/cdk-github-oidc.Provider.fromAccount"></a>

```typescript
import { Provider } from '@pahud/cdk-github-oidc'

Provider.fromAccount(scope: Construct, id: string)
```

###### `scope`<sup>Required</sup> <a name="@pahud/cdk-github-oidc.Provider.parameter.scope"></a>

- *Type:* [`constructs.Construct`](#constructs.Construct)

---

###### `id`<sup>Required</sup> <a name="@pahud/cdk-github-oidc.Provider.parameter.id"></a>

- *Type:* `string`

---

#### Properties <a name="Properties"></a>

##### `issuer`<sup>Required</sup> <a name="@pahud/cdk-github-oidc.Provider.property.issuer"></a>

```typescript
public readonly issuer: string;
```

- *Type:* `string`

---

##### `openIdConnectProvider`<sup>Required</sup> <a name="@pahud/cdk-github-oidc.Provider.property.openIdConnectProvider"></a>

```typescript
public readonly openIdConnectProvider: IOpenIdConnectProvider;
```

- *Type:* [`aws-cdk-lib.aws_iam.IOpenIdConnectProvider`](#aws-cdk-lib.aws_iam.IOpenIdConnectProvider)

---


### ProviderBase <a name="@pahud/cdk-github-oidc.ProviderBase"></a>

#### Initializers <a name="@pahud/cdk-github-oidc.ProviderBase.Initializer"></a>

```typescript
import { ProviderBase } from '@pahud/cdk-github-oidc'

new ProviderBase(scope: Construct, id: string, props?: ResourceProps)
```

##### `scope`<sup>Required</sup> <a name="@pahud/cdk-github-oidc.ProviderBase.parameter.scope"></a>

- *Type:* [`constructs.Construct`](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="@pahud/cdk-github-oidc.ProviderBase.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Optional</sup> <a name="@pahud/cdk-github-oidc.ProviderBase.parameter.props"></a>

- *Type:* [`aws-cdk-lib.ResourceProps`](#aws-cdk-lib.ResourceProps)

---

#### Methods <a name="Methods"></a>

##### `createRole` <a name="@pahud/cdk-github-oidc.ProviderBase.createRole"></a>

```typescript
public createRole(id: string, repo: RepositoryConfig[], roleProps?: RoleProps)
```

###### `id`<sup>Required</sup> <a name="@pahud/cdk-github-oidc.ProviderBase.parameter.id"></a>

- *Type:* `string`

---

###### `repo`<sup>Required</sup> <a name="@pahud/cdk-github-oidc.ProviderBase.parameter.repo"></a>

- *Type:* [`@pahud/cdk-github-oidc.RepositoryConfig`](#@pahud/cdk-github-oidc.RepositoryConfig)[]

---

###### `roleProps`<sup>Optional</sup> <a name="@pahud/cdk-github-oidc.ProviderBase.parameter.roleProps"></a>

- *Type:* [`aws-cdk-lib.aws_iam.RoleProps`](#aws-cdk-lib.aws_iam.RoleProps)

---


#### Properties <a name="Properties"></a>

##### `openIdConnectProvider`<sup>Required</sup> <a name="@pahud/cdk-github-oidc.ProviderBase.property.openIdConnectProvider"></a>

```typescript
public readonly openIdConnectProvider: IOpenIdConnectProvider;
```

- *Type:* [`aws-cdk-lib.aws_iam.IOpenIdConnectProvider`](#aws-cdk-lib.aws_iam.IOpenIdConnectProvider)

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



