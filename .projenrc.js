const { awscdk, JsonFile, DevEnvironmentDockerImage, Gitpod } = require('projen');
const { NpmAccess } = require('projen/lib/javascript');

const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Pahud Hsieh',
  authorAddress: 'pahudnet@gmail.com',
  cdkVersion: '2.0.0',
  description: 'CDK construct library for Github OpenID Connect Identity Provider',
  defaultReleaseBranch: 'main',
  name: '@pahud/cdk-github-oidc',
  repositoryUrl: 'https://github.com/pahud/cdk-github-oidc.git',
  devDeps: [
    'ts-node',
    'aws-cdk',
  ],
  depsUpgradeOptions: {
    ignoreProjen: false,
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
    },
  },
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
    allowedUsernames: ['pahud'],
  },
  npmAccess: NpmAccess.PUBLIC,
  publishToPypi: {
    distName: 'pahud-cdk-github-oidc',
    module: 'pahud_cdk_github_oidc',
  },
  keywords: ['cdk', 'github', 'actions', 'oidc'],
});

new JsonFile(project, 'cdk.json', {
  obj: {
    app: 'npx ts-node --prefer-ts-exts src/integ.default.ts',
  },
});

project.package.addField('resolutions', {
  'ansi-regex': '^5.0.1',
});


const gitpodPrebuild = project.addTask('gitpod:prebuild', {
  description: 'Prebuild setup for Gitpod',
});
// install and compile only, do not test or package.
gitpodPrebuild.exec('yarn install --frozen-lockfile --check-files');
gitpodPrebuild.exec('npx projen compile');

let gitpod = new Gitpod(project, {
  dockerImage: DevEnvironmentDockerImage.fromImage('public.ecr.aws/pahudnet/gitpod-workspace:latest'),
  prebuilds: {
    addCheck: true,
    addBadge: true,
    addLabel: true,
    branches: true,
    pullRequests: true,
    pullRequestsFromForks: true,
  },
});

gitpod.addCustomTask({
  init: 'yarn gitpod:prebuild',
  // always upgrade after init
  command: 'npx projen upgrade',
});

gitpod.addVscodeExtensions(
  'dbaeumer.vscode-eslint',
  'ms-azuretools.vscode-docker',
  'AmazonWebServices.aws-toolkit-vscode',
);

const common_exclude = ['cdk.out', 'cdk.context.json', 'yarn-error.log', 'dependabot.yml'];
project.npmignore.exclude(...common_exclude, 'images', 'docs', 'website');
project.gitignore.exclude(...common_exclude);

project.synth();