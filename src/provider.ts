import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';

/**
 * Represents a GitHub repository
 */
export interface RepositoryConfig {
  /**
   * The owner of the repository.
   */
  readonly owner: string;
  /**
   * The name of the repository.
   */
  readonly repo: string;
  /**
   * The sub prefix string from the JWT token used to be validated by AWS. Appended after `repo:${owner}/${repo}:`
   * in an IAM role trust relationship. The default value '*' indicates all branches and all tags from this repo.
   *
   * Example:
   * repo:octo-org/octo-repo:ref:refs/heads/demo-branch - only allowed from `demo-branch`
   * repo:octo-org/octo-repo:ref:refs/tags/demo-tag - only allowed from `demo-tag`.
   * repo:octo-org/octo-repo:pull_request - only allowed from the `pull_request` event.
   * repo:octo-org/octo-repo:environment:Production - only allowd from `Production` environment name.
   *
   * @default '*'
   * @see https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect#configuring-the-oidc-trust-with-the-cloud
   */
  readonly filter?: string;
}

/**
 * The Github OpenID Connect Provider
 */
export class Provider extends cdk.Construct {
  /**
   * The issuer of the OIDC provider claim or the "provider URL".
   * @see https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services#adding-the-identity-provider-to-aws
   */
  public static readonly issuer: string = 'token.actions.githubusercontent.com';
  /**
   * The thumbprint of the OIDC provider claim.
   * @see https://github.com/aws-actions/configure-aws-credentials
   */
  public static readonly thumbprint: string = 'a031c46782e6e6c662c2c87c76da9aa62ccabd8e';
  readonly provider: iam.IOpenIdConnectProvider;
  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    this.provider = new iam.OpenIdConnectProvider(this, 'Provider', {
      url: `https://${Provider.issuer}`,
      clientIds: ['sts.amazonaws.com'],
      thumbprints: [`${Provider.thumbprint}`],
    });
  }
  /**
   *
   * @param repo a list of repositories
   * @returns a list of subjects
   */
  private formatSubject(repo: RepositoryConfig[]): string[] {
    return repo.map(r => `repo:${r.owner}/${r.repo}:${r.filter ?? '*'}`);
  }
  /**
   * Create an IAM role for the provider
   * @param id
   * @param repo a list of repositories using this role
   * @param roleProps properties to create this role
   * @returns an IAM role
   */
  public createRole(id: string, repo: RepositoryConfig[], roleProps?: iam.RoleProps):iam.Role {
    if (repo.length == 0) {
      throw new Error('Error - at least one repository is required');
    }
    const role = new iam.Role(this, id, {
      ...roleProps,
      assumedBy: new iam.OpenIdConnectPrincipal(this.provider, {
        StringLike: {
          [`${Provider.issuer}:sub`]: this.formatSubject(repo),
        },
      }),
    });

    return role;
  }
}