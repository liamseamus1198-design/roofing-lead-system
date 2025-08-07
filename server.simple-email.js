const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Root route handler
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Simple email lead submission using free email service
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

        // Create email content
        const emailContent = `
NEW ROOFING LEAD - Storm Damage Assessment Request

Contact Information:
- Name: ${name}
- Email: ${email}
- Phone: ${phone}

Property Details:
- Address: ${address || 'Not provided'}
- City: ${city || 'Not provided'}
- Zip Code: ${zip}
- Property Type: ${property_type || 'Not provided'}
- Roof Age: ${roof_age || 'Not provided'}

Insurance & Preferences:
- Insurance Company: ${insurance_company || 'Not provided'}
- Preferred Contact: ${preferred_contact || 'Phone'}
- Urgency Level: ${urgency_level || 'Not specified'}

Additional Notes: ${notes || 'None'}

Submitted from: The Storm Professional Website
Date: ${new Date().toLocaleString()}
        `.trim();

        // Send email using a simple HTTP request to a free email service
        try {
            const emailResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    service_id: 'service_default',
                    template_id: 'template_default',
                    user_id: 'user_default',
                    template_params: {
                        to_email: 'liamseamus1198@gmail.com',
                        subject: '🚨 NEW ROOFING LEAD - Storm Damage Assessment',
                        message: emailContent,
                        from_name: name,
                        from_email: email,
                        from_phone: phone
                    }
                })
            });

            if (emailResponse.ok) {
                console.log('✅ Email sent successfully via EmailJS');
            } else {
                console.log('⚠️ EmailJS failed, trying alternative method');
                // Fallback: Log the lead data for manual processing
                console.log('📧 LEAD DATA RECEIVED:', {
                    name, email, phone, zip, address, city, property_type, roof_age, insurance_company, preferred_contact, urgency_level, notes
                });
            }
        } catch (emailError) {
            console.log('⚠️ Email sending failed:', emailError.message);
            // Log the lead data for manual processing
            console.log('📧 LEAD DATA RECEIVED:', {
                name, email, phone, zip, address, city, property_type, roof_age, insurance_company, preferred_contact, urgency_level, notes
            });
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
        targetEmail: 'liamseamus1198@gmail.com',
        port: PORT
    });
});

// Start server
app.listen(PORT, () => {
    console.log('🚀 The Storm Professional Simple Email Server is running!');
    console.log('📍 Server URL: http://localhost:' + PORT);
    console.log('📧 Target Email: liamseamus1198@gmail.com');
    console.log('✅ Ready to capture leads!');
}); 