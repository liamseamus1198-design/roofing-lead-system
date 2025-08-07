const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Email configuration - using Gmail
const EMAIL_USER = process.env.EMAIL_USER || 'your-email@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'your-app-password';
const ADMIN_EMAIL = 'liamseamus1198@gmail.com'; // Liam's email

// Create transporter
let transporter;
try {
    if (EMAIL_USER !== 'your-email@gmail.com' && EMAIL_PASS !== 'your-app-password') {
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Root route handler
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Direct email lead submission
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

        // Send email directly to Liam
        if (transporter) {
            const mailOptions = {
                from: EMAIL_USER,
                to: ADMIN_EMAIL,
                subject: '🚨 NEW ROOFING LEAD - Storm Damage Assessment',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
                            <h1 style="margin: 0; font-size: 24px;">🏠 NEW ROOFING LEAD</h1>
                            <p style="margin: 10px 0 0 0; opacity: 0.9;">Storm Damage Assessment Request</p>
                        </div>
                        
                        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                            <div style="margin-bottom: 20px;">
                                <h2 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Contact Information</h2>
                                <p><strong>Name:</strong> ${name}</p>
                                <p><strong>Email:</strong> ${email}</p>
                                <p><strong>Phone:</strong> ${phone}</p>
                            </div>
                            
                            <div style="margin-bottom: 20px;">
                                <h2 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Property Details</h2>
                                <p><strong>Address:</strong> ${address || 'Not provided'}</p>
                                <p><strong>City:</strong> ${city || 'Not provided'}</p>
                                <p><strong>Zip Code:</strong> ${zip}</p>
                                <p><strong>Property Type:</strong> ${property_type || 'Not provided'}</p>
                                <p><strong>Roof Age:</strong> ${roof_age || 'Not provided'}</p>
                            </div>
                            
                            <div style="margin-bottom: 20px;">
                                <h2 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Insurance & Preferences</h2>
                                <p><strong>Insurance Company:</strong> ${insurance_company || 'Not provided'}</p>
                                <p><strong>Preferred Contact:</strong> ${preferred_contact || 'Phone'}</p>
                                <p><strong>Urgency Level:</strong> ${urgency_level || 'Not specified'}</p>
                            </div>
                            
                            ${notes ? `
                            <div style="margin-bottom: 20px;">
                                <h2 style="color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Additional Notes</h2>
                                <p style="background: #f5f5f5; padding: 15px; border-radius: 5px; border-left: 4px solid #667eea;">${notes}</p>
                            </div>
                            ` : ''}
                            
                            <div style="background: #e8f4fd; padding: 15px; border-radius: 5px; border-left: 4px solid #2196F3; margin-top: 20px;">
                                <p style="margin: 0; color: #1976D2; font-weight: bold;">
                                    <i>📅 Submitted from The Storm Professional Website</i><br>
                                    <i>🕒 Date: ${new Date().toLocaleString()}</i>
                                </p>
                            </div>
                        </div>
                        
                        <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
                            <p>This lead was automatically generated from your website form.</p>
                        </div>
                    </div>
                `
            };

            await transporter.sendMail(mailOptions);
            console.log('✅ Email sent successfully to', ADMIN_EMAIL);
        } else {
            console.log('⚠️ Email not configured, but lead data received');
        }

        res.json({ 
            success: true, 
            message: 'Lead submitted successfully! We\'ll contact you within 30 minutes.' 
        });

    } catch (error) {
        console.log('❌ Lead submission error:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'An error occurred. Please try again or call us directly at 954-531-8040.' 
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        emailConfigured: EMAIL_USER !== 'your-email@gmail.com',
        targetEmail: ADMIN_EMAIL,
        port: PORT
    });
});

// Start server
app.listen(PORT, () => {
    console.log('🔧 Environment Check:');
    console.log('📧 Email User:', EMAIL_USER !== 'your-email@gmail.com' ? '✅ Set' : '❌ Not Set');
    console.log('🔑 Email Pass:', EMAIL_PASS !== 'your-app-password' ? '✅ Set' : '❌ Not Set');
    console.log('👤 Target Email:', ADMIN_EMAIL);
    
    if (transporter) {
        console.log('✅ Email transporter created successfully');
    }
    
    console.log('🚀 The Storm Professional Email Server is running!');
    console.log('📍 Server URL: http://localhost:' + PORT);
    console.log('📧 Email Status:', EMAIL_USER !== 'your-email@gmail.com' ? 'Configured' : 'Using Fallback');
    console.log('✅ Ready to send leads directly to email!');
}); 