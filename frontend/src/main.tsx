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
if (import.meta.env.VITE_SKIP_AWS_CONFIG === 'true') {
  // Skip AWS configuration entirely
  console.log('Skipping AWS configuration - using mock authentication only');
  // Just initialize an empty shell for Auth to prevent errors in the app
  Amplify.configure({});
} else if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
  // Use minimal configuration when using mock data but still initialize Amplify
  console.log('Using mock authentication - AWS Amplify services will be mocked');
  Amplify.configure({
    // Provide minimal config to prevent errors
    Auth: {
      // Empty config to prevent initialization errors
    }
  });
} else {
  // Use actual AWS configuration
  Amplify.configure({
    Auth: {
      region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
      userPoolId: import.meta.env.VITE_USER_POOL_ID,
      userPoolWebClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID,
      mandatorySignIn: true,
    },
    Storage: {
      region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
      bucket: import.meta.env.VITE_S3_BUCKET,
      identityPoolId: import.meta.env.VITE_IDENTITY_POOL_ID,
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