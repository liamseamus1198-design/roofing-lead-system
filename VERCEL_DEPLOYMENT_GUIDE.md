# 🚀 Vercel Deployment Guide for The Roof Consultant

## 📋 **Environment Variables Setup**

### **Required Variables for Vercel:**

| Variable | Value | Description |
|----------|-------|-------------|
| `EMAIL_USER` | `your-gmail@gmail.com` | Your Gmail address |
| `EMAIL_PASS` | `your-16-char-app-password` | Gmail App Password (NOT regular password) |
| `ADMIN_EMAIL` | `your-admin@gmail.com` | Email for lead notifications |
| `SESSION_SECRET` | `496839bb01ccc96baefd75244a400250f439cbb7265ecb71dd240d507e4ef463` | Security token (already generated) |

### **Optional Variables:**
- `DATABASE_URL` - Leave empty (Vercel handles this)
- `PORT` - Leave as `8080` (Vercel overrides this)

## 🔧 **Step-by-Step Deployment**

### **1. Gmail App Password Setup**

**⚠️ IMPORTANT: You need a Gmail App Password, NOT your regular password!**

1. **Go to**: https://myaccount.google.com/
2. **Click** "Security" in the left sidebar
3. **Enable** "2-Step Verification" if not already enabled
4. **Click** "App passwords" (under 2-Step Verification)
5. **Select** "Mail" from the dropdown
6. **Click** "Generate"
7. **Copy** the 16-character password (e.g., `abcd efgh ijkl mnop`)

### **2. Deploy to Vercel**

1. **Go to**: https://vercel.com/
2. **Sign up/Login** with your GitHub account
3. **Click** "New Project"
4. **Import** repository: `liamseamus1198-design/roofing-lead-system`
5. **Click** "Import"

### **3. Configure Environment Variables**

In the Vercel deployment settings:

1. **Click** "Environment Variables" tab
2. **Add each variable**:

```
EMAIL_USER = your-gmail@gmail.com
EMAIL_PASS = your-16-char-app-password
ADMIN_EMAIL = your-admin@gmail.com
SESSION_SECRET = 496839bb01ccc96baefd75244a400250f439cbb7265ecb71dd240d507e4ef463
```

3. **Select** "Production" and "Preview" environments for each
4. **Click** "Save"

### **4. Deploy Settings**

- **Framework Preset**: Node.js
- **Root Directory**: `./` (default)
- **Build Command**: `npm install` (default)
- **Output Directory**: `public` (default)
- **Install Command**: `npm install` (default)

### **5. Deploy**

1. **Click** "Deploy"
2. **Wait** for deployment to complete
3. **Copy** your live URL (e.g., `https://roofing-lead-system-abc123.vercel.app`)

## ✅ **Post-Deployment Checklist**

- [ ] Website loads correctly
- [ ] Lead form works
- [ ] Email notifications are received
- [ ] Admin panel is accessible
- [ ] Storm maps display properly
- [ ] Mobile responsive design works

## 🔧 **Troubleshooting**

### **Email Not Working?**
- Verify Gmail App Password is correct
- Check 2-Step Verification is enabled
- Ensure EMAIL_USER and EMAIL_PASS match

### **Website Not Loading?**
- Check Vercel deployment logs
- Verify all environment variables are set
- Ensure repository is public

### **Admin Panel Issues?**
- Verify SESSION_SECRET is set correctly
- Check ADMIN_EMAIL is correct
- Clear browser cache

## 📞 **Support**

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test locally first with `npm start`

---

**Your Live URL will be**: `https://your-project-name.vercel.app` 