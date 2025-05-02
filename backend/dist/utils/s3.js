"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractKeyFromUrl = exports.deleteObject = exports.getObjectUrl = exports.getPresignedUploadUrl = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const uuid_1 = require("uuid");
const logger_1 = __importDefault(require("./logger"));
// Initialize S3 client
const s3Client = new client_s3_1.S3Client({
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
const getPresignedUploadUrl = async (fileType, folder = 'products') => {
    try {
        if (!bucketName) {
            throw new Error('S3_BUCKET_NAME environment variable is not set');
        }
        // Generate a unique file key with UUID to prevent collisions
        const fileExtension = fileType.split('/')[1] || '';
        const key = `${folder}/${(0, uuid_1.v4)()}.${fileExtension}`;
        // Create the put object command
        const putObjectCommand = new client_s3_1.PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            ContentType: fileType,
        });
        // Generate the presigned URL
        const uploadUrl = await (0, s3_request_presigner_1.getSignedUrl)(s3Client, putObjectCommand, {
            expiresIn: 3600, // URL expires in 1 hour
        });
        return { uploadUrl, key };
    }
    catch (error) {
        logger_1.default.error('Error generating presigned URL:', error);
        throw error;
    }
};
exports.getPresignedUploadUrl = getPresignedUploadUrl;
/**
 * Get the URL for an object in S3
 * @param key The key of the object in S3
 * @returns The URL of the object
 */
const getObjectUrl = (key) => {
    if (!bucketName) {
        throw new Error('S3_BUCKET_NAME environment variable is not set');
    }
    return `https://${bucketName}.s3.amazonaws.com/${key}`;
};
exports.getObjectUrl = getObjectUrl;
/**
 * Delete an object from S3
 * @param key The key of the object in S3
 */
const deleteObject = async (key) => {
    try {
        if (!bucketName) {
            throw new Error('S3_BUCKET_NAME environment variable is not set');
        }
        const deleteCommand = new client_s3_1.DeleteObjectCommand({
            Bucket: bucketName,
            Key: key,
        });
        await s3Client.send(deleteCommand);
        logger_1.default.info(`Successfully deleted object: ${key}`);
    }
    catch (error) {
        logger_1.default.error(`Error deleting object ${key}:`, error);
        throw error;
    }
};
exports.deleteObject = deleteObject;
/**
 * Extract the file key from a full S3 URL
 * @param url Full S3 URL
 * @returns The file key
 */
const extractKeyFromUrl = (url) => {
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
exports.extractKeyFromUrl = extractKeyFromUrl;
//# sourceMappingURL=s3.js.map