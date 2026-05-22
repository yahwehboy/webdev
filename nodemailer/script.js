document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('emailForm');
    const previewBtn = document.getElementById('previewBtn');
    const sendBtn = document.getElementById('sendBtn');
    const previewModal = document.getElementById('previewModal');
    const previewContent = document.getElementById('previewContent');
    const closeBtn = document.querySelector('.close');
    const logSection = document.getElementById('logSection');
    const logOutput = document.getElementById('logOutput');
    const smtpPreset = document.getElementById('smtpPreset');

    // SMTP Presets Configuration
    const smtpPresets = {
        custom: {
            host: '',
            port: '587',
            secure: 'false'
        },
        gmail: {
            host: 'smtp.gmail.com',
            port: '465',
            secure: 'true'
        },
        prospectortech: {
            host: 'smtp.zoho.com', // Zoho Mail SMTP server
            port: '587',
            secure: 'false'
        },
        outlook: {
            host: 'smtp-mail.outlook.com',
            port: '587',
            secure: 'false'
        },
        yahoo: {
            host: 'smtp.mail.yahoo.com',
            port: '465',
            secure: 'true'
        }
    };

    // Load recipients from file on page load
    loadRecipients();

    // SMTP Preset Change Handler
    smtpPreset.addEventListener('change', function() {
        const selected = this.value;
        if (selected !== 'custom') {
            const config = smtpPresets[selected];
            document.getElementById('smtpHost').value = config.host;
            document.getElementById('smtpPort').value = config.port;
            document.getElementById('smtpSecure').value = config.secure;
            
            // Auto-fill from address based on preset
            if (selected === 'gmail') {
                document.getElementById('smtpUser').value = 'omotayoolaolekan01@gmail.com';
                document.getElementById('fromAddress').value = 'omotayoolaolekan01@gmail.com';
            } else if (selected === 'prospectortech') {
                document.getElementById('smtpUser').value = 'cathiesoto@manna-usa.com';
                document.getElementById('fromAddress').value = 'cathiesoto@manna-usa.com';
            } else if (selected === 'outlook') {
                document.getElementById('smtpUser').value = '';
                document.getElementById('fromAddress').value = '';
            } else if (selected === 'yahoo') {
                document.getElementById('smtpUser').value = '';
                document.getElementById('fromAddress').value = '';
            }
        }
    });

    // Preview button
    previewBtn.addEventListener('click', function() {
        const htmlBody = document.getElementById('htmlBody').value;
        const subject = document.getElementById('subject').value;

        previewContent.innerHTML = `
            <h3 style="color: #667eea; margin-bottom: 10px;">Subject: ${escapeHtml(subject)}</h3>
            <div style="border-top: 1px solid #ddd; padding-top: 15px;">
                ${htmlBody}
            </div>
        `;
        previewModal.style.display = 'flex';
    });

    // Close modal
    closeBtn.addEventListener('click', function() {
        previewModal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === previewModal) {
            previewModal.style.display = 'none';
        }
    });

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validate recipients
        const recipientsValue = document.getElementById('recipients').value;
        const recipientList = recipientsValue.split('\n').map(r => r.trim()).filter(r => r);
        if (recipientList.length === 0) {
            alert('Please add at least one recipient');
            return;
        }

        // Disable send button
        sendBtn.disabled = true;
        sendBtn.textContent = 'Sending...';

        // Show log section
        logSection.style.display = 'block';
        logOutput.innerHTML = '';
        addLogEntry('Starting email send process...', 'info');

        // Use FormData for file uploads
        const formData = new FormData();
        formData.append('smtpHost', document.getElementById('smtpHost').value);
        formData.append('smtpPort', document.getElementById('smtpPort').value);
        formData.append('smtpSecure', document.getElementById('smtpSecure').value === 'true');
        formData.append('smtpUser', document.getElementById('smtpUser').value);
        formData.append('smtpPass', document.getElementById('smtpPass').value);
        formData.append('senderName', document.getElementById('senderName').value);
        formData.append('fromAddress', document.getElementById('fromAddress').value);
        formData.append('subject', document.getElementById('subject').value);
        formData.append('recipients', recipientsValue);
        formData.append('htmlBody', document.getElementById('htmlBody').value);

        // Add attachments
        const attachmentsInput = document.getElementById('attachments');
        if (attachmentsInput.files.length > 0) {
            for (let i = 0; i < attachmentsInput.files.length; i++) {
                formData.append('attachments', attachmentsInput.files[i]);
            }
            addLogEntry(`Attaching ${attachmentsInput.files.length} file(s)...`, 'info');
        }

        try {
            const response = await fetch('/send-email', {
                method: 'POST',
                body: formData
                // Don't set Content-Type header - browser will set it with boundary for FormData
            });

            // Check if response is OK before parsing
            if (!response.ok) {
                const errorText = await response.text();
                let errorMsg = `HTTP Error ${response.status}`;
                try {
                    const errorJson = JSON.parse(errorText);
                    errorMsg = errorJson.error || errorMsg;
                } catch (e) {
                    if (errorText) errorMsg = errorText;
                }
                throw new Error(errorMsg);
            }

            // Get response text first to debug empty responses
            const responseText = await response.text();
            if (!responseText) {
                throw new Error('Empty response from server');
            }

            const result = JSON.parse(responseText);
            result.logs.forEach(log => addLogEntry(log.message, log.type));

        } catch (error) {
            addLogEntry(`Error: ${error.message}`, 'error');
            console.error('Send error:', error);
        } finally {
            sendBtn.disabled = false;
            sendBtn.textContent = 'Send Emails';
        }
    });

    function addLogEntry(message, type = 'info') {
        const entry = document.createElement('div');
        entry.className = `log-entry log-${type}`;
        entry.textContent = message;
        logOutput.appendChild(entry);
        logOutput.scrollTop = logOutput.scrollHeight;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    async function loadRecipients() {
        try {
            const response = await fetch('/recipients');
            if (!response.ok) {
                console.error('Failed to load recipients:', response.status);
                return;
            }
            const responseText = await response.text();
            if (!responseText) {
                console.warn('Empty recipients response');
                return;
            }
            const data = JSON.parse(responseText);
            document.getElementById('recipients').value = data.recipients.join('\n');
        } catch (error) {
            console.error('Could not load recipients:', error);
        }
    }
});
