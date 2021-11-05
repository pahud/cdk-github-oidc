import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';

export interface RepositoryConfig {
  readonly owner: string;
  readonly repo: string;
  readonly filter?: string;
}

export class OpenIdConnectProvider extends cdk.Construct {
  public static readonly issuer: string = 'token.actions.githubusercontent.com';
  public static readonly thumbprint: string = 'a031c46782e6e6c662c2c87c76da9aa62ccabd8e';
  readonly provider: iam.IOpenIdConnectProvider;
  constructor(scope: cdk.Construct, id: string) {
    super(scope, id)

    this.provider = new iam.OpenIdConnectProvider(this, 'Provider', {
      url: `https://${OpenIdConnectProvider.issuer}`,
      clientIds: ['sts.amazonaws.com'],
      thumbprints: [`${OpenIdConnectProvider.thumbprint}`], 
    })
  }
  private formatSubject(repo: RepositoryConfig[]): string[] {
    return repo.map(r => `repo:${r.owner}/${r.repo}:${r.filter ?? '*'}`)
  }
  public createRole(id: string, repo: RepositoryConfig[], roleProps?: iam.RoleProps):iam.Role {
    const role = new iam.Role(this, id, {
      ...roleProps,
      assumedBy: new iam.WebIdentityPrincipal(this.provider.openIdConnectProviderArn, {
        StringEquals: {
          // Audience is always sts.amazonaws.com with AWS official Github Action
          // https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services#adding-the-identity-provider-to-aws
          [`${OpenIdConnectProvider.issuer}:aud`]: 'sts.amazonaws.com',
        },
        StringLike: {
          [`${OpenIdConnectProvider.issuer}:sub`]: this.formatSubject(repo),
        }
      })
    })

    return role
  }
}