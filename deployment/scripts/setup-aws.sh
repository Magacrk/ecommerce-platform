#!/bin/bash
# Script to set up AWS resources for the e-commerce platform

# Set variables
AWS_REGION="us-east-1"  # Change to your preferred region
STACK_NAME="ecommerce-infrastructure"
DB_USERNAME="postgres"
DB_PASSWORD="YourSecurePassword"  # Change this to a secure password
DB_NAME="ecommerce"
ENV="production"

# Create CloudFormation stack
echo "Creating CloudFormation stack..."
aws cloudformation create-stack \
  --stack-name $STACK_NAME \
  --template-body file://deployment/cloudformation/main.yml \
  --parameters ParameterKey=DatabaseUsername,ParameterValue=$DB_USERNAME \
               ParameterKey=DatabasePassword,ParameterValue=$DB_PASSWORD \
               ParameterKey=DatabaseName,ParameterValue=$DB_NAME \
               ParameterKey=Environment,ParameterValue=$ENV \
  --capabilities CAPABILITY_IAM \
  --region $AWS_REGION

# Wait for the stack to be created
echo "Waiting for stack creation to complete..."
aws cloudformation wait stack-create-complete --stack-name $STACK_NAME --region $AWS_REGION

# Get outputs from the stack
echo "Getting stack outputs..."
STACK_OUTPUTS=$(aws cloudformation describe-stacks --stack-name $STACK_NAME --region $AWS_REGION --query "Stacks[0].Outputs" --output json)

# Extract values from outputs
VPC_ID=$(echo $STACK_OUTPUTS | jq -r '.[] | select(.OutputKey=="VPCID") | .OutputValue')
RDS_ENDPOINT=$(echo $STACK_OUTPUTS | jq -r '.[] | select(.OutputKey=="RDSEndpoint") | .OutputValue')
USER_POOL_ID=$(echo $STACK_OUTPUTS | jq -r '.[] | select(.OutputKey=="UserPoolId") | .OutputValue')
USER_POOL_CLIENT_ID=$(echo $STACK_OUTPUTS | jq -r '.[] | select(.OutputKey=="UserPoolClientId") | .OutputValue')
IDENTITY_POOL_ID=$(echo $STACK_OUTPUTS | jq -r '.[] | select(.OutputKey=="IdentityPoolId") | .OutputValue')
PRODUCT_IMAGES_BUCKET=$(echo $STACK_OUTPUTS | jq -r '.[] | select(.OutputKey=="ProductImagesBucketName") | .OutputValue')
FRONTEND_BUCKET=$(echo $STACK_OUTPUTS | jq -r '.[] | select(.OutputKey=="FrontendBucketName") | .OutputValue')
CLOUDFRONT_DIST_ID=$(echo $STACK_OUTPUTS | jq -r '.[] | select(.OutputKey=="CloudFrontDistributionId") | .OutputValue')

# Create ECR repositories
echo "Creating ECR repositories..."
aws ecr create-repository --repository-name ecommerce/backend --region $AWS_REGION || true
aws ecr create-repository --repository-name ecommerce/frontend --region $AWS_REGION || true

# Create Elastic Beanstalk application
echo "Creating Elastic Beanstalk application..."
aws elasticbeanstalk create-application --application-name ecommerce-backend --region $AWS_REGION || true

# Create S3 bucket for Elastic Beanstalk deployments
ACCOUNT_ID=$(aws sts get-caller-identity --query "Account" --output text)
EB_BUCKET="elasticbeanstalk-$AWS_REGION-$ACCOUNT_ID"
aws s3 mb s3://$EB_BUCKET --region $AWS_REGION || true

# Print output
echo "AWS resources have been created!"
echo ""
echo "VPC ID: $VPC_ID"
echo "RDS Endpoint: $RDS_ENDPOINT"
echo "User Pool ID: $USER_POOL_ID"
echo "User Pool Client ID: $USER_POOL_CLIENT_ID"
echo "Identity Pool ID: $IDENTITY_POOL_ID"
echo "Product Images Bucket: $PRODUCT_IMAGES_BUCKET"
echo "Frontend Bucket: $FRONTEND_BUCKET"
echo "CloudFront Distribution ID: $CLOUDFRONT_DIST_ID"
echo "Elastic Beanstalk Bucket: $EB_BUCKET"
echo ""
echo "Add these values as secrets to your GitHub repository!" 