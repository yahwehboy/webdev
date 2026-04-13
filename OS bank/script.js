// DOM Elements
const loginScreen = document.getElementById('login-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const loginForm = document.getElementById('login-form');
const transferPopup = document.getElementById('transfer-popup');
const closePopupBtn = document.getElementById('close-popup');
const transferForm = document.getElementById('transfer-form');

// Page elements
const cardsPage = document.getElementById('cards-page');
const localTransferPage = document.getElementById('local-transfer-page');
const internationalTransferPage = document.getElementById('international-transfer-page');

// Sample account data
let accounts = [
    { id: 1, type: 'Checking', number: '**** 4832', balance: 400450.75 },
    { id: 2, type: 'Savings', number: '**** 7291', balance: 800320.00 }
];

// Sample transaction data
let transactions = [
    { id: 11, type: 'expense', description: 'Crypto Debit - Coinbase', from: 'Coinbase Exchange', date: 'Apr 05', amount: 4450.00 },
    { id: 1, type: 'income', description: 'Military Allowance', from: 'Department of War', date: 'Apr 01', amount: 12050.00 },
    { id: 10, type: 'expense', description: 'Walmart - Debit Purchase', from: 'Walmart Supercenter', date: 'Mar 18', amount: 3156.43 },
    { id: 2, type: 'income', description: 'Military Allowance', from: 'Department of War', date: 'Mar 15', amount: 14000.30 },
    { id: 9, type: 'expense', description: 'Gas Bill - Monthly Payment', from: 'City Gas Company', date: 'Feb 12', amount: 540.00 },
    { id: 3, type: 'income', description: 'Military Allowance', from: 'Department of War', date: 'Mar 01', amount: 12050.00 },
    { id: 8, type: 'expense', description: 'Internet Service - Monthly', from: 'Spectrum Communications', date: 'Feb 23', amount: 89.99 },
    { id: 4, type: 'income', description: 'Military Allowance', from: 'Department of War', date: 'Feb 15', amount: 14000.30 },
    { id: 5, type: 'income', description: 'Military Allowance', from: 'Department of War', date: 'Feb 01', amount: 12050.00 },
    { id: 6, type: 'income', description: 'Military Allowance', from: 'Department of War', date: 'Jan 15', amount: 14000.30 },
    { id: 7, type: 'income', description: 'Military Allowance', from: 'Department of War', date: 'Jan 01', amount: 12050.00 }
];

// Embedded credentials
const VALID_USERNAME = 'kelvin';
const VALID_PASSWORD = 'domini002';

// Login functionality
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    // Check credentials
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        // Show code input screen
        showCodeInputScreen();
    } else if (username && password) {
        alert('Invalid username or password');
    } else {
        alert('Please enter both username and password');
    }
});

// Show code input screen
function showCodeInputScreen() {
    const loginContainer = document.querySelector('.login-container');

    loginContainer.innerHTML = `
        <div class="logo">
            <img src="penfed-logo.svg" alt="PENFED Logo" width="150px">
            <p>Enter the access code to continue</p>
        </div>

        <form id="code-form" class="login-form">
            <div class="input-group">
                <label for="access-code">Access Code</label>
                <input type="password" id="access-code" name="access-code" minlength="5" maxlength="6" pattern="[0-9]{5,6}" placeholder="Enter access code" required>
            </div>

            <button type="submit" class="btn-login">Verify Code</button>
        </form>

        <div class="login-footer">
            <p>Need help? Contact support@penfed.com</p>
        </div>
    `;

    // Add code verification event listener
    document.getElementById('code-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const enteredCode = document.getElementById('access-code').value;

        if (enteredCode.length >= 5 && /^\d+$/.test(enteredCode)) {
            // Show dashboard and hide login
            loginScreen.classList.remove('active');
            dashboardScreen.classList.add('active');

            // Load dashboard data
            loadDashboardData();
        } else {
            alert('Invalid access code. Please enter at least 5 digits.');
        }
    });
}

// Load dashboard data
function loadDashboardData() {
    // Update account cards
    updateAccountCards();

    // Update transaction list
    updateTransactionList();
}

