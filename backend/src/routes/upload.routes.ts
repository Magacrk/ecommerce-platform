import { Router } from 'express';
import { authMiddleware, sellerMiddleware } from '../middlewares/authMiddleware';
import { getPresignedUploadUrl } from '../utils/s3';

const router = Router();

/**
 * @route   POST /api/v1/uploads/presigned-url
 * @desc    Get a presigned URL for S3 file upload
 * @access  Private
 */
router.post('/presigned-url', authMiddleware, async (req, res, next) => {
  try {
    const { fileType, folder } = req.body;
    
    if (!fileType) {
      return res.status(400).json({
        success: false,
        message: 'File type is required'
      });
    }

    const { uploadUrl, key } = await getPresignedUploadUrl(fileType, folder);
    
    res.status(200).json({
      success: true,
      data: {
        uploadUrl,
        key
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router; 