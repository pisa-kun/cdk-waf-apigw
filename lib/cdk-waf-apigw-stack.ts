import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as waf from 'aws-cdk-lib/aws-wafv2';
import {aws_lambda_nodejs as lambdaNodejs} from "aws-cdk-lib"; 
import { Construct } from 'constructs';


export class CdkWafApigwStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const fn = new lambdaNodejs.NodejsFunction(this, 'pingHandler',{
      entry: "lambda/index.ts",
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_16_X,
    });

    // APIgw
    const restApi = new apigw.RestApi(this, "restApi", {
      restApiName: "restApi",
      // 必要な要素
      deployOptions: {
        stageName: "dev",
      },
    });
    restApi.root.addMethod("GET", new apigw.LambdaIntegration(fn));

    // WAF web acl
    const webAcl = new waf.CfnWebACL(this, "wafV2WebAcl", {
      defaultAction: {
        allow: {}
      },
      scope: "REGIONAL",
      visibilityConfig:{
        cloudWatchMetricsEnabled: true,
        sampledRequestsEnabled: true,
        metricName: "wafV2WebAcl",
      },
      rules: [
        {
          name: "AWSManagedRulesCommonRuleSet",
          priority: 1,
          statement: {
            managedRuleGroupStatement: {
              vendorName: "AWS",
              name: "AWSManagedRulesCommonRuleSet",
            },
          },
          overrideAction: { none: {} },
          visibilityConfig: {
            cloudWatchMetricsEnabled: true,
            sampledRequestsEnabled: true,
            metricName: "AWSManagedRulesCommonRuleSet",
          },
        },
      ],
    });

    // ApigwとwebACLの紐づけ
    const webAclAssociation = new waf.CfnWebACLAssociation(this, "WebAclAssociation",
    {
      resourceArn: `arn:aws:apigateway:${this.region}::/restapis/${restApi.restApiId}/stages/dev`,
      webAclArn: webAcl.attrArn,
    });

    webAclAssociation.addDependsOn(webAcl);
    webAclAssociation.addDependsOn(restApi.deploymentStage.node.defaultChild as cdk.CfnResource);
  }
}
