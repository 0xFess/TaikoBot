# Taiko Transaction Bot

This Taiko transaction bot is a daily routine bot, its job is to complete transactions within the range of 136 to 144 transactions, with each transaction having a randomized interval between 50 seconds to 330 seconds.

## Prerequisite

To run this bot you need to:

- Taiko Mainnet Account with > 2 USDC AND > 0.05 ETH Balance.
- Node.js Installed.

## BOT Feature Overview

This BOT automates various tasks. Below is a detailed breakdown of the features and the sequence of operations it performs.

### Bot Feature

- Lends a random amount between 1 USDC to 2 USDC into the minterest Dapp.
- Withdraws all USDC from the minterest Dapp.
- Wraps a random amount between 0.0003 ETH to 0.0005 ETH to WETH.
- Unwraps all WETH back to ETH.
- This bot will repeat all transactions until it reaches the daily max point.

## Set Up

### Step-by-Step Instructions

1. **Update the package lists:**

    ```sh
    sudo apt-get update
    ```

2. **Install git:**

    ```sh
    sudo apt-get install git
    ```

3. **Clone the repository:**

    ```sh
    git clone https://github.com/0xFess/TaikoBot.git
    ```

4. **Navigate to the project directory:**

    ```sh
    cd TaikoBot
    ```

5. **Install Node.js (if not already installed):**

    ```sh
    sudo apt-get install nodejs
    ```
    ```sh    
    sudo apt-get install npm
    ```

6. **Install the project dependencies:**

    ```sh
    npm install
    ```

7. **Create a `.env` file in the project directory and add your address & private key:**

    ```sh
    echo "WALLET_ADDRESS=your_wallet_address_here" > .env
    ```
    ```sh
    echo "PRIVATE_KEY=your_private_key_here" >> .env
    ```

## Running the Bot

### One-time Run

To run the bot once:

```sh
npm run start
```
### Scheduled Run

To set up the bot to run every day at 1:30 AM UTC, follow these steps:

1.	Make the setup-cron.sh script executable:
 ```sh
chmod +x setup-cron.sh
```
2.	Run the setup-cron.sh script:
```sh
./setup-cron.sh
```
## CONTRIBUTE

Feel free to fork and contribute adding more feature thanks.

## SUPPORT
Each tx contain tiny amount of tax to support next Bot with various features

## Have Question?
Join [Here](https://t.me/TaikoTxSupport)
