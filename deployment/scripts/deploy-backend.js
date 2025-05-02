#!/usr/bin/env node

/**
 * Deployment script for AWS Elastic Beanstalk
 * This script packages the backend application and deploys it to AWS Elastic Beanstalk
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Configuration
const appName = 'ecommerce-backend';
const environment = process.env.DEPLOY_ENV || 'production';
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const zipFile = `${appName}-${environment}-${timestamp}.zip`;
const s3Bucket = process.env.EB_S3_BUCKET;
const ebApplication = process.env.EB_APPLICATION_NAME || appName;
const ebEnvironment = process.env.EB_ENVIRONMENT_NAME || `${appName}-${environment}`;

// Print configuration
console.log('Deploying backend to AWS Elastic Beanstalk');
console.log(`Environment: ${environment}`);
console.log(`Application: ${ebApplication}`);
console.log(`Environment: ${ebEnvironment}`);
console.log(`Zip file: ${zipFile}`);

// Ensure necessary environment variables are set
if (!s3Bucket) {
  console.error('EB_S3_BUCKET environment variable is required');
  process.exit(1);
}

// Create a temporary directory for the deployment package
const deployDir = path.join(__dirname, '../../.deploy');
if (!fs.existsSync(deployDir)) {
  fs.mkdirSync(deployDir, { recursive: true });
}

// Function to create the deployment package
function createDeploymentPackage() {
  return new Promise((resolve, reject) => {
    console.log('Creating deployment package...');
    
    const output = fs.createWriteStream(path.join(deployDir, zipFile));
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });
    
    output.on('close', () => {
      console.log(`Deployment package created: ${zipFile} (${archive.pointer()} bytes)`);
      resolve();
    });
    
    archive.on('error', (err) => {
      reject(err);
    });
    
    archive.pipe(output);
    
    // Add backend build files
    archive.directory(path.join(__dirname, '../../backend/dist'), 'dist');
    archive.directory(path.join(__dirname, '../../backend/prisma'), 'prisma');
    
    // Add package.json and package-lock.json
    archive.file(path.join(__dirname, '../../backend/package.json'), { name: 'package.json' });
    archive.file(path.join(__dirname, '../../backend/package-lock.json'), { name: 'package-lock.json' });
    
    // Add Dockerrun.aws.json for Elastic Beanstalk
    archive.file(path.join(__dirname, '../eb/Dockerrun.aws.json'), { name: 'Dockerrun.aws.json' });
    
    // Add Elastic Beanstalk configuration
    archive.directory(path.join(__dirname, '../eb/.ebextensions'), '.ebextensions');
    
    archive.finalize();
  });
}

// Function to upload the deployment package to S3
function uploadToS3() {
  console.log('Uploading deployment package to S3...');
  
  try {
    execSync(`aws s3 cp ${path.join(deployDir, zipFile)} s3://${s3Bucket}/${zipFile}`, {
      stdio: 'inherit'
    });
    console.log('Deployment package uploaded to S3');
    return `s3://${s3Bucket}/${zipFile}`;
  } catch (error) {
    console.error('Failed to upload deployment package to S3:', error);
    process.exit(1);
  }
}

// Function to deploy to Elastic Beanstalk
function deployToElasticBeanstalk(s3Location) {
  console.log('Deploying to Elastic Beanstalk...');
  
  try {
    // Create a new application version
    execSync(`aws elasticbeanstalk create-application-version \
      --application-name ${ebApplication} \
      --version-label ${environment}-${timestamp} \
      --source-bundle S3Bucket="${s3Bucket}",S3Key="${zipFile}" \
      --description "Deployment ${environment} ${timestamp}"`, {
      stdio: 'inherit'
    });
    
    // Update the environment to use the new version
    execSync(`aws elasticbeanstalk update-environment \
      --environment-name ${ebEnvironment} \
      --version-label ${environment}-${timestamp}`, {
      stdio: 'inherit'
    });
    
    console.log('Deployment started successfully');
    console.log(`Updating environment ${ebEnvironment} to version ${environment}-${timestamp}`);
    console.log('Check the AWS Elastic Beanstalk console for deployment status');
  } catch (error) {
    console.error('Failed to deploy to Elastic Beanstalk:', error);
    process.exit(1);
  }
}

// Main deployment process
async function deploy() {
  try {
    // Build the application
    console.log('Building the application...');
    execSync('cd ../../backend && npm run build', { stdio: 'inherit' });
    
    // Create the deployment package
    await createDeploymentPackage();
    
    // Upload to S3
    const s3Location = uploadToS3();
    
    // Deploy to Elastic Beanstalk
    deployToElasticBeanstalk(s3Location);
    
    console.log('Deployment process completed');
  } catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
  }
}

// Run the deployment
deploy(); 