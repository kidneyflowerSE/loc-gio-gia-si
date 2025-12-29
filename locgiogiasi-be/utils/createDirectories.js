// Create uploads directory if it doesn't exist
const fs = require('fs');
const path = require('path');

// Detect if running on Vercel or other serverless platforms
const isServerless = () => {
  return process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY;
};

const createUploadsDirectory = () => {
  // Skip directory creation on serverless platforms (read-only filesystem)
  if (isServerless()) {
    console.log('🔧 Running on serverless platform, skipping uploads directory creation');
    return;
  }

  const uploadsDir = path.join(__dirname, '../uploads');

  // Create main uploads directory
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✅ Created uploads directory');
  }

  // Create subdirectories
  const dirs = ['products', 'blogs', 'avatars'];

  dirs.forEach(dir => {
    const dirPath = path.join(uploadsDir, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`✅ Created ${dir} directory`);
    }
  });
};

module.exports = { createUploadsDirectory };

