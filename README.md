# 🏠 The Roof Consultant - Lead Generation System

A professional lead generation system for storm damage roof inspections, designed to capture and manage leads with urgency-driven messaging and real storm data integration.

## ✨ Features

- **Storm Damage Focus**: Real storm maps and weather data integration
- **Lead Capture**: Comprehensive form with property and insurance details
- **Email Notifications**: Instant alerts for new leads
- **Admin Dashboard**: Lead management and status tracking
- **Mobile Responsive**: Works perfectly on all devices
- **Professional Design**: Clean, trustworthy interface

## 🚀 Quick Start

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm start

# Visit http://localhost:8080
```

### Production Deployment

#### Option 1: Vercel (Recommended)
1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Set Environment Variables** in Vercel dashboard:
   - `EMAIL_USER`: Your Gmail address
   - `EMAIL_PASS`: Your Gmail app password
   - `ADMIN_EMAIL`: Email for lead notifications
   - `SESSION_SECRET`: Random secret string

#### Option 2: Heroku
1. **Create Heroku app**:
   ```bash
   heroku create your-roofing-app
   ```

2. **Set environment variables**:
   ```bash
   heroku config:set EMAIL_USER=your-email@gmail.com
   heroku config:set EMAIL_PASS=your-app-password
   heroku config:set ADMIN_EMAIL=your-email@gmail.com
   heroku config:set SESSION_SECRET=your-secret-key
   ```

3. **Deploy**:
   ```bash
   git push heroku main
   ```

## 📧 Email Setup

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. **Use the app password** in your environment variables

## 🗄️ Database

The system uses SQLite for simplicity:
- `leads.db`: Stores lead information
- `sessions.db`: Stores user sessions
- Both files are created automatically

## 📁 Project Structure

```
roofing-lead-system/
├── public/
│   ├── index.html          # Main landing page
│   ├── admin.html          # Admin dashboard
│   ├── script.js           # Frontend JavaScript
│   ├── styles.css          # Compiled CSS
│   └── images/
│       └── storm-maps/     # Storm map images
├── server.js               # Express server
├── package.json            # Dependencies
├── vercel.json            # Vercel configuration
└── env.example            # Environment variables template
```

## 🎯 Marketing Strategy

### Target Areas
- Sebastian, Vero Beach, Palm Bay, Satellite Beach, Melbourne
- Grant-Valkaria, Barefoot Bay, Fellsmere, Vero Lake Estates

### Advertising Channels
- **Google Ads**: Search and display campaigns
- **Facebook/Instagram**: Targeted local advertising
- **YouTube**: Pre-roll ads on weather content

### Key Messaging
- Storm damage urgency
- Insurance deductible savings ($5,000-$15,000)
- Professional inspection requirement
- Real storm data credibility

## 🔧 Customization

### Storm Maps
1. Place your storm map images in `public/images/storm-maps/`
2. Name them: `storm-map-1.jpg`, `storm-map-2.jpg`, etc.
3. Update titles and data in `script.js`

### Branding
- Update company name in `index.html`
- Modify colors in `styles.css`
- Change contact information in header

## 📊 Analytics

Track your success with:
- **Lead conversion rate**: Target 5-10%
- **Cost per lead**: Target $20-40
- **Inspection to job rate**: Target 30-50%
- **Average job value**: $5,000-$15,000

## 🛡️ Security

- Rate limiting on form submissions
- Input validation and sanitization
- Secure session management
- HTTPS enforcement in production

## 📞 Support

For technical support or customization requests, contact your development team.

---

**Built for The Roof Consultant** - Professional storm damage inspections in Brevard and Indian River Counties. 