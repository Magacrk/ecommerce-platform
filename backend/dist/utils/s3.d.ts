/**
 * Generate a presigned URL for uploading a file to S3
 * @param fileType MIME type of the file
 * @param folder Folder path in the S3 bucket
 * @returns Object containing the upload URL and the file key
 */
export declare const getPresignedUploadUrl: (fileType: string, folder?: string) => Promise<{
    uploadUrl: string;
    key: string;
}>;
/**
 * Get the URL for an object in S3
 * @param key The key of the object in S3
 * @returns The URL of the object
 */
export declare const getObjectUrl: (key: string) => string;
/**
 * Delete an object from S3
 * @param key The key of the object in S3
 */
export declare const deleteObject: (key: string) => Promise<void>;
/**
 * Extract the file key from a full S3 URL
 * @param url Full S3 URL
 * @returns The file key
 */
export declare const extractKeyFromUrl: (url: string) => string;
