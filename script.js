// Configuration
const NETWORKS = {
    ethereum: {
        name: 'Ethereum',
        symbol: 'ETH',
        apiUrl: 'https://api.etherscan.io/api',
        apiKey: 'YourEtherscanAPIKeyHere',
        chainId: 1,
        priceId: 'ethereum',
        nativeCurrency: 'ETH'
    },
    polygon: {
        name: 'Polygon (Matic)',
        symbol: 'MATIC',
        apiUrl: 'https://api.polygonscan.com/api',
        apiKey: 'YourPolygonScanAPIKeyHere',
        chainId: 137,
        priceId: 'matic-network',
        nativeCurrency: 'MATIC'
    },
    bsc: {
        name: 'Binance Smart Chain',
        symbol: 'BNB',
        apiUrl: 'https://api.bscscan.com/api',
        apiKey: 'YourBscScanAPIKeyHere',
        chainId: 56,
        priceId: 'binancecoin',
        nativeCurrency: 'BNB'
    }
};

let currentNetwork = 'ethereum';
let allTransactions = [];
let filteredTransactions = [];

// DOM Elements
const networkSelect = document.getElementById('networkSelect');
const walletInput = document.getElementById('walletAddress');
const checkBtn = document.getElementById('checkBtn');
const errorEl = document.getElementById('error');
const loadingEl = document.getElementById('loading');
const resultsEl = document.getElementById('results');
const emptyStateEl = document.getElementById('emptyState');
const themeToggle = document.getElementById('themeToggle');
const exportBtn = document.getElementById('exportBtn');
const filterBtn = document.getElementById('filterBtn');
const resetBtn = document.getElementById('resetBtn');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');

// Event Listeners
checkBtn.addEventListener('click', checkWallet);
walletInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkWallet();
});
networkSelect.addEventListener('change', (e) => {
    currentNetwork = e.target.value;
});
themeToggle.addEventListener('click', toggleTheme);
exportBtn.addEventListener('click', exportToCSV);
filterBtn.addEventListener('click', applyFilter);
resetBtn.addEventListener('click', resetFilter);

