// Define the global object for browser environment to support AWS Amplify
if (typeof (window as any).global === 'undefined') {
  (window as any).global = window;
}

// Define other Node.js globals that might be used by AWS libraries
if (typeof (window as any).process === 'undefined') {
  (window as any).process = {
    env: {},
    browser: true,
    version: '',
    versions: {},
  };
}

// Buffer polyfill
if (typeof (window as any).Buffer === 'undefined') {
  (window as any).Buffer = {
    isBuffer: () => false,
  };
}

// Mock the Amazon Cognito Identity pool for local development
if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
  // Mock the credentials provider
  (window as any).AWS = {
    config: {
      region: 'us-east-1',
      credentials: {
        accessKeyId: 'mock-access-key',
        secretAccessKey: 'mock-secret-key'
      }
    },
    CognitoIdentityCredentials: function() {
      return {
        clearCachedId: () => {}
      };
    }
  };
} 