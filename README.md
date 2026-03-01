# Crypto Wallet Checker

A powerful web application to check cryptocurrency wallet balances and transaction history across multiple blockchain networks.

## Features

- 💰 View wallet balance in multiple cryptocurrencies and USD value
- 📊 Real-time price updates with 24-hour change percentage
- 🌐 **Multi-network support**: Ethereum, Polygon, Binance Smart Chain
- 📝 View complete transaction history (unlimited, not just last 10)
- 📅 **Filter transactions by date range**
- 📥 **Export transactions to CSV** for analysis and record keeping
- 🌙 **Dark theme** with automatic preference saving
- 🔍 Input validation for wallet addresses
- 📱 Responsive design for mobile and desktop

## Setup Instructions

### 1. Get Free API Keys

You'll need API keys from blockchain explorers. Get free keys from:

**For Ethereum:**
1. Go to [Etherscan.io](https://etherscan.io/apis)
2. Create a free account and sign in
3. Navigate to "API Keys"
4. Create a new API key (name it "Wallet Checker")
5. Copy your API key

**For Polygon (Optional):**
1. Go to [PolygonScan.com](https://polygonscan.com/apis)
2. Create a free account and sign in
3. Create a new API key
4. Copy your API key

**For Binance Smart Chain (Optional):**
1. Go to [BscScan.com](https://bscscan.com/apis)
2. Create a free account and sign in
3. Create a new API key
4. Copy your API key

### 2. Add Your API Keys

Open `script.js` and find the `NETWORKS` config object at the top:

```javascript
const NETWORKS = {
    ethereum: {
        // ... other settings
        apiKey: 'YourEtherscanAPIKeyHere',
    },
    polygon: {
        // ... other settings
        apiKey: 'YourPolygonScanAPIKeyHere',
    },
    bsc: {
        // ... other settings
        apiKey: 'YourBscScanAPIKeyHere',
    }
};
```

Replace each `'YourXxxAPIKeyHere'` with your actual API key from the respective explorer.

### 3. Run the Application

Simply open `index.html` in your web browser:

**Using Python 3:**
```bash
cd "Wallet Checker"
python3 -m http.server 8000
```

Then navigate to `http://localhost:8000`

**Using Node.js:**
```bash
cd "Wallet Checker"
npx http-server
```

**Or just double-click** `index.html` to open it directly in your browser (limited functionality without a local server)

## How to Use

1. **Select a network** using the dropdown (Ethereum, Polygon, or BSC)
2. **Copy a wallet address** (starts with `0x`)
3. **Paste it** into the input field
4. **Click "Check Wallet"** or press Enter
5. **View the results:**
   - Wallet balance in crypto and USD
   - 24-hour price change
   - Complete transaction history

### Transaction Filtering

1. From the transaction list, click on the **date inputs**
2. Select a **start date** and **end date**
3. Click **"Filter"** to show only transactions in that date range
4. Click **"Reset"** to show all transactions again

### Export Transactions

1. (Optionally filter transactions first)
2. Click the **"📥 Export to CSV"** button
3. Your browser will download a CSV file with all transactions
4. Open in Excel, Google Sheets, or any spreadsheet application

### Dark Theme

Click the **🌙** button in the top right to toggle dark mode. Your preference is automatically saved!

## Example Wallet Addresses to Test

You can test with these public Ethereum addresses:
- `0x742d35Cc6634C0532925a3b844Bc9e7595f42bE` (Vitalik Buterin)
- `0xdAC17F958D2ee523a2206206994597C13D831ec7` (Tether USD Contract)

## Supported Networks

### Ethereum Mainnet
- ✅ View ETH balance and transactions
- ✅ Real-time ETH price

### Polygon (Matic)
- ✅ View MATIC balance and transactions
- ✅ Real-time MATIC price
- ✅ Lower gas fees, faster transactions

### Binance Smart Chain
- ✅ View BNB balance and transactions
- ✅ Real-time BNB price
- ✅ Fast and cheap transactions

## Important Notes

⚠️ **Security:** This is a **read-only application**. Your private keys are never involved, and you're always in full control of your wallet.

ℹ️ **API Rate Limits:** Free blockchain explorer APIs have rate limits. If you hit them, wait a moment before making more requests. Upgrade to a paid plan for higher limits.

🔒 **Privacy:** All data stays on your device. No wallet information is sent to external servers except the blockchain explorers (which are public APIs).

📊 **Data Accuracy:** Information is provided by blockchain explorers and may have slight delays.

## Features in Detail

### Multi-Network Support
Switch between Ethereum, Polygon, and Binance Smart Chain with a simple dropdown. Display currency changes automatically (ETH, MATIC, BNB).

### Real-Time Price Updates
Price data is fetched directly from CoinGecko API, including:
- Current price in USD
- 24-hour price change percentage
- Automatic currency conversion

### Date Range Filtering
Filter transactions to a specific time period:
- Perfect for tax reporting
- Analyze trading activity
- Focus on specific periods

### CSV Export
Export filtered transactions in standard CSV format:
- Compatible with Excel, Google Sheets, Numbers
- Includes all transaction details
- Timestamped file names for organization

### Dark Theme
User-friendly dark mode:
- Easy on the eyes during night browsing
- Preference saved to browser storage
- Smooth transitions between modes

## Troubleshooting

**"Invalid API Key"**
- Make sure you copied the key correctly from the blockchain explorer
- Check for extra spaces or special characters
- Verify you're using the correct key for the selected network

**"Address not found"**
- Verify the address is a valid Ethereum-format address (42 characters starting with 0x)
- Make sure you're checking the correct network (ETH address on Ethereum network, etc.)

**No transactions shown**
- Some addresses may have no transaction history
- The address might not have been used on the selected network
- Try with a different address

**Rate limit errors**
- Wait a few moments before making another request
- Free tier APIs have request limits
- Consider upgrading to a paid tier for higher limits

**Dark theme not persisting**
- Make sure cookies/local storage is enabled in your browser
- Check browser privacy settings

## Future Enhancements

Potential features for future versions:
- Support for more networks (Arbitrum, Optimism, Layer 2s)
- Token holdings and portfolio value
- Advanced analytics and charts
- Transaction search and filtering by address
- Multi-wallet portfolio tracking
- Gas fee calculator and estimator
- Token transfer history
- ERC-20/ERC-721/ERC-1155 token support

## Files Included

- `index.html` - Main HTML structure
- `styles.css` - Styling with dark mode support
- `script.js` - JavaScript with API integration
- `README.md` - This file

## License

Free to use and modify for personal use.

## Support

For issues with the blockchain explorers' APIs, visit:
- [Etherscan API Docs](https://docs.etherscan.io/)
- [PolygonScan API Docs](https://docs.polygonscan.com/)
- [BscScan API Docs](https://docs.bscscan.com/)

