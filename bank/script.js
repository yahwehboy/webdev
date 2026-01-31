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
    { id: 1, type: 'Checking', number: '**** 4832', balance: 450.75 },
    { id: 2, type: 'Savings', number: '**** 7291', balance: 6450320.00 }
];

// Sample transaction data
let transactions = [
    { id: 1, type: 'income', description: 'Salary Deposit', from: 'Employer Inc.', date: 'Today', amount: 4500.00 },
    { id: 2, type: 'expense', description: 'Electric Bill', from: 'Power Company', date: 'Yesterday', amount: 120.50 },
    { id: 3, type: 'expense', description: 'Online Shopping', from: 'Amazon', date: 'Dec 28', amount: 89.99 },
    { id: 4, type: 'income', description: 'Walmart Shopping', from: 'Walmart', date: 'Dec 27', amount: 1200.00 },
    { id: 5, type: 'expense', description: 'Restaurant', from: 'Downtown Cafe', date: 'Dec 26', amount: 45.75 },
    { id: 6, type: 'income', description: 'Interest', from: 'Bank Interest', date: 'Dec 25', amount: 12.30 }
];

// Login functionality
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simple validation - in a real app, this would be handled securely on the server
    if(username && password) {
        // Show dashboard and hide login
        loginScreen.classList.remove('active');
        dashboardScreen.classList.add('active');

        // Load dashboard data
        loadDashboardData();
    } else {
        alert('Please enter both username and password');
    }
});

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

        transactionElement.innerHTML = `
            <div class="transaction-icon ${transaction.type}">${transaction.type === 'income' ? '+' : '-'}</div>
            <div class="transaction-details">
                <h4>${transaction.description}</h4>
                <p>${transaction.from} • ${transaction.date}</p>
            </div>
            <div class="transaction-amount ${transaction.type}">${transaction.type === 'income' ? '+' : '-'}$${transaction.amount.toFixed(2)}</div>
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

        // Add transaction record
        transactions.unshift({
            id: Date.now(),
            type: 'expense',
            description: transferType === 'local' ? 'Local Transfer' : 'International Transfer',
            from: toAccount,
            date: 'Today',
            amount: amount
        });

        // Update UI
        updateAccountCards();
        updateTransactionList();

        // Show success message
        alert(`Transfer successful!\nType: ${transferType}\nTo: ${toAccount}\nAmount: $${amount.toFixed(2)}`);

        // Reset form and close popup
        transferForm.reset();
        transferPopup.classList.remove('active');
    } else {
        alert('Insufficient funds or invalid account');
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

                // Add transaction record
                transactions.unshift({
                    id: Date.now(),
                    type: 'expense',
                    description: 'Local Transfer',
                    from: recipientName,
                    date: 'Today',
                    amount: amount
                });

                // Update UI
                updateAccountCards();
                updateTransactionList();

                // Show success message
                alert(`Local transfer successful!\nTo: ${recipientName}\nAmount: $${amount.toFixed(2)}`);

                // Reset form
                localTransferForm.reset();

                // Return to dashboard
                showDashboard();
            } else {
                alert('Insufficient funds or invalid account');
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

                // Add transaction record
                transactions.unshift({
                    id: Date.now(),
                    type: 'expense',
                    description: `International Transfer to ${country}`,
                    from: beneficiaryName,
                    date: 'Today',
                    amount: totalAmount
                });

                // Update UI
                updateAccountCards();
                updateTransactionList();

                // Show success message
                alert(`International transfer successful!\nTo: ${beneficiaryName}\nCountry: ${country}\nAmount: $${amount.toFixed(2)}\nFees: $${transferFee.toFixed(2)}\nTotal: $${totalAmount.toFixed(2)}`);

                // Reset form
                internationalTransferForm.reset();

                // Return to dashboard
                showDashboard();
            } else {
                alert('Insufficient funds or invalid account');
            }
        });
    }
}