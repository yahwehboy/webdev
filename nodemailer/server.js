const express = require('express');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 3000;

// Configure multer for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 25 * 1024 * 1024 // 25MB limit per file
    }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes - BEFORE static files
// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Get recipients from file
app.get('/recipients', (req, res) => {
    try {
        const recipientsPath = path.join(__dirname, 'recipients.txt');
        let recipients = [];
        if (fs.existsSync(recipientsPath)) {
            const content = fs.readFileSync(recipientsPath, 'utf-8');
            recipients = content
                .split('\n')
                .map(line => line.trim())
                .filter(line => line);
        }
        res.json({ recipients });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Send emails endpoint with file upload
app.post('/send-email', upload.array('attachments', 10), async (req, res) => {
    const {
        smtpHost,
        smtpPort,
        smtpSecure,
        smtpUser,
        smtpPass,
        senderName,
        fromAddress,
        subject,
        recipients,
        htmlBody
    } = req.body;

    const logs = [];

    try {
        // Validate required fields
        if (!recipients || !htmlBody || !subject) {
            return res.status(400).json({ error: 'Missing required fields', logs });
        }

        // Parse recipients
        const recipientList = recipients.split('\n').map(r => r.trim()).filter(r => r);

        if (recipientList.length === 0) {
            return res.status(400).json({ error: 'No recipients provided', logs });
        }

        // Create transporter with connection pool and timeout settings
        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: parseInt(smtpPort),
            secure: smtpSecure === 'true' || smtpSecure === true,
            auth: {
                user: smtpUser,
                pass: smtpPass
            },
            tls: {
                rejectUnauthorized: false // Allow self-signed certificates
            },
            connectionTimeout: 10000, // 10 second timeout
            socketTimeout: 10000, // 10 second socket timeout
            gssapi: {
                serviceName: 'smtp'
            }
        });

        // Verify connection before sending
        try {
            await transporter.verify();
            logs.push({ message: '✓ SMTP connection verified successfully!', type: 'success' });
        } catch (verifyError) {
            logs.push({ message: `✗ SMTP verification failed: ${verifyError.message}`, type: 'error' });
            throw verifyError;
        }

        logs.push({ message: `Starting to send emails to ${recipientList.length} recipient(s)...`, type: 'info' });

        // Prepare attachments
        const attachments = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                attachments.push({
                    filename: file.originalname,
                    content: file.buffer
                });
            }
            logs.push({ message: `Attached ${req.files.length} file(s)`, type: 'info' });
        }

        // Send individual emails
        for (const toAddress of recipientList) {
            try {
                const mailOptions = {
                    from: senderName ? `"${senderName}" <${fromAddress}>` : fromAddress,
                    to: toAddress,
                    subject: subject,
                    html: htmlBody,
                    attachments: attachments.length > 0 ? attachments : undefined
                };

                await transporter.sendMail(mailOptions);
                logs.push({ message: `✓ Sent to ${toAddress}`, type: 'success' });
                console.log(`Sent to ${toAddress}`);
            } catch (error) {
                logs.push({ message: `✗ Failed to send to ${toAddress}: ${error.message}`, type: 'error' });
                console.error(`Failed to send to ${toAddress}: ${error.message}`);
            }
        }

        logs.push({ message: 'All emails processed!', type: 'info' });
        console.log('All emails sent successfully!');

        res.json({ success: true, logs });
    } catch (error) {
        logs.push({ message: `Failed to send emails: ${error.message}`, type: 'error' });
        console.error(`Failed to send emails: ${error.message}`);
        res.status(500).json({ error: error.message, logs });
    }
});

// Static files - AFTER API routes
app.use(express.static(__dirname));

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Email Sender UI running at http://localhost:${PORT}`);
});
