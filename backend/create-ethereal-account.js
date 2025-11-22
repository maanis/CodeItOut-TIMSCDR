#!/usr/bin/env node

const nodemailer = require('nodemailer');

/**
 * Generate Ethereal Email Test Account
 * Run: node create-ethereal-account.js
 * 
 * This creates a free test email account from Ethereal
 * Use the credentials in your .env file
 */

async function createTestAccount() {
    console.log('\n🔧 Creating Ethereal Test Email Account...\n');

    try {
        // Create a test account (free, temporary)
        const testAccount = await nodemailer.createTestAccount();

        console.log('✅ Test account created successfully!\n');
        console.log('📧 Email Credentials:\n');
        console.log('═'.repeat(50));
        console.log(`SMTP_USER=${testAccount.user}`);
        console.log(`SMTP_PASSWORD=${testAccount.pass}`);
        console.log('═'.repeat(50));

        console.log('\n📋 Add these to your .env file:\n');
        console.log('SMTP_HOST=smtp.ethereal.email');
        console.log('SMTP_PORT=587');
        console.log(`SMTP_USER=${testAccount.user}`);
        console.log(`SMTP_PASSWORD=${testAccount.pass}`);

        console.log('\n🌐 Email Preview URL:');
        console.log(`https://ethereal.email/messages`);

        console.log('\n💡 How to use:');
        console.log('1. Update your .env file with the credentials above');
        console.log('2. Restart your backend server');
        console.log('3. Send OTP - check preview URL for sent emails');
        console.log('4. Each email preview URL is shown in console logs\n');

        console.log('📖 Documentation:');
        console.log('https://nodemailer.com/smtp/testing/\n');

    } catch (error) {
        console.error('❌ Error creating test account:', error.message);
        process.exit(1);
    }
}

createTestAccount();
