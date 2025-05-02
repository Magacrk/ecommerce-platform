import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import logger from './logger';

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.S3_REGION || process.env.AWS_REGION || 'us-east-1',
});

// S3 bucket name from environment variables
const bucketName = process.env.S3_BUCKET_NAME;

/**
 * Generate a presigned URL for uploading a file to S3
 * @param fileType MIME type of the file
 * @param folder Folder path in the S3 bucket
 * @returns Object containing the upload URL and the file key
 */
export const getPresignedUploadUrl = async (
  fileType: string,
  folder: string = 'products'
): Promise<{ uploadUrl: string; key: string }> => {
  try {
    if (!bucketName) {
      throw new Error('S3_BUCKET_NAME environment variable is not set');
    }

    // Generate a unique file key with UUID to prevent collisions
    const fileExtension = fileType.split('/')[1] || '';
    const key = `${folder}/${uuidv4()}.${fileExtension}`;

    // Create the put object command
    const putObjectCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: fileType,
    });

    // Generate the presigned URL
    const uploadUrl = await getSignedUrl(s3Client, putObjectCommand, {
      expiresIn: 3600, // URL expires in 1 hour
    });

    return { uploadUrl, key };
  } catch (error) {
    logger.error('Error generating presigned URL:', error);
    throw error;
  }
};

/**
 * Get the URL for an object in S3
 * @param key The key of the object in S3
 * @returns The URL of the object
 */
export const getObjectUrl = (key: string): string => {
  if (!bucketName) {
    throw new Error('S3_BUCKET_NAME environment variable is not set');
  }
  
  return `https://${bucketName}.s3.amazonaws.com/${key}`;
};

/**
 * Delete an object from S3
 * @param key The key of the object in S3
 */
export const deleteObject = async (key: string): Promise<void> => {
  try {
    if (!bucketName) {
      throw new Error('S3_BUCKET_NAME environment variable is not set');
    }

    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await s3Client.send(deleteCommand);
    logger.info(`Successfully deleted object: ${key}`);
  } catch (error) {
    logger.error(`Error deleting object ${key}:`, error);
    throw error;
  }
};

/**
 * Extract the file key from a full S3 URL
 * @param url Full S3 URL
 * @returns The file key
 */
export const extractKeyFromUrl = (url: string): string => {
  if (!bucketName) {
    throw new Error('S3_BUCKET_NAME environment variable is not set');
  }
  
  const baseUrl = `https://${bucketName}.s3.amazonaws.com/`;
  
  if (url.startsWith(baseUrl)) {
    return url.substring(baseUrl.length);
  }
  
  // If the URL doesn't match the expected format, return as is (assuming it's already a key)
  return url;
}; 