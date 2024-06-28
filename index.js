require('dotenv').config();
const { web3, walletAddress } = require('./config/web3');
const { lend} = require('./src/module/minterest/lend')
const { redeem } = require('./src/module/minterest/reedem');
const { wrap } = require('./src/module/wrap/wrap');
const { unwrap } = require('./src/module/wrap/unwrap');
const AppConstant = require('./src/utils/constant');

async function main() {
    let lastGasPrice = web3.utils.toWei(randomGasPrice(0.0100002, 0.015).toString(), 'gwei');
    const maxIterations = 1;
    let iterationCount = 0;

    while (iterationCount < maxIterations) {
        const category = Math.random() < 0.5 ? 1 : 2;

        if (category === 1) {
            const lendRangeMin = 1.0;
            const lendRangeMax = 2.0;
            const gasLimit = AppConstant.maxgas;
            const balance = await web3.eth.getBalance(walletAddress);
            const gasPrice = web3.utils.toWei(randomGasPrice(0.0100002, 0.015).toString(), 'gwei');
            const totalTxCost = gasLimit * gasPrice;

            if (balance < totalTxCost) {
                console.log("Insufficient funds to cover the transaction cost. Transaction skipped.");
                continue;
            }

            let amount = Math.random() * (lendRangeMax - lendRangeMin) + lendRangeMin;
            amount = Math.floor(amount * 1_000_000);
            const txHash = await lend(amount, gasPrice);
            const txLink = `https://taikoscan.io/tx/${txHash}`;
            const amountDecimal = amount / 1_000_000;
            console.log(`Transaction sent: ${txLink}, \nAmount: ${amountDecimal} USDC \nGwei: ${web3.utils.fromWei(gasPrice.toString(), 'gwei')}`);

            lastGasPrice = gasPrice;
            await new Promise(resolve => setTimeout(resolve, Math.random() * 80 + 50));
            lastGasPrice = await redeem(lastGasPrice);
        } else {
            const wrapRangeMin = 0.003;
            const wrapRangeMax = 0.004;

            let amount = Math.random() * (wrapRangeMax - wrapRangeMin) + wrapRangeMin;
            amount = parseFloat(amount.toFixed(6));
            const txHash = await wrap(amount);
            const txLink = `https://taikoscan.io/tx/${txHash}`;
            console.log(`Transaction sent: ${txLink}, \nAmount: ${amount} ETH`);

            await new Promise(resolve => setTimeout(resolve, Math.random() * 80 + 50));
            const unwrapTxHash = await unwrap(amount);
            const unwrapTxLink = `https://taikoscan.io/tx/${unwrapTxHash}`;
            console.log(`Transaction sent: ${unwrapTxLink}, \nAmount: ${amount} ETH`);
        }

        await new Promise(resolve => setTimeout(resolve, Math.random() * 80 + 50));
        iterationCount++;
    }

    console.log(`Completed ${maxIterations} iterations. Exiting loop.`);
}

main().catch(console.error);

function randomGasPrice(min, max) {
    return (Math.random() * (max - min) + min).toFixed(9);
}