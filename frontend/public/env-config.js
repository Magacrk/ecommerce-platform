// This file will be copied to the build output and loaded by index.html
window.ENV_CONFIG = {
  VITE_API_BASE_URL: '__BACKEND_URL__/api',
  VITE_AWS_REGION: '__AWS_REGION__',
  VITE_USER_POOL_ID: '__AWS_COGNITO_USER_POOL_ID__',
  VITE_USER_POOL_CLIENT_ID: '__AWS_COGNITO_CLIENT_ID__',
  VITE_S3_BUCKET: '__AWS_S3_BUCKET__',
  VITE_IDENTITY_POOL_ID: '__AWS_COGNITO_IDENTITY_POOL_ID__',
  VITE_SKIP_AWS_CONFIG: 'false',
  VITE_USE_MOCK_DATA: 'false'
}; 