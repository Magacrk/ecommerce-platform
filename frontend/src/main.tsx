import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

// Import polyfills before Amplify
import './polyfills';
import { Amplify } from 'aws-amplify';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import './index.css';

// Configure Amplify based on environment
if (import.meta.env.VITE_SKIP_AWS_CONFIG === 'true' || (window.ENV_CONFIG && (window.ENV_CONFIG as any).VITE_SKIP_AWS_CONFIG === 'true')) {
  // Skip AWS configuration entirely
  console.log('Skipping AWS configuration - using mock authentication only');
  // Just initialize an empty shell for Auth to prevent errors in the app
  Amplify.configure({});
} else if (import.meta.env.VITE_USE_MOCK_DATA === 'true' || (window.ENV_CONFIG && (window.ENV_CONFIG as any).VITE_USE_MOCK_DATA === 'true')) {
  // Use minimal configuration when using mock data but still initialize Amplify
  console.log('Using mock authentication - AWS Amplify services will be mocked');
  Amplify.configure({
    // Provide minimal config to prevent errors
    Auth: {
      // Empty config to prevent initialization errors
    }
  });
} else {
  // Get environment variables - prefer runtime config over build-time env vars
  const envConfig = (window.ENV_CONFIG || {}) as {
    VITE_AWS_REGION?: string;
    VITE_USER_POOL_ID?: string;
    VITE_USER_POOL_CLIENT_ID?: string;
    VITE_S3_BUCKET?: string;
    VITE_IDENTITY_POOL_ID?: string;
    VITE_SKIP_AWS_CONFIG?: string;
    VITE_USE_MOCK_DATA?: string;
  };
  const region = envConfig.VITE_AWS_REGION || import.meta.env.VITE_AWS_REGION || 'us-east-1';
  const userPoolId = envConfig.VITE_USER_POOL_ID || import.meta.env.VITE_USER_POOL_ID;
  const userPoolClientId = envConfig.VITE_USER_POOL_CLIENT_ID || import.meta.env.VITE_USER_POOL_CLIENT_ID;
  const s3Bucket = envConfig.VITE_S3_BUCKET || import.meta.env.VITE_S3_BUCKET;
  const identityPoolId = envConfig.VITE_IDENTITY_POOL_ID || import.meta.env.VITE_IDENTITY_POOL_ID;
  
  // Log config for debugging in production
  console.log('AWS Config:', { 
    region, 
    userPoolId: userPoolId ? '✓' : '✗', 
    userPoolClientId: userPoolClientId ? '✓' : '✗',
    s3Bucket: s3Bucket ? '✓' : '✗',
    identityPoolId: identityPoolId ? '✓' : '✗'
  });
  
  // Check for required values
  if (!userPoolId || !userPoolClientId) {
    throw new Error('Both UserPoolId and ClientId are required.');
  }
  
  // Use actual AWS configuration
  Amplify.configure({
    Auth: {
      region,
      userPoolId,
      userPoolWebClientId: userPoolClientId,
      mandatorySignIn: true,
    },
    Storage: {
      region,
      bucket: s3Bucket,
      identityPoolId,
    },
  });
}

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
); 