import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class TravelTrackerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const imageBucket = new s3.Bucket(this, "ImageBucket", {
      bucketName: `imagebucket-${cdk.Aws.ACCOUNT_ID}`,
      versioned: true, // Enable versioning for data recovery
      removalPolicy: cdk.RemovalPolicy.RETAIN, // Retain bucket when stack is deleted
    });
  }
}
