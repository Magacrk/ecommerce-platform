/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AWS_REGION: string
  readonly VITE_USER_POOL_ID: string
  readonly VITE_USER_POOL_CLIENT_ID: string
  readonly VITE_S3_BUCKET: string
  readonly VITE_IDENTITY_POOL_ID: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_USE_MOCK_DATA: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Type declarations for modules without type definitions
declare module 'react-image-zoom' {
  interface ReactImageZoomProps {
    width: number;
    height: number;
    zoomWidth?: number;
    img: string;
    zoomPosition?: 'top' | 'left' | 'bottom' | 'right' | 'original';
    scale?: number;
    offset?: { vertical: number; horizontal: number };
    zoomLensStyle?: React.CSSProperties;
    zoomStyle?: React.CSSProperties;
    zoomContainerStyle?: React.CSSProperties;
    className?: string;
  }
  
  export default function ReactImageZoom(props: ReactImageZoomProps): JSX.Element;
}

// AWS Cognito User type
interface CognitoUser {
  attributes: {
    email: string;
    'custom:role': string;
    [key: string]: string;
  };
  username: string;
}

// Global application types
declare namespace AppTypes {
  interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }

  interface Order {
    id: string;
    customer: string;
    email: string;
    date: string;
    total: number;
    status: 'processing' | 'shipped' | 'delivered';
    items: OrderItem[];
  }

  interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    category: string;
    stock: number;
    image: string | null;
  }

  interface NewProductForm {
    name: string;
    price: string;
    description: string;
    category: string;
    stock: string;
  }
} 