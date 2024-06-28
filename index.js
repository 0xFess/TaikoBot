require('dotenv').config();
const { web3, walletAddress } = require('./config/web3');
const { lendAmount } = require('./src/module/minterest/lend');
const { redeem } = require('./src/module/minterest/reedem');
const { wrap } = require('./src/module/wrap/wrap');
const { unwrap } = require('./src/module/wrap/unwrap');
const AppConstant = require('./src/utils/constant');
const BN = require('bn.js');

function randomGasPrice() {
    const minGwei = new BN(web3.utils.toWei('0.01005', 'gwei'));
    const maxGwei = new BN(web3.utils.toWei('0.013', 'gwei'));
    const randomGwei = minGwei.add(new BN(Math.floor(Math.random() * (maxGwei.sub(minGwei).toNumber()))));
    return randomGwei;
}

async function main() {
    const lendRangeMin = 1.0;
    const lendRangeMax = 2.0;
    const maxIterations = 7; 
    let iterationCount = 0;
    let nonce = await web3.eth.getTransactionCount(walletAddress);

    while (iterationCount < maxIterations) {
        const gasPriceWei = randomGasPrice();

        const balanceWei = await web3.eth.getBalance(walletAddress);
        const balance = new BN(balanceWei);
        const gasLimit = new BN(800000); // gas limit to 800,000
        const totalTxCost = gasLimit.mul(gasPriceWei);

        console.log(`Gas Limit: ${gasLimit.toString()}, Gas Price: ${web3.utils.fromWei(gasPriceWei, 'gwei')} Gwei`);
        console.log(`Total Tx Cost: ${web3.utils.fromWei(totalTxCost.toString(), 'ether')} ETH`);

        if (balance.lt(totalTxCost)) {
            console.log("Insufficient funds to cover the transaction cost. Transaction skipped.");
            break;
        }

        // Lend
        let amount = Math.random() * (lendRangeMax - lendRangeMin) + lendRangeMin;
        amount = Math.floor(amount * 1_000_000);
        let txHash = await lendAmount(amount, gasPriceWei.toString(), nonce++);
        let txLink = `https://taikoscan.io/tx/${txHash}`;
        let amountDecimal = amount / 1_000_000;
        console.log(`Lend Transaction sent: ${txLink}, \nAmount: ${amountDecimal} USDC \nGwei: ${web3.utils.fromWei(gasPriceWei, 'gwei')} Gwei`);

        // Redeem
        await redeem(gasPriceWei.toString(), nonce++);
        
        // Wrap
        const wrapAmountMin = 0.0003;
        const wrapAmountMax = 0.0004;
        let wrapAmount = Math.random() * (wrapAmountMax - wrapAmountMin) + wrapAmountMin;
        wrapAmount = parseFloat(wrapAmount.toFixed(6));
        txHash = await wrap(wrapAmount, gasPriceWei.toString(), nonce++);
        txLink = `https://taikoscan.io/tx/${txHash}`;
        console.log(`Wrap Transaction sent: ${txLink}, \nAmount: ${wrapAmount} ETH`);

        // Unwrap
        txHash = await unwrap(wrapAmount, gasPriceWei.toString(), nonce++);
        txLink = `https://taikoscan.io/tx/${txHash}`;
        console.log(`Unwrap Transaction sent: ${txLink}, \nAmount: ${wrapAmount} ETH`);

        iterationCount++;
    }

    console.log(`Completed ${maxIterations} iterations. Exiting loop.`);
}

main().catch(console.error);
