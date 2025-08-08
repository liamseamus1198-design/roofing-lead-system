# Email Setup Guide for The Storm Professional

## 🎯 Goal
Configure the lead form on thestormprofessional.com to send leads directly to **Liamseamus1198@gmail.com** via email.

## 📧 Current Status
✅ Server is configured to send emails  
✅ Target email is set to: Liamseamus1198@gmail.com  
❌ Gmail credentials need to be configured  

## 🔧 Setup Steps

### Step 1: Gmail App Password Setup

1. **Go to Google Account Settings**
   - Visit: https://myaccount.google.com/
   - Sign in with your Gmail account

2. **Enable 2-Step Verification** (if not already enabled)
   - Go to Security > 2-Step Verification
   - Follow the setup process

3. **Generate App Password**
   - Go to Security > App passwords
   - Select "Mail" from the dropdown
   - Click "Generate"
   - Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### Step 2: Configure Environment Variables

You have two options:

#### Option A: Local Development (.env file)
Create a `.env` file in your project root:
```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-16-character-app-password
ADMIN_EMAIL=Liamseamus1198@gmail.com
SESSION_SECRET=roofing-lead-system-secret-2024
```

#### Option B: Vercel Deployment (Recommended)
1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add these variables:
   - `EMAIL_USER`: your-gmail@gmail.com
   - `EMAIL_PASS`: your-16-character-app-password
   - `ADMIN_EMAIL`: Liamseamus1198@gmail.com
   - `SESSION_SECRET`: roofing-lead-system-secret-2024

### Step 3: Test the Setup

1. **Local Testing**
   ```bash
   npm start
   ```
   Then submit a test lead form

2. **Check Email**
   - Check Liamseamus1198@gmail.com for the test email
   - Check server logs for confirmation

## 📋 Email Format

When a lead is submitted, you'll receive an email with:

**Subject:** 🚨 NEW ROOFING LEAD - Storm Damage Assessment

**Content includes:**
- Contact Information (Name, Email, Phone)
- Property Details (Address, City, Zip, Property Type, Roof Age)
- Insurance & Preferences
- Additional Notes
- Submission timestamp

## 🔍 Troubleshooting

### Email Not Sending?
1. Check Gmail App Password is correct
2. Verify 2-Step Verification is enabled
3. Check server logs for error messages
4. Ensure EMAIL_USER and EMAIL_PASS are set correctly

### Common Issues:
- **"Invalid login"**: Wrong app password
- **"Less secure app"**: Need to use app password, not regular password
- **"Authentication failed"**: Check 2-Step Verification is enabled

## 🚀 Deployment

After setting up environment variables in Vercel:

1. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

2. **Verify Deployment:**
   - Visit your live site
   - Submit a test lead
   - Check Liamseamus1198@gmail.com for the email

## 📊 Monitoring

- **Server Logs**: Check Vercel function logs for email status
- **Health Check**: Visit `/health` endpoint to see configuration status
- **Email Delivery**: Monitor your Gmail inbox for lead notifications

## 🎉 Success Indicators

When properly configured, you should see:
- ✅ Email transporter created successfully
- ✅ Email sent successfully to Liamseamus1198@gmail.com
- 📧 Lead emails arriving in your inbox within seconds

## 📞 Support

If you encounter issues:
1. Check server logs first
2. Verify Gmail app password setup
3. Test with a simple email client first
4. Contact support if needed

---

**Next Steps:**
1. Set up Gmail App Password
2. Configure environment variables in Vercel
3. Deploy and test
4. Monitor lead emails in Liamseamus1198@gmail.com 