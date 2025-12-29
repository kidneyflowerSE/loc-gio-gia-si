const fs = require('fs');
const path = require('path');

// Detect if running on Vercel or other serverless platforms
const isServerless = () => {
    return process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY;
};

// Tạo thư mục temp để lưu file tạm thời trước khi upload lên Cloudinary
const createTempUploadDirectory = () => {
    // Skip on serverless - use /tmp instead which is the only writable location
    if (isServerless()) {
        console.log('🔧 Running on serverless platform, using /tmp for temporary files');
        return;
    }

    const tempDir = path.join(__dirname, '../uploads/temp');

    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
        console.log('✅ Thư mục temp upload đã được tạo');
    }
};

module.exports = {
    createTempUploadDirectory
};
