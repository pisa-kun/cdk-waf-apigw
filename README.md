# AWS CDKでwaf + api gateway

## procedure
1. typescriptでlambdaを実行するためにnpm install

> npm install @types/aws-lambda esbuild --save-dev

2. S3へのログの出力


参考:  
https://zenn.dev/dyoshikawa/articles/fe1ae6743db0b7

#### デプロイ時に spawnSync docker ENOENT が出る場合
esbuildをインストールしておかないと次のようなエラーが発生する。
```
Error: spawnSync docker ENOENT
    at Object.spawnSync (node:internal/child_process:1110:20)
    at spawnSync (node:child_process:871:24)
    at dockerExec (C:\Develop\aws\cdk-waf-apigw\node_modules\aws-cdk-lib\core\lib\private\asset-staging.js:1:3585)
    at Function.fromBuild (C:\Develop\aws\cdk-waf-apigw\node_modules\aws-cdk-lib\core\lib\bundling.js:1:4761)
    at new Bundling (C:\Develop\aws\cdk-waf-apigw\node_modules\aws-cdk-lib\aws-lambda-nodejs\lib\bundling.js:1:3796)        
    at Function.bundle (C:\Develop\aws\cdk-waf-apigw\node_modules\aws-cdk-lib\aws-lambda-nodejs\lib\bundling.js:1:960)      
    at new NodejsFunction (C:\Develop\aws\cdk-waf-apigw\node_modules\aws-cdk-lib\aws-lambda-nodejs\lib\function.js:1:1729)  
    at new CdkWafApigwStack (C:\Develop\aws\cdk-waf-apigw\lib\cdk-waf-apigw-stack.ts:13:16)
    at Object.<anonymous> (C:\Develop\aws\cdk-waf-apigw\bin\cdk-waf-apigw.ts:7:1)
    at Module._compile (node:internal/modules/cjs/loader:1256:14) {
  errno: -4058,
  code: 'ENOENT',
  syscall: 'spawnSync docker',
  path: 'docker',
  spawnargs: [
    'build',
    '-t',
    'cdk-5eee9fa0215595422e43b388d251d1adbe6e4fac59bfe344247695cec5d21181',
    '--platform',
    'linux/amd64',
    '--build-arg',
    'IMAGE=public.ecr.aws/sam/build-nodejs16.x',
    '--build-arg',
    'ESBUILD_VERSION=0',
    'C:\\Develop\\aws\\cdk-waf-apigw\\node_modules\\aws-cdk-lib\\aws-lambda-nodejs\\lib'
  ]
}

Subprocess exited with error 1
```

## 参考
https://dev.classmethod.jp/articles/output-requestlog-cloudwatch-aws-waf-api-gateway-count-mode/

https://zenn.dev/dyoshikawa/articles/ac3109e2296628

https://zenn.dev/dyoshikawa/articles/fe1ae6743db0b7

https://github.com/pisa-kun/cdk_workshop/blob/master/lib/cdk-workshop-ts-stack.ts