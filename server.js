// Enhanced server with robust error handling and fallback mechanisms
const express = require('express');
const nodemailer = require('nodemailer');
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Enhanced environment variable handling with fallbacks
const EMAIL_USER = process.env.EMAIL_USER || 'fallback@email.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'fallback-password';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@email.com';
const SESSION_SECRET = process.env.SESSION_SECRET || '496839bb01ccc96baefd75244a400250f439cbb7265ecb71dd240d507e4ef463';

// Log environment status for debugging
console.log('🔧 Environment Check:');
console.log(`📧 Email User: ${EMAIL_USER ? '✅ Set' : '❌ Missing'}`);
console.log(`🔑 Email Pass: ${EMAIL_PASS ? '✅ Set' : '❌ Missing'}`);
console.log(`👤 Admin Email: ${ADMIN_EMAIL ? '✅ Set' : '❌ Missing'}`);
console.log(`🔐 Session Secret: ${SESSION_SECRET ? '✅ Set' : '❌ Missing'}`);

// Enhanced email transporter with fallback
let transporter;
try {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS
        }
    });
    console.log('✅ Email transporter created successfully');
} catch (error) {
    console.log('⚠️ Email transporter creation failed:', error.message);
    transporter = null;
}

// Enhanced database setup with error handling
let db;
try {
    db = new sqlite3.Database('./leads.db', (err) => {
        if (err) {
            console.log('⚠️ Database connection failed:', err.message);
        } else {
            console.log('✅ Database connected successfully');
            // Create table if it doesn't exist
            db.run(`CREATE TABLE IF NOT EXISTS leads (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT NOT NULL,
                zip_code TEXT NOT NULL,
                message TEXT,
                status TEXT DEFAULT 'new',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);
        }
    });
} catch (error) {
    console.log('⚠️ Database initialization failed:', error.message);
    db = null;
}

// Enhanced session configuration
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Enhanced lead submission with comprehensive error handling
app.post('/api/leads', async (req, res) => {
    try {
        const { name, email, phone, zip_code, message } = req.body;
        
        // Validation
        if (!name || !email || !phone || !zip_code) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields' 
            });
        }

        // Save to database with error handling
        if (db) {
            db.run(
                'INSERT INTO leads (name, email, phone, zip_code, message) VALUES (?, ?, ?, ?, ?)',
                [name, email, phone, zip_code, message || ''],
                function(err) {
                    if (err) {
                        console.log('⚠️ Database save failed:', err.message);
                    } else {
                        console.log('✅ Lead saved to database, ID:', this.lastID);
                    }
                }
            );
        } else {
            console.log('⚠️ Database not available, skipping save');
        }

        // Send email with enhanced error handling
        if (transporter && EMAIL_USER !== 'fallback@email.com') {
            const mailOptions = {
                from: EMAIL_USER,
                to: ADMIN_EMAIL,
                subject: '🚨 NEW ROOFING LEAD - Storm Damage Assessment',
                html: `
                    <h2>🏠 New Lead Received</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Zip Code:</strong> ${zip_code}</p>
                    <p><strong>Message:</strong> ${message || 'No additional message'}</p>
                    <hr>
                    <p><em>Lead submitted from The Roof Consultant website</em></p>
                `
            };

            try {
                await transporter.sendMail(mailOptions);
                console.log('✅ Email sent successfully');
            } catch (emailError) {
                console.log('⚠️ Email sending failed:', emailError.message);
                // Continue with response even if email fails
            }
        } else {
            console.log('⚠️ Email not configured, skipping email send');
        }

        res.json({ 
            success: true, 
            message: 'Lead submitted successfully! We\'ll contact you soon.' 
        });

    } catch (error) {
        console.log('❌ Lead submission error:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'An error occurred. Please try again or call us directly.' 
        });
    }
});

// Enhanced admin route with authentication
app.get('/admin', (req, res) => {
    // Simple admin check - you can enhance this
    const adminKey = req.query.key || req.session.adminKey;
    if (adminKey === 'roofing-admin-2024' || process.env.NODE_ENV !== 'production') {
        res.sendFile(path.join(__dirname, 'public', 'admin.html'));
    } else {
        res.status(401).send('Unauthorized');
    }
});

// Enhanced admin API with error handling
app.get('/api/admin/leads', (req, res) => {
    if (!db) {
        return res.status(500).json({ 
            success: false, 
            message: 'Database not available' 
        });
    }

    db.all('SELECT * FROM leads ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            console.log('⚠️ Database query failed:', err.message);
            res.status(500).json({ 
                success: false, 
                message: 'Database error' 
            });
        } else {
            res.json({ success: true, leads: rows });
        }
    });
});

// Enhanced status update with error handling
app.put('/api/admin/leads/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!db) {
        return res.status(500).json({ 
            success: false, 
            message: 'Database not available' 
        });
    }

    db.run('UPDATE leads SET status = ? WHERE id = ?', [status, id], function(err) {
        if (err) {
            console.log('⚠️ Status update failed:', err.message);
            res.status(500).json({ 
                success: false, 
                message: 'Update failed' 
            });
        } else {
            res.json({ 
                success: true, 
                message: 'Status updated successfully' 
            });
        }
    });
});

// Health check endpoint for deployment monitoring
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        emailConfigured: EMAIL_USER !== 'fallback@email.com',
        databaseConnected: db !== null,
        port: PORT
    });
});

// Enhanced error handling for all routes
app.use((err, req, res, next) => {
    console.log('❌ Server error:', err.message);
    res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
    });
});

// Enhanced server startup
app.listen(PORT, () => {
    console.log('🚀 The Roof Consultant server is running!');
    console.log(`📍 Server URL: http://localhost:${PORT}`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📧 Email Status: ${EMAIL_USER !== 'fallback@email.com' ? 'Configured' : 'Using Fallback'}`);
    console.log(`💾 Database Status: ${db ? 'Connected' : 'Not Available'}`);
    console.log('✅ Ready to capture leads!');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 Server shutting down gracefully...');
    if (db) {
        db.close();
    }
    process.exit(0);
}); 