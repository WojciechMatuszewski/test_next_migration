import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as apigwv2 from "@aws-cdk/aws-apigatewayv2";
import * as cognito from "@aws-cdk/aws-cognito";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as s3 from "@aws-cdk/aws-s3";
import * as route53 from "@aws-cdk/aws-route53";
import { getFunctionPath } from "./utils/utils";
import * as targets from "@aws-cdk/aws-route53-targets";
import * as acm from "@aws-cdk/aws-certificatemanager";

export class InfraStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const preSignupLambda = new lambda.Function(this, "preSignupLambda", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset(getFunctionPath("auto-confirm")),
      handler: "handler.handler"
    });

    const userPool = new cognito.UserPool(this, "userPool", {
      autoVerify: { email: true },
      selfSignUpEnabled: true,
      passwordPolicy: {
        minLength: 6,
        requireDigits: false,
        requireLowercase: false,
        requireSymbols: false,
        requireUppercase: false
      },
      signInAliases: {
        email: true
      },
      lambdaTriggers: {
        preSignUp: preSignupLambda
      }
    });

    const userPoolClient = new cognito.UserPoolClient(this, "userPoolClient", {
      userPool,
      authFlows: { userPassword: true, userSrp: true },
      generateSecret: false,
      supportedIdentityProviders: [
        cognito.UserPoolClientIdentityProvider.COGNITO
      ]
    });

    const hostingBucket = new s3.Bucket(this, "hostingBucket", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      websiteErrorDocument: "index.html",
      websiteIndexDocument: "index.html",
      publicReadAccess: true
    });

    const zone = new route53.PublicHostedZone(this, "hostingZone", {
      zoneName: "next-migration.tk"
    });

    const cert = new acm.Certificate(this, "hostingZoneCert", {
      domainName: "*.next-migration.tk",
      validation: acm.CertificateValidation.fromDns(zone)
    });

    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      "hostingDistribution",
      {
        originConfigs: [
          {
            s3OriginSource: { s3BucketSource: hostingBucket },
            customOriginSource: { domainName: "NEXT_JS_APP_URL" },
            behaviors: [
              {
                isDefaultBehavior: true
              },
              {
                isDefaultBehavior: false,
                pathPattern: "/posts/*",
                minTtl: cdk.Duration.seconds(0),
                maxTtl: cdk.Duration.seconds(0)
              }
            ]
          }
        ],
        viewerCertificate: cloudfront.ViewerCertificate.fromAcmCertificate(
          cert,
          { aliases: ["www.next-migration.tk"] }
        ),
        comment: "Rewire for next.js migration",
        errorConfigurations: [
          {
            errorCode: 404,
            errorCachingMinTtl: 0,
            responseCode: 200,
            responsePagePath: "/index.html"
          },
          {
            errorCode: 403,
            errorCachingMinTtl: 0,
            responseCode: 200,
            responsePagePath: "/index.html"
          }
        ]
      }
    );

    new route53.ARecord(this, "hostingZoneWWWAlias", {
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution)
      ),
      zone,
      recordName: "www.next-migration.tk"
    });

    new cdk.CfnOutput(this, "hostedZoneNameServers", {
      value: JSON.stringify(zone.hostedZoneNameServers?.join(","))
    });

    new cdk.CfnOutput(this, "userPoolId", {
      value: userPool.userPoolId
    });

    new cdk.CfnOutput(this, "userPoolClientId", {
      value: userPoolClient.userPoolClientId
    });

    new cdk.CfnOutput(this, "hostingBucketName", {
      value: hostingBucket.bucketName
    });
  }
}
