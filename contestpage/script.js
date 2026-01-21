// Woods Wear Contest JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize vote counts from localStorage or set to 0
    initializeVoteCounts();
    
    // Handle navbar toggle
    const navbarToggler = document.querySelector('.navbar-toggler');
    if (navbarToggler) {
        navbarToggler.addEventListener('click', function() {
            const navbarCollapse = document.getElementById('navbarHeader');
            if (navbarCollapse) {
                navbarCollapse.classList.toggle('show');
            }
        });
    }
    
    // Handle "Copy Account" button
    const copyAccountBtn = document.querySelector('.btn-warning.my-2');
    if (copyAccountBtn) {
        copyAccountBtn.addEventListener('click', function(e) {
            e.preventDefault();
            copyToClipboard('6504845745');
            showNotification('Account number copied to clipboard!');
        });
    }
    
    // Handle "Share Link" button
    const shareLinkBtn = document.querySelector('.btn-outline-warning.my-2');
    if (shareLinkBtn) {
        shareLinkBtn.addEventListener('click', function(e) {
            e.preventDefault();
            sharePage();
        });
    }
    
    // Handle vote buttons
    const voteButtons = document.querySelectorAll('.btn-outline-warning:not(.my-2)');
    voteButtons.forEach(button => {
        if (button.textContent.trim() === 'Vote') {
            button.addEventListener('click', function() {
                handleVote(this);
            });
        } else if (button.textContent.trim().startsWith('WWC')) {
            button.addEventListener('click', function() {
                copyToClipboard(this.textContent.trim());
                showNotification(`Contest code ${this.textContent.trim()} copied!`);
            });
        }
    });
    
    // Handle "Back to top" link
    const backToTopLink = document.querySelector('a[href="#"]');
    if (backToTopLink) {
        backToTopLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

function initializeVoteCounts() {
    // Initialize vote counts from HTML elements if not in localStorage
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        // Find the contest code button in this card
        const allButtons = card.querySelectorAll('.btn-outline-warning');
        let contestantId = '';

        for (let btn of allButtons) {
            if (btn.textContent.trim().startsWith('WWC')) {
                contestantId = btn.textContent.trim();
                break;
            }
        }

        if (contestantId) {
            // Check if there's no stored value for this contestant
            if (!localStorage.getItem(`votes_${contestantId}`)) {
                // Extract the vote count from the HTML element
                const voteDisplay = card.querySelector('.text-muted');
                if (voteDisplay) {
                    const text = voteDisplay.textContent.trim();
                    // Extract number from text like "7 Votes" or "0 Votes"
                    const voteMatch = text.match(/(\d+)/);
                    if (voteMatch) {
                        const initialVoteCount = parseInt(voteMatch[0]);
                        localStorage.setItem(`votes_${contestantId}`, initialVoteCount.toString());
                    } else {
                        // If no number found, default to 0
                        localStorage.setItem(`votes_${contestantId}`, '0');
                    }
                }
            }
        }
    });

    // Update vote counts on page load
    updateVoteDisplays();
}

function handleVote(voteButton) {
    // Find the parent card to get the contestant ID
    const card = voteButton.closest('.card');
    // Look for the button that contains WWC followed by numbers
    const contestCodeButton = card.querySelector('.btn-outline-warning:not([type="button"])');
    // Filter to find the one that starts with WWC
    const allButtons = card.querySelectorAll('.btn-outline-warning');
    let contestantId = '';

    for (let btn of allButtons) {
        if (btn.textContent.trim().startsWith('WWC')) {
            contestantId = btn.textContent.trim();
            break;
        }
    }

    // Increment vote count
    let currentVotes = parseInt(localStorage.getItem(`votes_${contestantId}`)) || 0;
    currentVotes++;
    localStorage.setItem(`votes_${contestantId}`, currentVotes.toString());

    // Update the vote display for this contestant
    const voteDisplay = card.querySelector('.text-muted');
    if (voteDisplay) {
        voteDisplay.textContent = `${currentVotes} Vote${currentVotes !== 1 ? 's' : ''}`;
    }

    // Show notification
    showNotification(`Vote recorded for ${contestantId}!`);
}

function updateVoteDisplays() {
    // Update all vote displays based on localStorage
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        // Find the contest code button in this card
        const allButtons = card.querySelectorAll('.btn-outline-warning');
        let contestantId = '';

        for (let btn of allButtons) {
            if (btn.textContent.trim().startsWith('WWC')) {
                contestantId = btn.textContent.trim();
                break;
            }
        }

        if (contestantId) {
            const voteCount = localStorage.getItem(`votes_${contestantId}`);
            if (voteCount !== null) {
                const voteDisplay = card.querySelector('.text-muted');
                if (voteDisplay) {
                    const count = parseInt(voteCount);
                    voteDisplay.textContent = `${count} Vote${count !== 1 ? 's' : ''}`;
                }
            }
        }
    });
}

function copyToClipboard(text) {
    // Modern approach using Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).catch(function(err) {
            // Fallback to older method if Clipboard API fails
            fallbackCopyTextToClipboard(text);
        });
    } else {
        // Fallback for older browsers or insecure contexts
        fallbackCopyTextToClipboard(text);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
    } catch (err) {
        console.error('Fallback copy failed', err);
    }
    document.body.removeChild(textArea);
}

function sharePage() {
    // Check if Web Share API is supported
    if (navigator.share) {
        navigator.share({
            title: 'Woods Wear Contest',
            text: 'Check out the Woods Wear Contest and vote for your favorite!',
            url: window.location.href
        }).catch(console.error);
    } else {
        // Fallback: copy link to clipboard
        copyToClipboard(window.location.href);
        showNotification('Contest link copied to clipboard!');
    }
}

function showNotification(message) {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification-toast');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification-toast';
        notification.className = 'toast position-fixed bottom-0 end-0 m-3';
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'assertive');
        notification.setAttribute('aria-atomic', 'true');
        
        const toastBody = document.createElement('div');
        toastBody.className = 'toast-header';
        toastBody.innerHTML = `
            <strong class="me-auto">Woods Wear Contest</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        `;
        
        const toastContent = document.createElement('div');
        toastContent.className = 'toast-body';
        toastContent.textContent = message;
        
        notification.appendChild(toastBody);
        notification.appendChild(toastContent);
        
        document.body.appendChild(notification);
        
        // Initialize Bootstrap Toast
        const bsToast = new bootstrap.Toast(notification, {
            delay: 3000
        });
        
        notification.addEventListener('hidden.bs.toast', function() {
            document.body.removeChild(notification);
        });
    } else {
        // Update existing notification
        notification.querySelector('.toast-body').textContent = message;
    }
    
    // Show the notification
    const bsToast = bootstrap.Toast.getInstance(notification) || new bootstrap.Toast(notification, {
        delay: 3000
    });
    bsToast.show();
}