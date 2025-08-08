// Test script to verify email functionality
const nodemailer = require('nodemailer');

// Email configuration
const EMAIL_USER = process.env.EMAIL_USER || 'fallback@email.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'fallback-password';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'Liamseamus1198@gmail.com';

console.log('🧪 Testing Email Configuration...');
console.log('📧 Email User:', EMAIL_USER);
console.log('👤 Admin Email:', ADMIN_EMAIL);
console.log('🔑 Email Pass:', EMAIL_PASS ? '✅ Set' : '❌ Missing');

// Test email transporter
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
    console.log('❌ Email transporter creation failed:', error.message);
    process.exit(1);
}

// Test email content
const testEmailContent = `
🧪 TEST EMAIL - Email Configuration Working

This is a test email to verify that your email configuration is working correctly.

📋 Test Lead Data:
Name: Test User
Email: test@example.com
Phone: (555) 123-4567
Address: 123 Test Street
City: Test City
Zip: 12345

📅 Test Date: ${new Date().toLocaleString()}

If you receive this email, your email configuration is working correctly!
`;

// Send test email
async function sendTestEmail() {
    try {
        const mailOptions = {
            from: EMAIL_USER,
            to: ADMIN_EMAIL,
            subject: '🧪 TEST - Email Configuration Working',
            html: `
                <h2>🧪 Test Email - Email Configuration Working</h2>
                <p>This is a test email to verify that your email configuration is working correctly.</p>
                
                <h3>📋 Test Lead Data:</h3>
                <p><strong>Name:</strong> Test User</p>
                <p><strong>Email:</strong> test@example.com</p>
                <p><strong>Phone:</strong> (555) 123-4567</p>
                <p><strong>Address:</strong> 123 Test Street</p>
                <p><strong>City:</strong> Test City</p>
                <p><strong>Zip:</strong> 12345</p>
                
                <p><strong>📅 Test Date:</strong> ${new Date().toLocaleString()}</p>
                
                <hr>
                <p><em>If you receive this email, your email configuration is working correctly!</em></p>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('✅ Test email sent successfully to', ADMIN_EMAIL);
        console.log('🎉 Email configuration is working correctly!');
        
    } catch (error) {
        console.log('❌ Test email failed:', error.message);
        console.log('🔧 Please check your Gmail app password configuration');
    }
}

// Run the test
sendTestEmail(); 