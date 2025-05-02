"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const s3_1 = require("../utils/s3");
const router = (0, express_1.Router)();
/**
 * @route   POST /api/v1/uploads/presigned-url
 * @desc    Get a presigned URL for S3 file upload
 * @access  Private
 */
router.post('/presigned-url', authMiddleware_1.authMiddleware, async (req, res, next) => {
    try {
        const { fileType, folder } = req.body;
        if (!fileType) {
            return res.status(400).json({
                success: false,
                message: 'File type is required'
            });
        }
        const { uploadUrl, key } = await (0, s3_1.getPresignedUploadUrl)(fileType, folder);
        res.status(200).json({
            success: true,
            data: {
                uploadUrl,
                key
            }
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=upload.routes.js.map