// Update account cards
function updateAccountCards() {
    const cardElements = document.querySelectorAll('.card');

    accounts.forEach((account, index) => {
        if(cardElements[index]) {
            const header = cardElements[index].querySelector('.card-header');
            const balanceElement = cardElements[index].querySelector('.card-balance h2');

            header.querySelector('h3').textContent = `${account.type} Account`;
            header.querySelector('.account-number').textContent = account.number;
            balanceElement.textContent = `$${account.balance.toFixed(2)}`;
        }
    });
}

// Update transaction list
function updateTransactionList() {
    const transactionsContainer = document.querySelector('.transactions-list');
    transactionsContainer.innerHTML = '';

    transactions.slice(0, 4).forEach(transaction => {
        const transactionElement = document.createElement('div');
        transactionElement.className = 'transaction-item';

        const isFailed = transaction.status === 'failed';

        transactionElement.innerHTML = `
            <div class="transaction-icon ${transaction.type} ${isFailed ? 'failed' : ''}">${isFailed ? '!' : (transaction.type === 'income' ? '+' : '-')}</div>
            <div class="transaction-details">
                <h4>${transaction.description} ${isFailed ? '<span class="failed-badge">FAILED</span>' : ''}</h4>
                <p>${transaction.from} • ${transaction.date}</p>
            </div>
            <div class="transaction-amount ${transaction.type} ${isFailed ? 'failed' : ''}">${isFailed ? 'FAILED' : (transaction.type === 'income' ? '+' : '-')}$${transaction.amount.toFixed(2)}</div>
        `;

        transactionsContainer.appendChild(transactionElement);
    });
}

// Transfer popup functionality
document.querySelectorAll('.btn-transfer').forEach(button => {
    button.addEventListener('click', function() {
        transferPopup.classList.add('active');
    });
});

closePopupBtn.addEventListener('click', function() {
    transferPopup.classList.remove('active');
});

// Close popup when clicking outside the content
transferPopup.addEventListener('click', function(e) {
    if(e.target === transferPopup) {
        transferPopup.classList.remove('active');
    }
});

// Handle transfer form submission
transferForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const transferType = document.getElementById('transfer-type').value;
    const fromAccount = document.getElementById('from-account').value;
    const toAccount = document.getElementById('to-account').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const reference = document.getElementById('reference').value;

    if(!toAccount || !amount || amount <= 0) {
        alert('Please enter a valid account number and amount');
        return;
    }

    // Find the account being debited
    const accountIndex = accounts.findIndex(acc =>
        (fromAccount === 'checking' && acc.type === 'Checking') ||
        (fromAccount === 'savings' && acc.type === 'Savings')
    );

    if(accountIndex !== -1 && accounts[accountIndex].balance >= amount) {
        // Process the transfer
        accounts[accountIndex].balance -= amount;

        // Add transaction record (FAILED)
        transactions.unshift({
            id: Date.now(),
            type: 'expense',
            description: transferType === 'local' ? 'Local Transfer' : 'International Transfer',
            from: toAccount,
            date: 'Today',
            amount: amount,
            status: 'failed'
        });

        // Update UI
        updateAccountCards();
        updateTransactionList();

        // Show failed message
        alert(`Transfer Failed!\nType: ${transferType}\nTo: ${toAccount}\nAmount: $${amount.toFixed(2)}\n\nReason: Transaction could not be processed. Please contact support.`);

        // Reset form and close popup
        transferForm.reset();
        transferPopup.classList.remove('active');
    } else {
        alert('Transfer Failed: Insufficient funds or invalid account');
    }
});

