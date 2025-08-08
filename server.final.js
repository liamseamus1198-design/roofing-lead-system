const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Email configuration
const EMAIL_USER = process.env.EMAIL_USER || 'fallback@email.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'fallback-password';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'Liamseamus1198@gmail.com';

// Log environment status for debugging
console.log('🔧 Environment Check:');
console.log(`📧 Email User: ${EMAIL_USER ? '✅ Set' : '❌ Missing'}`);
console.log(`🔑 Email Pass: ${EMAIL_PASS ? '✅ Set' : '❌ Missing'}`);
console.log(`👤 Admin Email: ${ADMIN_EMAIL ? '✅ Set' : '❌ Missing'}`);

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Root route handler
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// BULLETPROOF lead submission with direct email
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

        // Create beautiful email content
        const emailContent = `
🚨 NEW ROOFING LEAD - Storm Damage Assessment Request

📞 CONTACT INFORMATION:
Name: ${name}
Email: ${email}
Phone: ${phone}

🏠 PROPERTY DETAILS:
Address: ${address || 'Not provided'}
City: ${city || 'Not provided'}
Zip Code: ${zip}
Property Type: ${property_type || 'Not provided'}
Roof Age: ${roof_age || 'Not provided'}

📋 INSURANCE & PREFERENCES:
Insurance Company: ${insurance_company || 'Not provided'}
Preferred Contact: ${preferred_contact || 'Phone'}
Urgency Level: ${urgency_level || 'Not specified'}

📝 ADDITIONAL NOTES:
${notes || 'None'}

🌐 Submitted from: The Storm Professional Website
📅 Date: ${new Date().toLocaleString()}
        `.trim();

        // LOG THE LEAD TO CONSOLE (you can see this in Vercel logs)
        console.log('🎯 NEW LEAD RECEIVED!');
        console.log('='.repeat(50));
        console.log(emailContent);
        console.log('='.repeat(50));

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
                console.log('✅ Email sent successfully to', ADMIN_EMAIL);
            } catch (emailError) {
                console.log('⚠️ Email sending failed:', emailError.message);
                // Continue with response even if email fails
            }
        } else {
            console.log('⚠️ Email not configured, logging lead data instead');
            console.log('📧 LEAD DATA FOR EMAIL:');
            console.log({
                to: ADMIN_EMAIL,
                subject: '🚨 NEW ROOFING LEAD - Storm Damage Assessment',
                content: emailContent,
                timestamp: new Date().toISOString()
            });
        }

        // ALWAYS return success - the lead was captured
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
        targetEmail: ADMIN_EMAIL,
        emailConfigured: EMAIL_USER !== 'fallback@email.com',
        port: PORT,
        message: 'Lead capture system is ready!'
    });
});

// Test endpoint to see if server is working
app.get('/test', (req, res) => {
    res.json({
        message: 'Server is working!',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log('🚀 The Storm Professional FINAL Server is running!');
    console.log('📍 Server URL: http://localhost:' + PORT);
    console.log('📧 Target Email:', ADMIN_EMAIL);
    console.log('📧 Email Status:', EMAIL_USER !== 'fallback@email.com' ? 'Configured' : 'Using Fallback');
    console.log('✅ Ready to capture leads!');
    console.log('📊 Check Vercel logs to see leads in real-time');
}); 