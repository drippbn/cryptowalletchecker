// Configuration
const CONFIG = {
    ETHERSCAN_API_KEY: 'YourEtherscanAPIKeyHere', // Get free key from https://etherscan.io/apis
    ETHERSCAN_URL: 'https://api.etherscan.io/api',
    COINGECKO_URL: 'https://api.coingecko.com/api/v3'
};

// DOM Elements
const walletInput = document.getElementById('walletAddress');
const checkBtn = document.getElementById('checkBtn');
const errorEl = document.getElementById('error');
const loadingEl = document.getElementById('loading');
const resultsEl = document.getElementById('results');
const emptyStateEl = document.getElementById('emptyState');

// Event Listeners
checkBtn.addEventListener('click', checkWallet);
walletInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkWallet();
});

async function checkWallet() {
    const address = walletInput.value.trim();
    
    // Validation
    if (!address) {
        showError('Please enter a wallet address');
        return;
    }
    
    if (!address.startsWith('0x') || address.length !== 42) {
        showError('Invalid Ethereum address. Must start with 0x and be 42 characters long');
        return;
    }
    
    // Clear previous state
    hideError();
    showLoading();
    hideResults();
    
    try {
        // Fetch wallet data
        const balance = await fetchBalance(address);
        const transactions = await fetchTransactions(address);
        const ethPrice = await fetchETHPrice();
        
        // Display results
        displayResults(address, balance, transactions, ethPrice);
        showResults();
    } catch (error) {
        showError('Error: ' + error.message);
    } finally {
        hideLoading();
    }
}

async function fetchBalance(address) {
    try {
        // Try with Etherscan API
        const response = await fetch(
            `${CONFIG.ETHERSCAN_URL}?module=account&action=balance&address=${address}&tag=latest&apikey=${CONFIG.ETHERSCAN_API_KEY}`
        );
        const data = await response.json();
        
        if (data.status === '0') {
            throw new Error('Address not found or API error');
        }
        
        // Convert from Wei to ETH (1 ETH = 10^18 Wei)
        const balanceInWei = data.result;
        const balanceInETH = balanceInWei / 1e18;
        
        return balanceInETH;
    } catch (error) {
        throw new Error('Failed to fetch balance: ' + error.message);
    }
}

async function fetchTransactions(address) {
    try {
        const response = await fetch(
            `${CONFIG.ETHERSCAN_URL}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${CONFIG.ETHERSCAN_API_KEY}`
        );
        const data = await response.json();
        
        if (data.status === '0') {
            return [];
        }
        
        // Return last 10 transactions
        return data.result.slice(0, 10).map(tx => ({
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: (tx.value / 1e18).toFixed(6),
            gasPrice: (tx.gasPrice / 1e9).toFixed(2),
            gasUsed: tx.gasUsed,
            blockNumber: tx.blockNumber,
            timeStamp: tx.timeStamp,
            isError: tx.isError === '1',
            functionName: tx.functionName || 'Transfer'
        }));
    } catch (error) {
        console.error('Failed to fetch transactions:', error);
        return [];
    }
}

async function fetchETHPrice() {
    try {
        const response = await fetch(
            `${CONFIG.COINGECKO_URL}/simple/price?ids=ethereum&vs_currencies=usd`
        );
        const data = await response.json();
        return data.ethereum.usd;
    } catch (error) {
        console.warn('Failed to fetch ETH price:', error);
        return 0;
    }
}

function displayResults(address, balance, transactions, ethPrice) {
    // Display address
    document.getElementById('displayAddress').textContent = address;
    
    // Display balance
    const ethDisplay = balance.toFixed(6);
    document.getElementById('ethBalance').textContent = `${ethDisplay} ETH`;
    
    // Display USD value
    const usdValue = (balance * ethPrice).toFixed(2);
    document.getElementById('usdValue').textContent = ethPrice > 0 ? `$${usdValue}` : 'N/A';
    
    // Count transactions
    document.getElementById('txCount').textContent = transactions.length.toString();
    
    // Display transactions
    const transactionsList = document.getElementById('transactionsList');
    transactionsList.innerHTML = '';
    
    if (transactions.length === 0) {
        transactionsList.innerHTML = '<p style="text-align: center; color: #999;">No transactions found</p>';
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
                    <span class="detail-value">${tx.value} ETH</span>
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
