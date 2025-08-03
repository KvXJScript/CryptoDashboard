#!/bin/bash

echo "🚀 Building Crypto Dashboard for GitHub Pages"

# Set environment variables for GitHub Pages build
export VITE_BASE_PATH="/CryptoDashboard"
export NODE_ENV="production"

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/public
rm -rf client/dist

# Build the application
echo "🔨 Building application..."
npx vite build --config vite.config.github.ts

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Files generated in: dist/public/"
    ls -la dist/public/
    
    echo ""
    echo "🌐 Your app will be deployed to:"
    echo "https://kvxjscript.github.io/CryptoDashboard/"
    
    echo ""
    echo "📋 Next steps:"
    echo "1. git add ."
    echo "2. git commit -m 'Fix deployment configuration'"
    echo "3. git push"
    echo ""
    echo "GitHub Actions will automatically deploy your app!"
else
    echo "❌ Build failed. Check the errors above."
    exit 1
fi