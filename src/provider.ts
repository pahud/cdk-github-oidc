import {
  Resource, Stack,
  aws_iam as iam,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

const DEFAULTS: { [key: string]: string } = {
  issuer: 'token.actions.githubusercontent.com',
  thumbprint: 'a031c46782e6e6c662c2c87c76da9aa62ccabd8e',
};

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

export abstract class ProviderBase extends Resource {
  public abstract readonly openIdConnectProvider: iam.IOpenIdConnectProvider;
  /**
   *
   * @param repo a list of repositories
   * @returns a list of subjects
   */
  private formatSubject(repo: RepositoryConfig[]): string[] {
    return repo.map(r => `repo:${r.owner}/${r.repo}:${r.filter ?? '*'}`);
  }
  public createRole(id: string, repo: RepositoryConfig[], roleProps?: iam.RoleProps):iam.Role {
    if (repo.length == 0) {
      throw new Error('Error - at least one repository is required');
    }
    const role = new iam.Role(this, id, {
      ...roleProps,
      assumedBy: new iam.OpenIdConnectPrincipal(this.openIdConnectProvider, {
        StringLike: {
          [`${DEFAULTS.issuer}:sub`]: this.formatSubject(repo),
        },
      }),
    });
    return role;
  }
}

/**
 * The Github OpenID Connect Provider
 */
export class Provider extends ProviderBase {
  /**
   * import the existing provider
   */
  public static fromAccount(scope: Construct, id: string): ProviderBase {
    class Import extends ProviderBase {
      public readonly openIdConnectProvider: iam.IOpenIdConnectProvider;
      constructor(s: Construct, i: string) {
        super(s, i);
        // arn:aws:iam::xxxxxxxxxxxx:oidc-provider/token.actions.githubusercontent.com
        const arn = Stack.of(scope).formatArn({
          resource: 'oidc-provider',
          service: 'iam',
          region: '',
          resourceName: DEFAULTS.issuer,
        });
        this.openIdConnectProvider = iam.OpenIdConnectProvider.fromOpenIdConnectProviderArn(scope, `Provider${id}`, arn);
      }
    }
    return new Import(scope, id);
  }
  public readonly issuer: string = DEFAULTS.issuer;
  public readonly openIdConnectProvider: iam.IOpenIdConnectProvider;
  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.openIdConnectProvider = new iam.OpenIdConnectProvider(this, `Provider${id}`, {
      url: `https://${DEFAULTS.issuer}`,
      clientIds: ['sts.amazonaws.com'],
      thumbprints: [`${DEFAULTS.thumbprint}`],
    });
  }
}