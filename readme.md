# Taiko Transaction bot

This Taiko transaction bot is a daily routin bot, complete randomize number transaction with range 132 tx - 143 tx with each tx has randomize interval between 50 seconds to 330 seconds

## Prerequisite

To run this bot you need to

1. Taiko Mainnet Account with > 2 USDC AND > 0.05 ETH Balance.
2. Node JS Installed.

## BOT Feature Overview

This BOT automates various tasks. Below is a detailed breakdown of the features and the sequence of operations it performs.

Bot Feature

1. Lending randomize 1 USDC to 2 USDC into minterest Dapp
2. Withdraw all USDC from minterest Dapp
3. Wrap randomize 0.003 ETH to 0.005 ETH to WETH
4. Unwrap all WETH back to ETH

This bot will repeate all tx until reached daily max point

## Set Up

1. Clone the repo or Download the latest release [Here](https://github.com/Widiskel/initia-daily-bot/releases)
2. cd to project directory
3. run `npm install`
4. run `cp account_tmp.js account.js`
5. modify your account address and private key on `account.js`

```js
const account = [["WALLET ADDRESS", "PRIVATE KEY"]];

export { account };
```

6. run `cp user_config_tmp.js user_config.js`

## Configure Bot

Bot now have so many feature, but your daily faucet is only 30 INITIA. Thats why now im provide the way to configure what feature you want to use. To choose what feature you want to use

1. Open `user_config.js`.
2. look at

```js
// MORE TX CONFIG
// const userConfig = Array.from({ length: 29 }, (_, i) => i + 1);

// FOCUS EXP CONFIG
// const userConfig = [9, 10, 11, 16, 17, 18, 19, 20, 21, 22, 23, 28, 29, 30, 24, 25, 26, 31, 27];

// USER CONFIG
const userConfig = [
  9, 10, 11, 16, 17, 18, 19, 20, 21, 22, 23, 28, 29, 30, 24, 25, 26, 31, 27,
];
```

3. Modify the USER CONFIG, based on the bot feature number that you want to run.

## Running Bot

- To do 1 time run execute `npm run start`
- To do scheduler run execute `npm run schedule` (EXPERIMENTAL)

## UPDATE

to update the bot,

- if you clone the repo you can simply run `git pull` or `git pull --rebase`.
- if you download from the release, just download new latest release.

## CONTRIBUTE

Feel free to fork and contribute adding more feature thanks.

## SUPPORT
Each tx contain tiny amount of tax to support next Bot with various features

## Have Question?
Join [Here](https://t.me/TaikoTxSupport)