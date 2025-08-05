const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const nodemailer = require('nodemailer');
const path = require('path');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Session configuration
app.use(session({
  store: new SQLiteStore({
    db: 'sessions.db',
    dir: './'
  }),
  secret: 'roofing-lead-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// Database setup
const db = new sqlite3.Database('leads.db');

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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Email configuration (you'll need to set up your email credentials)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
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

  const stmt = db.prepare(`
    INSERT INTO leads (name, email, phone, address, city, zip_code, property_type, 
                      roof_age, insurance_company, preferred_contact, urgency_level, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run([name, email, phone, address, city, zip_code, property_type,
           roof_age, insurance_company, preferred_contact, urgency_level, notes], function(err) {
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
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Address:</strong> ${address}</p>
        <p><strong>City:</strong> ${city}</p>
        <p><strong>Zip Code:</strong> ${zip_code}</p>
        <p><strong>Property Type:</strong> ${property_type}</p>
        <p><strong>Roof Age:</strong> ${roof_age}</p>
        <p><strong>Insurance Company:</strong> ${insurance_company}</p>
        <p><strong>Preferred Contact:</strong> ${preferred_contact}</p>
        <p><strong>Urgency Level:</strong> ${urgency_level}</p>
        <p><strong>Notes:</strong> ${notes}</p>
        <p><strong>Lead ID:</strong> ${this.lastID}</p>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email error:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

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

// Start server
app.listen(PORT, () => {
  console.log(`Roofing Lead System running on http://localhost:${PORT}`);
  console.log(`Admin panel available at http://localhost:${PORT}/admin`);
}); 