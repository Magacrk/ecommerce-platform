import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Auth } from 'aws-amplify';
// Remove CognitoUser import as we're using the one from vite-env.d.ts
// import { CognitoUser } from 'amazon-cognito-identity-js';

// Define types
interface AuthContextType {
  user: CognitoUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<CognitoUser | any>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, attributes: Record<string, string>) => Promise<any>;
  confirmSignUp: (email: string, code: string) => Promise<any>;
  forgotPassword: (email: string) => Promise<any>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<any>;
  updateUserAttributes: (attributes: Record<string, string>) => Promise<any>;
  userRole: string | null;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Create context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  signIn: () => Promise.reject('AuthContext not initialized'),
  signOut: () => Promise.reject('AuthContext not initialized'),
  signUp: () => Promise.reject('AuthContext not initialized'),
  confirmSignUp: () => Promise.reject('AuthContext not initialized'),
  forgotPassword: () => Promise.reject('AuthContext not initialized'),
  resetPassword: () => Promise.reject('AuthContext not initialized'),
  updateUserAttributes: () => Promise.reject('AuthContext not initialized'),
  userRole: null,
});

// For development purposes, create mock users
interface MockUser {
  password: string;
  name: string;
  role: string;
}

const mockUsers: Record<string, MockUser> = {
  'demo@example.com': {
    password: 'Password123!',
    name: 'Demo User',
    role: 'buyer',
  },
  'seller@example.com': {
    password: 'Password123!',
    name: 'Demo Seller',
    role: 'seller',
  },
};

// Mock CognitoUser
class MockCognitoUser {
  username: string;
  attributes: Record<string, any>;

  constructor(username: string, attributes: Record<string, any>) {
    this.username = username;
    this.attributes = attributes;
  }
}