// Menu toggle functionality
document.getElementById('menu-toggle').addEventListener('click', function(e) {
    e.stopPropagation(); // Prevent closing immediately
    
    // Remove any existing dropdown
    const existingDropdown = document.getElementById('dropdown-menu');
    if(existingDropdown) {
        existingDropdown.remove();
        return;
    }
    
    // Create a dropdown menu with user information
    const menuHTML = `
        <div class="dropdown-menu active" id="dropdown-menu">
            <div class="dropdown-header">
                <div class="user-avatar-large">JS</div>
                <div class="user-info">
                    <h3>John Smith</h3>
                    <p>Premium Member</p>
                </div>
            </div>
            <div class="dropdown-body">
                <div class="menu-item">
                    <span>💳</span>
                    <span>My Accounts</span>
                </div>
                <div class="menu-item">
                    <span>🔒</span>
                    <span>Security Center</span>
                </div>
                <div class="menu-item">
                    <span>⚙️</span>
                    <span>Settings</span>
                </div>
                <div class="menu-item">
                    <span>❓</span>
                    <span>Help & Support</span>
                </div>
                <div class="menu-item logout-btn">
                    <span>🚪</span>
                    <span>Logout</span>
                </div>
            </div>
        </div>
    `;
    
    // Add the new dropdown to the body
    document.body.insertAdjacentHTML('beforeend', menuHTML);
    
    // Position the dropdown near the menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const dropdown = document.getElementById('dropdown-menu');
    const rect = menuToggle.getBoundingClientRect();
    
    dropdown.style.top = `${rect.bottom + window.scrollY}px`;
    dropdown.style.right = `${window.innerWidth - rect.right}px`;
    
    // Close dropdown when clicking outside
    setTimeout(() => {
        const closeDropdown = function(event) {
            if (!dropdown.contains(event.target) && !menuToggle.contains(event.target)) {
                const dropdownToRemove = document.getElementById('dropdown-menu');
                if(dropdownToRemove) {
                    dropdownToRemove.remove();
                    document.removeEventListener('click', closeDropdown);
                }
            }
        };
        document.addEventListener('click', closeDropdown);
    }, 10);
});

// Navigation functionality
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(navItem => {
            navItem.classList.remove('active');
        });

        // Add active class to clicked item
        this.classList.add('active');

        // In a real app, this would navigate to the selected section
        const navText = this.querySelector('.nav-text').textContent;

        // Navigate to appropriate section
        switch(navText.toLowerCase()) {
            case 'home':
                // Already on home/dashboard
                showDashboard();
                break;
            case 'cards':
                showCardsPage();
                break;
            case 'transfer':
                showTransferPage();
                break;
            case 'history':
                showHistoryPage();
                break;
            case 'profile':
                // Return to dashboard instead of showing profile
                showDashboard();
                break;
        }
    });
});

// Show dashboard
function showDashboard() {
    document.querySelector('.main-content').style.display = 'block';
    cardsPage.classList.remove('active');
    localTransferPage.classList.remove('active');
    internationalTransferPage.classList.remove('active');
}

// Show cards page
function showCardsPage() {
    document.querySelector('.main-content').style.display = 'none';
    cardsPage.classList.add('active');
    localTransferPage.classList.remove('active');
    internationalTransferPage.classList.remove('active');
}

// Show transfer page
function showTransferPage() {
    document.querySelector('.main-content').style.display = 'none';
    cardsPage.classList.remove('active');
    localTransferPage.classList.add('active');
    internationalTransferPage.classList.remove('active');

    // Reset form
    document.getElementById('local-transfer-form')?.reset();
}

// Show international transfer page
function showInternationalTransferPage() {
    document.querySelector('.main-content').style.display = 'none';
    cardsPage.classList.remove('active');
    localTransferPage.classList.remove('active');
    internationalTransferPage.classList.add('active');

    // Reset form
    document.getElementById('international-transfer-form')?.reset();
}

// Show history page
function showHistoryPage() {
    // Create a modal or new view for full transaction history
    const historyHTML = `
        <div class="popup-overlay active" id="history-popup">
            <div class="popup-content" style="max-width: 90%; max-height: 80vh;">
                <div class="popup-header">
                    <h3>Transaction History</h3>
                    <span class="close-btn" onclick="document.getElementById('history-popup').remove()">&times;</span>
                </div>
                <div class="transactions-list" style="padding: 20px; max-height: 60vh; overflow-y: auto;">
                    ${transactions.map(transaction => `
                        <div class="transaction-item">
                            <div class="transaction-icon ${transaction.type}">${transaction.type === 'income' ? '+' : '-'}</div>
                            <div class="transaction-details">
                                <h4>${transaction.description}</h4>
                                <p>${transaction.from} • ${transaction.date}</p>
                            </div>
                            <div class="transaction-amount ${transaction.type}">${transaction.type === 'income' ? '+' : '-'}$${transaction.amount.toFixed(2)}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    // Add the history popup to the body
    document.body.insertAdjacentHTML('beforeend', historyHTML);
}

// Action items functionality
document.querySelectorAll('.action-item').forEach(item => {
    item.addEventListener('click', function() {
        const actionText = this.querySelector('span').textContent;

        switch(actionText.toLowerCase()) {
            case 'cards':
                showCardsPage();
                break;
            case 'transfers':
                showTransferPage();
                break;
            case 'investments':
                alert('Opening Investments section');
                break;
            case 'offers':
                alert('Opening Special Offers section');
                break;
        }
    });
});

