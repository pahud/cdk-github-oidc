const { AwsCdkConstructLibrary } = require('projen');
const project = new AwsCdkConstructLibrary({
  author: 'Pahud Hsieh',
  authorAddress: 'pahudnet@gmail.com',
  cdkVersion: '1.95.2',
  defaultReleaseBranch: 'main',
  name: 'cdk-github-oidc',
  repositoryUrl: 'https://github.com/pahud/cdk-github-oidc.git',
  cdkde,

});
project.synth();