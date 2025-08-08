#!/bin/bash

echo "🚀 Deploying The Storm Professional to thestormprofessional.com"
echo "=============================================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Step 1: Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Step 2: Update Git repository
print_status "Updating Git repository..."
git add .
git commit -m "Deploy to thestormprofessional.com - Legal compliance updates"
git push

print_success "Git repository updated!"

# Step 3: Deploy to Vercel
print_status "Deploying to Vercel..."
print_status "This will deploy to: thestormprofessional.com"

# Deploy using npx vercel
npx vercel --prod --confirm

if [ $? -eq 0 ]; then
    print_success "Deployment successful!"
    echo ""
    echo "🎉 Your website is now live at:"
    echo "   https://thestormprofessional.com"
    echo "   https://www.thestormprofessional.com"
    echo ""
    echo "📧 Next Steps:"
    echo "1. Set up environment variables in Vercel dashboard:"
    echo "   - EMAIL_USER = your-gmail@gmail.com"
    echo "   - EMAIL_PASS = your-gmail-app-password"
    echo "   - ADMIN_EMAIL = Liamseamus1198@gmail.com"
    echo "   - SESSION_SECRET = roofing-lead-system-secret-2024"
    echo ""
    echo "2. Test your website:"
    echo "   - Visit https://thestormprofessional.com"
    echo "   - Submit a test lead form"
    echo "   - Check if email is sent to Liamseamus1198@gmail.com"
    echo ""
    echo "3. Configure domain DNS (if needed):"
    echo "   - Point thestormprofessional.com to Vercel"
    echo "   - Add www subdomain"
    echo ""
else
    print_error "Deployment failed!"
    echo ""
    echo "🔧 Troubleshooting:"
    echo "1. Check if you're logged into Vercel: npx vercel login"
    echo "2. Try manual deployment: npx vercel"
    echo "3. Check Vercel dashboard for errors"
    echo ""
fi

print_status "Deployment process completed!" 