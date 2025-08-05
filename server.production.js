const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const nodemailer = require('nodemailer');
const path = require('path');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "https://www.googletagmanager.com", "https://connect.facebook.net"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Logging
app.use(morgan('combined'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public', {
  maxAge: '1d',
  etag: true
}));

// Session configuration
app.use(session({
  store: new SQLiteStore({
    db: 'sessions.db',
    dir: './'
  }),
  secret: process.env.SESSION_SECRET || 'roofing-lead-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Database setup
const db = new sqlite3.Database(process.env.DATABASE_URL || 'leads.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    property_type TEXT,
    roof_age TEXT,
    insurance_company TEXT,
    preferred_contact TEXT,
    urgency_level TEXT,
    notes TEXT,
    status TEXT DEFAULT 'new',
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_term TEXT,
    utm_content TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Email configuration
const transporter = nodemailer.createTransporter({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// API Routes
app.post('/api/leads', (req, res) => {
  const {
    name, email, phone, address, city, zip_code, property_type,
    roof_age, insurance_company, preferred_contact, urgency_level, notes
  } = req.body;

  // Input validation
  if (!name || !email || !phone || !address || !city || !zip_code) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Phone validation
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  const cleanPhone = phone.replace(/\D/g, '');
  if (!phoneRegex.test(cleanPhone)) {
    return res.status(400).json({ error: 'Invalid phone number' });
  }

  const stmt = db.prepare(`
    INSERT INTO leads (name, email, phone, address, city, zip_code, property_type, 
                      roof_age, insurance_company, preferred_contact, urgency_level, notes,
                      utm_source, utm_medium, utm_campaign, utm_term, utm_content, ip_address, user_agent)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const utmParams = {
    utm_source: req.query.utm_source || req.body.utm_source,
    utm_medium: req.query.utm_medium || req.body.utm_medium,
    utm_campaign: req.query.utm_campaign || req.body.utm_campaign,
    utm_term: req.query.utm_term || req.body.utm_term,
    utm_content: req.query.utm_content || req.body.utm_content
  };

  stmt.run([
    name, email, cleanPhone, address, city, zip_code, property_type,
    roof_age, insurance_company, preferred_contact, urgency_level, notes,
    utmParams.utm_source, utmParams.utm_medium, utmParams.utm_campaign,
    utmParams.utm_term, utmParams.utm_content, req.ip, req.get('User-Agent')
  ], function(err) {
    if (err) {
      console.error('Error saving lead:', err);
      return res.status(500).json({ error: 'Failed to save lead' });
    }

    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: process.env.ADMIN_EMAIL || 'your-email@gmail.com',
      subject: 'NEW ROOFING LEAD - Storm Damage Inspection',
      html: `
        <h2>New Lead Generated!</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${cleanPhone}</p>
        <p><strong>Address:</strong> ${address}</p>
        <p><strong>City:</strong> ${city}</p>
        <p><strong>Zip Code:</strong> ${zip_code}</p>
        <p><strong>Property Type:</strong> ${property_type || 'N/A'}</p>
        <p><strong>Roof Age:</strong> ${roof_age || 'N/A'}</p>
        <p><strong>Insurance Company:</strong> ${insurance_company || 'N/A'}</p>
        <p><strong>Preferred Contact:</strong> ${preferred_contact || 'N/A'}</p>
        <p><strong>Urgency Level:</strong> ${urgency_level || 'N/A'}</p>
        <p><strong>Notes:</strong> ${notes || 'N/A'}</p>
        <p><strong>Lead ID:</strong> ${this.lastID}</p>
        <p><strong>Source:</strong> ${utmParams.utm_source || 'Direct'}</p>
        <p><strong>Campaign:</strong> ${utmParams.utm_campaign || 'N/A'}</p>
        <p><strong>IP Address:</strong> ${req.ip}</p>
        <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email error:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    // Track conversion for analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'lead_submission', {
        'event_category': 'roofing_leads',
        'event_label': city,
        'value': 1
      });
    }

    if (typeof fbq !== 'undefined') {
      fbq('track', 'Lead', {
        content_name: 'Storm Damage Inspection',
        content_category: 'Roofing',
        value: 1,
        currency: 'USD'
      });
    }

    res.json({ success: true, leadId: this.lastID });
  });

  stmt.finalize();
});

app.get('/api/leads', (req, res) => {
  db.all('SELECT * FROM leads ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch leads' });
    }
    res.json(rows);
  });
});

app.put('/api/leads/:id', (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  db.run('UPDATE leads SET status = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [status, notes, id], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update lead' });
      }
      res.json({ success: true });
    });
});

app.delete('/api/leads/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM leads WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete lead' });
    }
    res.json({ success: true });
  });
});

// Analytics endpoint
app.get('/api/analytics', (req, res) => {
  const today = new Date().toDateString();
  
  db.all(`
    SELECT 
      COUNT(*) as total_leads,
      COUNT(CASE WHEN DATE(created_at) = DATE('now') THEN 1 END) as today_leads,
      COUNT(CASE WHEN status IN ('new', 'contacted') THEN 1 END) as pending_leads,
      COUNT(CASE WHEN urgency_level LIKE '%High%' THEN 1 END) as high_urgency,
      COUNT(CASE WHEN utm_source = 'google' THEN 1 END) as google_leads,
      COUNT(CASE WHEN utm_source = 'facebook' THEN 1 END) as facebook_leads,
      COUNT(CASE WHEN utm_source = 'direct' THEN 1 END) as direct_leads
    FROM leads
  `, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch analytics' });
    }
    res.json(rows[0]);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Page not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Roofing Lead System running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Admin panel: http://localhost:${PORT}/admin`);
  console.log(`❤️ Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  db.close();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  db.close();
  process.exit(0);
}); 