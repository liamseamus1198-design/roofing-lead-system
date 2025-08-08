#!/bin/bash

echo "🔧 Setting up Gmail Email Configuration for The Storm Professional"
echo "================================================================"
echo ""

# Update the .env file with the correct admin email
sed -i '' 's/ADMIN_EMAIL=your-admin-email@gmail.com/ADMIN_EMAIL=Liamseamus1198@gmail.com/' .env

echo "✅ Updated ADMIN_EMAIL to: Liamseamus1198@gmail.com"
echo ""

echo "📧 Next Steps:"
echo "1. You need to provide your Gmail credentials"
echo "2. Get your Gmail App Password from: https://myaccount.google.com/"
echo "3. Update the .env file with your actual Gmail credentials"
echo ""

echo "🔑 Required Gmail Setup:"
echo "1. Go to https://myaccount.google.com/"
echo "2. Enable 2-Step Verification (if not already enabled)"
echo "3. Go to Security > App passwords"
echo "4. Generate app password for 'Mail'"
echo "5. Copy the 16-character password"
echo ""

echo "📝 Update these lines in .env file:"
echo "EMAIL_USER=your-actual-gmail@gmail.com"
echo "EMAIL_PASS=your-16-character-app-password"
echo ""

echo "🧪 After updating .env, test with: npm run test-email"
echo ""

echo "🚀 Then start server with: npm start" 