interface Window {
  ENV_CONFIG?: {
    VITE_API_BASE_URL: string;
    VITE_AWS_REGION: string;
    VITE_USER_POOL_ID: string;
    VITE_USER_POOL_CLIENT_ID: string;
    VITE_S3_BUCKET: string;
    VITE_IDENTITY_POOL_ID: string;
    VITE_SKIP_AWS_CONFIG: string;
    VITE_USE_MOCK_DATA: string;
  };
  env?: {
    AWS_REGION: string;
    AWS_COGNITO_USER_POOL_ID: string;
    AWS_COGNITO_CLIENT_ID: string;
    AWS_COGNITO_IDENTITY_POOL_ID: string;
    S3_BUCKET: string;
    S3_REGION: string;
    BACKEND_URL: string;
  };
} 