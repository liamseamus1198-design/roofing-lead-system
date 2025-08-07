const express = require('express');
const session = require('express-session');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Environment variables
const EMAIL_USER = process.env.EMAIL_USER || 'fallback@email.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'fallback-password';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@thestormprofessional.com';
const SESSION_SECRET = process.env.SESSION_SECRET || 'your-secret-key-here';

// Simple in-memory storage (will persist during serverless function lifetime)
let leads = [];
let leadCounter = 1;

// Enhanced email transporter setup
let transporter;
try {
    if (EMAIL_USER !== 'fallback@email.com' && EMAIL_PASS !== 'fallback-password') {
        transporter = nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS
            }
        });
        console.log('✅ Email transporter created successfully');
    } else {
        console.log('📧 Email Status: Using Fallback');
    }
} catch (error) {
    console.log('⚠️ Email setup failed:', error.message);
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

// Root route handler
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Enhanced lead submission with simple storage
app.post('/api/leads', async (req, res) => {
    try {
        const { 
            name, 
            email, 
            phone, 
            zip, 
            address, 
            city, 
            property_type, 
            roof_age, 
            insurance_company, 
            preferred_contact, 
            urgency_level, 
            notes 
        } = req.body;
        
        // Validation
        if (!name || !email || !phone || !zip) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields' 
            });
        }

        // Create lead object
        const lead = {
            id: leadCounter++,
            name,
            email,
            phone,
            zip_code: zip,
            address: address || null,
            city: city || null,
            property_type: property_type || null,
            roof_age: roof_age || null,
            insurance_company: insurance_company || null,
            preferred_contact: preferred_contact || 'Phone',
            urgency_level: urgency_level || null,
            notes: notes || null,
            status: 'new',
            created_at: new Date().toISOString()
        };

        // Save to in-memory storage
        leads.unshift(lead); // Add to beginning of array
        console.log('✅ Lead saved to memory, ID:', lead.id);

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
                    <p><strong>Zip Code:</strong> ${zip}</p>
                    <p><strong>Address:</strong> ${address || 'Not provided'}</p>
                    <p><strong>City:</strong> ${city || 'Not provided'}</p>
                    <p><strong>Property Type:</strong> ${property_type || 'Not provided'}</p>
                    <p><strong>Roof Age:</strong> ${roof_age || 'Not provided'}</p>
                    <p><strong>Insurance Company:</strong> ${insurance_company || 'Not provided'}</p>
                    <p><strong>Preferred Contact:</strong> ${preferred_contact || 'Phone'}</p>
                    <p><strong>Urgency Level:</strong> ${urgency_level || 'Not specified'}</p>
                    <p><strong>Additional Notes:</strong> ${notes || 'None'}</p>
                    <hr>
                    <p><em>Lead submitted from The Storm Professional website</em></p>
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

// Enhanced admin API with simple storage
app.get('/api/admin/leads', async (req, res) => {
    try {
        res.json({ success: true, leads: leads });
    } catch (error) {
        console.log('⚠️ Query failed:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Database error' 
        });
    }
});

// Enhanced status update with simple storage
app.put('/api/admin/leads/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const lead = leads.find(l => l.id == id);
        if (!lead) {
            return res.status(404).json({ 
                success: false, 
                message: 'Lead not found' 
            });
        }

        lead.status = status;
        res.json({ 
            success: true, 
            message: 'Status updated successfully' 
        });
    } catch (error) {
        console.log('⚠️ Status update failed:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Update failed' 
        });
    }
});

// Test endpoint to check storage and leads
app.get('/api/test-leads', async (req, res) => {
    try {
        res.json({
            success: true,
            message: 'Simple storage query successful',
            count: leads.length,
            leads: leads
        });
    } catch (error) {
        res.json({
            success: false,
            message: 'Storage error',
            error: error.message,
            leads: null
        });
    }
});

// Health check endpoint for deployment monitoring
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        emailConfigured: EMAIL_USER !== 'fallback@email.com',
        storageType: 'in-memory',
        leadCount: leads.length,
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

// Start server
app.listen(PORT, () => {
    console.log('🔧 Environment Check:');
    console.log('📧 Email User:', EMAIL_USER !== 'fallback@email.com' ? '✅ Set' : '❌ Not Set');
    console.log('🔑 Email Pass:', EMAIL_PASS !== 'fallback-password' ? '✅ Set' : '❌ Not Set');
    console.log('👤 Admin Email:', ADMIN_EMAIL !== 'admin@thestormprofessional.com' ? '✅ Set' : '❌ Not Set');
    console.log('🔐 Session Secret:', SESSION_SECRET !== 'your-secret-key-here' ? '✅ Set' : '❌ Not Set');
    
    if (transporter) {
        console.log('✅ Email transporter created successfully');
    }
    
    console.log('🚀 The Storm Professional server is running!');
    console.log('📍 Server URL: http://localhost:' + PORT);
    console.log('🔧 Environment:', process.env.NODE_ENV || 'development');
    console.log('📧 Email Status:', EMAIL_USER !== 'fallback@email.com' ? 'Configured' : 'Using Fallback');
    console.log('💾 Storage Type: In-Memory (Simple)');
    console.log('✅ Ready to capture leads!');
}); 