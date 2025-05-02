# Multi-Vendor E-Commerce Platform

A production-ready e-commerce platform built with React, TypeScript, Node.js, and AWS services.

## Tech Stack

### Frontend
- React with TypeScript
- Framer Motion for animations
- Tailwind CSS for styling
- Mobile-first responsive design

### Backend
- Node.js/Express with TypeScript
- PostgreSQL database
- Prisma ORM

### Authentication & Storage
- AWS Cognito for user authentication
- AWS S3 for product image storage

### Payments
- Stripe for payment processing

### Deployment
- AWS Elastic Beanstalk (Backend)
- AWS S3/CloudFront (Frontend)
- CloudFormation templates for AWS resource provisioning

## Features
- Multi-vendor marketplace
- Seller dashboard for product management
- Animated product gallery with zoom functionality
- Role-based access control (buyer/seller)
- Responsive design for all devices
- SEO optimized

## Local Development Setup

### Prerequisites
- Node.js (v16+)
- Docker and Docker Compose
- AWS CLI configured with appropriate permissions

### Getting Started
1. Clone the repository
   ```
   git clone <repository-url>
   cd multi-vendor-ecommerce
   ```

2. Install dependencies
   ```
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. Set up environment variables
   ```
   # In frontend directory
   cp .env.example .env.local

   # In backend directory
   cp .env.example .env
   ```

4. Start local development environment
   ```
   # Start Docker containers (PostgreSQL)
   docker-compose up -d

   # Start backend server
   cd backend
   npm run dev

   # Start frontend server
   cd frontend
   npm run dev
   ```

5. Access the application
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000

## AWS Deployment

### AWS Setup
1. Create required AWS resources using CloudFormation template
   ```
   aws cloudformation create-stack --stack-name ecommerce-infrastructure --template-body file://deployment/cloudformation/main.yml --capabilities CAPABILITY_IAM
   ```

2. Configure AWS resources in environment variables

3. Deploy backend to Elastic Beanstalk
   ```
   cd backend
   npm run deploy:prod
   ```

4. Deploy frontend to S3/CloudFront
   ```
   cd frontend
   npm run deploy:prod
   ```

## Maintenance and Scaling

### Database Migrations
```
cd backend
npx prisma migrate dev
npx prisma migrate deploy # for production
```

### CI/CD
The project includes GitHub Actions workflows for:
- Code linting and testing
- Automatic deployment to staging/production environments
- Database migrations

## Cost Optimization
- S3 lifecycle policies for old product images
- RDS instance sizing recommendations
- CloudFront caching strategies to reduce origin requests

## License
MIT 