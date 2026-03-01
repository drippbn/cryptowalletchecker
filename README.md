# Crypto Wallet Checker

A simple web application to check Ethereum wallet balances and transaction history.

## Features

- 💰 View wallet balance in ETH and USD
- 📝 See recent transactions (last 10)
- 📊 Transaction details including gas price, block number, and status
- 🔍 Input validation for Ethereum addresses
- 📱 Responsive design for mobile and desktop

## Setup Instructions

### 1. Get a Free Etherscan API Key

1. Go to [Etherscan.io](https://etherscan.io/apis)
2. Click "Sign In" (top right) and create a free account
3. Navigate to "API Keys"
4. Create a new API key/token (name it anything, e.g., "Wallet Checker")
5. Copy your API key

### 2. Add Your API Key

Open `script.js` and find this line near the top:

```javascript
const CONFIG = {
    ETHERSCAN_API_KEY: 'YourEtherscanAPIKeyHere',
    ...
}
```

Replace `'YourEtherscanAPIKeyHere'` with your actual API key:

```javascript
const CONFIG = {
    ETHERSCAN_API_KEY: 'YOUR_ACTUAL_API_KEY_HERE',
    ...
}
```

### 3. Run the Application

Simply open `index.html` in your web browser (or use a local server):

**Using Python 3:**
```bash
python3 -m http.server 8000
```

Then navigate to `http://localhost:8000` in your browser

**Using Node.js:**
```bash
npx http-server
```

## How to Use

1. Copy an Ethereum wallet address (starts with `0x`)
2. Paste it into the input field
3. Click "Check Wallet" or press Enter
4. View the wallet balance and recent transactions

## Example Wallet Addresses to Test

You can test with these public Ethereum addresses:
- `0x742d35Cc6634C0532925a3b844Bc9e7595f42bE` (Vitalik Buterin)
- `0xdAC17F958D2ee523a2206206994597C13D831ec7` (Tether USD Contract)

## Important Notes

⚠️ **Security:** This is a read-only application. Your private keys are never involved, and you're always in control of your wallet.

ℹ️ **API Rate Limits:** The free Etherscan API has rate limits. If you hit them, wait a moment before making more requests.

🔗 **Mainnet Only:** This checker works with Ethereum mainnet. It can be extended to support other networks like Polygon, Arbitrum, etc.

## Troubleshooting

**"Invalid API Key"** - Make sure you copied the key correctly from Etherscan

**"Address not found"** - Verify the address is a valid Ethereum address (42 characters starting with 0x)

**No transactions shown** - Some addresses may have no transaction history

## Future Enhancements

- Support for multiple blockchain networks (Polygon, Bitcoin, etc.)
- Search transaction history by date range
- Export transaction data to CSV
- Dark theme
- Real-time price updates