// Initialize theme
function initTheme() {
    const savedTheme = localStorage.getItem('walletCheckerTheme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    }
}

function toggleTheme() {
    document.documentElement.classList.toggle('dark-mode');
    const isDark = document.documentElement.classList.contains('dark-mode');
    localStorage.setItem('walletCheckerTheme', isDark ? 'dark' : 'light');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
}

async function checkWallet() {
    const address = walletInput.value.trim();
    
    // Validation
    if (!address) {
        showError('Please enter a wallet address');
        return;
    }
    
    if (!address.startsWith('0x') || address.length !== 42) {
        showError('Invalid address. Must start with 0x and be 42 characters long');
        return;
    }
    
    // Clear previous state
    hideError();
    showLoading();
    hideResults();
    allTransactions = [];
    filteredTransactions = [];
    
    try {
        const network = NETWORKS[currentNetwork];
        const balance = await fetchBalance(address);
        allTransactions = await fetchTransactions(address);
        const price = await fetchPrice();
        
        // Display results
        filteredTransactions = [...allTransactions];
        displayResults(address, balance, price);
        showResults();
        updateFilteredCount();
    } catch (error) {
        showError('Error: ' + error.message);
    } finally {
        hideLoading();
    }
}

async function fetchBalance(address) {
    try {
        const network = NETWORKS[currentNetwork];
        const response = await fetch(
            `${network.apiUrl}?module=account&action=balance&address=${address}&tag=latest&apikey=${network.apiKey}`
        );
        const data = await response.json();
        
        if (data.status === '0') {
            throw new Error('Address not found or API error');
        }
        
        // Convert from smallest unit to main unit (Wei to ETH, etc.)
        const balanceInSmallest = data.result;
        const balanceInMainUnit = balanceInSmallest / 1e18;
        
        return balanceInMainUnit;
    } catch (error) {
        throw new Error('Failed to fetch balance: ' + error.message);
    }
}

async function fetchTransactions(address) {
    try {
        const network = NETWORKS[currentNetwork];
        const response = await fetch(
            `${network.apiUrl}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${network.apiKey}`
        );
        const data = await response.json();
        
        if (data.status === '0') {
            return [];
        }
        
        // Process and return transactions
        return data.result.map(tx => ({
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: (tx.value / 1e18).toFixed(6),
            gasPrice: (tx.gasPrice / 1e9).toFixed(2),
            gasUsed: tx.gasUsed,
            blockNumber: tx.blockNumber,
            timeStamp: parseInt(tx.timeStamp),
            isError: tx.isError === '1',
            functionName: tx.functionName || 'Transfer',
            address: address.toLowerCase()
        }));
    } catch (error) {
        console.error('Failed to fetch transactions:', error);
        return [];
    }
}

async function fetchPrice() {
    try {
        const network = NETWORKS[currentNetwork];
        const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${network.priceId}&vs_currencies=usd&include_24hr_change=true`
        );
        const data = await response.json();
        const priceData = data[network.priceId];
        return {
            usd: priceData.usd,
            change24h: priceData.usd_24h_change || 0
        };
    } catch (error) {
        console.warn('Failed to fetch price:', error);
        return { usd: 0, change24h: 0 };
    }
}

function displayResults(address, balance, price) {
    const network = NETWORKS[currentNetwork];
    
    // Display address
    document.getElementById('displayAddress').textContent = address;
    
    // Display balance
    const balanceDisplay = balance.toFixed(6);
    document.getElementById('cryptoBalance').textContent = `${balanceDisplay} ${network.symbol}`;
    
    // Display USD value
    const usdValue = (balance * price.usd).toFixed(2);
    const changeColor = price.change24h >= 0 ? '📈' : '📉';
    const changeText = price.usd > 0 ? `<br><small>${changeColor} 24h: ${price.change24h.toFixed(2)}%</small>` : '';
    document.getElementById('usdValue').innerHTML = price.usd > 0 ? `$${usdValue}${changeText}` : 'N/A';
    
    // Count transactions
    document.getElementById('txCount').textContent = allTransactions.length.toString();
    
    // Display transactions
    displayTransactionsList(filteredTransactions, address);
}

function displayTransactionsList(transactions, address) {
    const transactionsList = document.getElementById('transactionsList');
    transactionsList.innerHTML = '';
    
    if (transactions.length === 0) {
        transactionsList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No transactions found</p>';
        return;
    }
    
    transactions.forEach(tx => {
        const isSent = tx.from.toLowerCase() === address.toLowerCase();
        const badge = isSent ? 'sent' : 'received';
        const badgeText = isSent ? 'Sent' : 'Received';
        
        const txElement = document.createElement('div');
        txElement.className = 'transaction-item';
        
        const date = new Date(tx.timeStamp * 1000).toLocaleString();
        const counterparty = isSent ? tx.to : tx.from;
        const network = NETWORKS[currentNetwork];
        
        txElement.innerHTML = `
            <div class="transaction-header">
                <div class="tx-hash">
                    <strong>Hash:</strong> ${tx.hash}
                </div>
                <span class="tx-badge ${badge}">${badgeText}</span>
            </div>
            <div class="transaction-details">
                <div class="detail-item">
                    <span class="detail-label">Amount</span>
                    <span class="detail-value">${tx.value} ${network.symbol}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Date</span>
                    <span class="detail-value">${date}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">${isSent ? 'To' : 'From'}</span>
                    <span class="detail-value">${counterparty}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Gas Price</span>
                    <span class="detail-value">${tx.gasPrice} Gwei</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Block</span>
                    <span class="detail-value">#${tx.blockNumber}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Status</span>
                    <span class="detail-value">${tx.isError ? '❌ Error' : '✅ Success'}</span>
                </div>
            </div>
        `;
        
        transactionsList.appendChild(txElement);
    });
}

function applyFilter() {
    const startDate = new Date(startDateInput.value).getTime();
    const endDate = new Date(endDateInput.value).getTime();
    
    if (!startDateInput.value || !endDateInput.value) {
        showError('Please select both start and end dates');
        return;
    }
    
    if (startDate > endDate) {
        showError('Start date must be before end date');
        return;
    }
    
    filteredTransactions = allTransactions.filter(tx => {
        const txTime = tx.timeStamp * 1000;
        return txTime >= startDate && txTime <= endDate;
    });
    
    hideError();
    const address = walletInput.value.trim();
    displayTransactionsList(filteredTransactions, address);
    updateFilteredCount();
}

function resetFilter() {
    startDateInput.value = '';
    endDateInput.value = '';
    filteredTransactions = [...allTransactions];
    const address = walletInput.value.trim();
    displayTransactionsList(filteredTransactions, address);
    updateFilteredCount();
}

function updateFilteredCount() {
    const countEl = document.getElementById('filteredCount');
    if (filteredTransactions.length < allTransactions.length) {
        countEl.textContent = `Showing ${filteredTransactions.length} of ${allTransactions.length} transactions`;
    } else {
        countEl.textContent = '';
    }
}

function exportToCSV() {
    if (filteredTransactions.length === 0) {
        showError('No transactions to export');
        return;
    }
    
    const network = NETWORKS[currentNetwork];
    const address = walletInput.value.trim();
    
    // CSV Headers
    const headers = ['Hash', 'Date', 'Type', 'Amount (' + network.symbol + ')', 'From', 'To', 'Gas Price (Gwei)', 'Block', 'Status'];
    
    // CSV Data
    const rows = filteredTransactions.map(tx => {
        const isSent = tx.from.toLowerCase() === address.toLowerCase();
        const type = isSent ? 'Sent' : 'Received';
        const status = tx.isError ? 'Error' : 'Success';
        
        return [
            tx.hash,
            new Date(tx.timeStamp * 1000).toLocaleString(),
            type,
            tx.value,
            tx.from,
            tx.to,
            tx.gasPrice,
            tx.blockNumber,
            status
        ];
    });
    
    // Create CSV content
    let csvContent = headers.map(h => `"${h}"`).join(',') + '\n';
    csvContent += rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    
    // Download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${address}_${network.symbol}_transactions_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    hideError();
}

function showError(message) {
    errorEl.textContent = message;
    errorEl.classList.add('show');
}

function hideError() {
    errorEl.classList.remove('show');
    errorEl.textContent = '';
}

function showLoading() {
    loadingEl.classList.remove('hidden');
}

function hideLoading() {
    loadingEl.classList.add('hidden');
}

function showResults() {
    resultsEl.classList.remove('hidden');
    emptyStateEl.classList.add('hidden');
}

function hideResults() {
    resultsEl.classList.add('hidden');
    emptyStateEl.classList.remove('hidden');
}

// Initialize
hideLoading();
hideResults();
initTheme();