// View all transactions
document.querySelector('.view-all').addEventListener('click', function(e) {
    e.preventDefault();
    showHistoryPage();
});

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // By default, show login screen
    loginScreen.classList.add('active');
    dashboardScreen.classList.remove('active');

    // Set up event listeners for the new transfer forms
    setupTransferForms();
});

// Set up transfer forms
function setupTransferForms() {
    // Local transfer form
    const localTransferForm = document.querySelector('#local-transfer-page form');
    if(localTransferForm) {
        localTransferForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const fromAccount = document.getElementById('local-from-account').value;
            const toAccount = document.getElementById('local-to-account').value;
            const recipientName = document.getElementById('local-recipient-name').value;
            const amount = parseFloat(document.getElementById('local-amount').value);
            const reference = document.getElementById('local-reference').value;

            if(!toAccount || !recipientName || !amount || amount <= 0) {
                alert('Please fill in all required fields');
                return;
            }

            // Find the account being debited
            const accountIndex = accounts.findIndex(acc =>
                (fromAccount === 'checking' && acc.type === 'Checking') ||
                (fromAccount === 'savings' && acc.type === 'Savings')
            );

            if(accountIndex !== -1 && accounts[accountIndex].balance >= amount) {
                // Process the transfer
                accounts[accountIndex].balance -= amount;

                // Add transaction record (FAILED)
                transactions.unshift({
                    id: Date.now(),
                    type: 'expense',
                    description: 'Local Transfer',
                    from: recipientName,
                    date: 'Today',
                    amount: amount,
                    status: 'failed'
                });

                // Update UI
                updateAccountCards();
                updateTransactionList();

                // Show failed message
                alert(`Local Transfer Failed!\nTo: ${recipientName}\nAmount: $${amount.toFixed(2)}\n\nReason: Transaction could not be processed. Please contact support.`);

                // Reset form
                localTransferForm.reset();

                // Return to dashboard
                showDashboard();
            } else {
                alert('Transfer Failed: Insufficient funds or invalid account');
            }
        });
    }

    // International transfer form
    const internationalTransferForm = document.querySelector('#international-transfer-page form');
    if(internationalTransferForm) {
        internationalTransferForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const fromAccount = document.getElementById('int-from-account').value;
            const country = document.getElementById('int-country').value;
            const beneficiaryName = document.getElementById('int-beneficiary-name').value;
            const beneficiaryAccount = document.getElementById('int-beneficiary-account').value;
            const amount = parseFloat(document.getElementById('int-amount').value);
            const reference = document.getElementById('int-reference').value;

            if(!beneficiaryName || !beneficiaryAccount || !amount || amount <= 0) {
                alert('Please fill in all required fields');
                return;
            }

            // Find the account being debited
            const accountIndex = accounts.findIndex(acc =>
                (fromAccount === 'checking' && acc.type === 'Checking') ||
                (fromAccount === 'savings' && acc.type === 'Savings')
            );

            // Calculate fees (for demo purposes)
            const transferFee = 15.00;
            const totalAmount = amount + transferFee;

            if(accountIndex !== -1 && accounts[accountIndex].balance >= totalAmount) {
                // Process the transfer
                accounts[accountIndex].balance -= totalAmount;

                // Add transaction record (FAILED)
                transactions.unshift({
                    id: Date.now(),
                    type: 'expense',
                    description: `International Transfer to ${country}`,
                    from: beneficiaryName,
                    date: 'Today',
                    amount: totalAmount,
                    status: 'failed'
                });

                // Update UI
                updateAccountCards();
                updateTransactionList();

                // Show failed message
                alert(`International Transfer Failed!\nTo: ${beneficiaryName}\nCountry: ${country}\nAmount: $${amount.toFixed(2)}\nFees: $${transferFee.toFixed(2)}\nTotal: $${totalAmount.toFixed(2)}\n\nReason: Transaction could not be processed. Please contact support.`);

                // Reset form
                internationalTransferForm.reset();

                // Return to dashboard
                showDashboard();
            } else {
                alert('Transfer Failed: Insufficient funds or invalid account');
            }
        });
    }
}