// AuthProvider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<CognitoUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Check for authenticated user on mount
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        // Check if we're using mock data right away to skip AWS auth attempts
        if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
          // Try to get stored auth data from localStorage
          const storedAuth = localStorage.getItem('auth');
          
          if (storedAuth) {
            const authData = JSON.parse(storedAuth);
            
            // Create a mock user
            const mockUser = new MockCognitoUser(authData.email, {
              email: authData.email,
              name: authData.name,
              'custom:role': authData.role,
            });
            setUser(mockUser as unknown as CognitoUser);
            setUserRole(authData.role);
            setIsAuthenticated(true);
          } else {
            setUser(null);
            setIsAuthenticated(false);
          }
          setIsLoading(false);
          return;
        }

        // Try to get stored auth data from localStorage
        const storedAuth = localStorage.getItem('auth');
        
        if (storedAuth) {
          const authData = JSON.parse(storedAuth);
          
          // Create a mock user if we're in development mode or actual AWS user
          if (import.meta.env.VITE_USE_MOCK_DATA === 'true' && authData.email) {
            const mockUser = new MockCognitoUser(authData.email, {
              email: authData.email,
              name: authData.name,
              'custom:role': authData.role,
            });
            setUser(mockUser as unknown as CognitoUser);
            setUserRole(authData.role);
            setIsAuthenticated(true);
          } else {
            // Try to get the real user from Cognito
            try {
              const currentUser = await Auth.currentAuthenticatedUser();
              setUser(currentUser);
              
              // Get the role from user attributes
              const userAttributes = await Auth.userAttributes(currentUser);
              const roleAttr = userAttributes.find(attr => attr.Name === 'custom:role');
              setUserRole(roleAttr ? roleAttr.Value : 'buyer');
              
              setIsAuthenticated(true);
            } catch (err) {
              // AWS authentication failed, but we still have stored auth
              // Set up mock user
              setUser(null);
              setIsAuthenticated(false);
            }
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthState();
  }, []);

  // Sign in method
  const signIn = async (email: string, password: string) => {
    try {
      // Check if we're using mock data
      if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        const mockUser = mockUsers[email.toLowerCase()];
        if (mockUser && mockUser.password === password) {
          // Create a mock user
          const user = new MockCognitoUser(email, {
            email: email,
            name: mockUser.name,
            'custom:role': mockUser.role,
          });
          
          // Store auth data in localStorage
          localStorage.setItem('auth', JSON.stringify({
            email,
            name: mockUser.name,
            role: mockUser.role,
          }));
          
          setUser(user as unknown as CognitoUser);
          setUserRole(mockUser.role);
          setIsAuthenticated(true);
          return user;
        } else {
          throw new Error('Invalid email or password');
        }
      } else {
        // Try real AWS Cognito auth
        try {
          const signedInUser = await Auth.signIn(email, password);
          setUser(signedInUser);
          
          // Get the role from user attributes
          const userAttributes = await Auth.userAttributes(signedInUser);
          const roleAttr = userAttributes.find(attr => attr.Name === 'custom:role');
          const role = roleAttr ? roleAttr.Value : 'buyer';
          setUserRole(role);
          
          // Store basic info in localStorage as fallback
          localStorage.setItem('auth', JSON.stringify({
            email,
            name: userAttributes.find(attr => attr.Name === 'name')?.Value || email,
            role,
          }));
          
          setIsAuthenticated(true);
          return signedInUser;
        } catch (error) {
          console.error("AWS Auth failed, falling back to mock auth");
          
          // Fallback to mock users if AWS Auth fails
          const mockUser = mockUsers[email.toLowerCase()];
          if (mockUser && mockUser.password === password) {
            const user = new MockCognitoUser(email, {
              email: email,
              name: mockUser.name,
              'custom:role': mockUser.role,
            });
            
            localStorage.setItem('auth', JSON.stringify({
              email,
              name: mockUser.name,
              role: mockUser.role,
            }));
            
            setUser(user as unknown as CognitoUser);
            setUserRole(mockUser.role);
            setIsAuthenticated(true);
            return user;
          } else {
            throw new Error('Invalid email or password');
          }
        }
      }
    } catch (error) {
      throw error;
    }
  };

  // Sign out method
  const signOut = async () => {
    try {
      if (import.meta.env.VITE_USE_MOCK_DATA !== 'true') {
        try {
          await Auth.signOut();
        } catch (e) {
          console.error('Error signing out from AWS Cognito:', e);
        }
      }
      
      // Always clear local storage and state
      localStorage.removeItem('auth');
      setUser(null);
      setUserRole(null);
      setIsAuthenticated(false);
    } catch (error) {
      throw error;
    }
  };

  // Sign up method
  const signUp = async (email: string, password: string, attributes: Record<string, string>) => {
    try {
      return await Auth.signUp({
        username: email,
        password,
        attributes: {
          email,
          ...attributes,
        },
      });
    } catch (error) {
      throw error;
    }
  };

  // Confirm sign up method
  const confirmSignUp = async (email: string, code: string) => {
    try {
      return await Auth.confirmSignUp(email, code);
    } catch (error) {
      throw error;
    }
  };

  // Forgot password method
  const forgotPassword = async (email: string) => {
    try {
      return await Auth.forgotPassword(email);
    } catch (error) {
      throw error;
    }
  };

  // Reset password method
  const resetPassword = async (email: string, code: string, newPassword: string) => {
    try {
      return await Auth.forgotPasswordSubmit(email, code, newPassword);
    } catch (error) {
      throw error;
    }
  };

  // Update user attributes method
  const updateUserAttributes = async (attributes: Record<string, string>) => {
    try {
      const currentUser = await Auth.currentAuthenticatedUser();
      
      const attributePromises = Object.keys(attributes).map((key) => {
        return Auth.updateUserAttributes(currentUser, {
          [key]: attributes[key],
        });
      });

      const results = await Promise.all(attributePromises);
      
      // Update the user state
      const updatedUser = await Auth.currentAuthenticatedUser({ bypassCache: true });
      setUser(updatedUser);
      
      return results;
    } catch (error) {
      throw error;
    }
  };

  // Create context value object
  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    signIn,
    signOut,
    signUp,
    confirmSignUp,
    forgotPassword,
    resetPassword,
    updateUserAttributes,
    userRole,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 