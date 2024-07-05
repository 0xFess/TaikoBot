require('dotenv').config();
const { getWeb3, walletAddress, switchRpc } = require('./config/web3');
const { lendAmount } = require('./src/module/minterest/lend');
const { redeem } = require('./src/module/minterest/redeem');
const { wrap } = require('./src/module/wrap/wrap');
const { unwrap } = require('./src/module/wrap/unwrap');
const BN = require('bn.js');

function randomGasPrice(web3Instance) {
    const minGwei = new BN(web3Instance.utils.toWei('0.05', 'gwei'));
    const maxGwei = new BN(web3Instance.utils.toWei('0.06', 'gwei'));
    const randomGwei = minGwei.add(new BN(Math.floor(Math.random() * (maxGwei.sub(minGwei).toNumber()))));
    return randomGwei;
}

function randomIterations() {
    return Math.random() < 0.5 ? 7 : 8; 
}

async function getNonce(web3Instance) {
    return await web3Instance.eth.getTransactionCount(walletAddress, 'pending');
}

async function executeTransaction(action, gasPriceWei, localNonce, ...args) {
    let web3Instance = getWeb3();
    while (true) {
        try {
            const gasLimit = new BN(800000);
            const totalTxCost = gasLimit.mul(new BN(gasPriceWei));
            const balanceWei = await web3Instance.eth.getBalance(walletAddress);
            const balance = new BN(balanceWei);

            if (balance.lt(totalTxCost)) {
                console.log("Insufficient funds to cover the transaction cost. Transaction skipped.");
                return;
            }

            return await action(...args, gasPriceWei.toString(), localNonce);
        } catch (error) {
            console.error(`Error executing transaction: ${error.message}`);
            if (error.message.includes("Invalid JSON RPC response")) {
                console.log("Retrying...");
                web3Instance = switchRpc(); 
                localNonce = await getNonce(web3Instance);
            } else {
                await new Promise(resolve => setTimeout(resolve, 5000)); 
            }
        }
    }
}

async function main() {
    let web3Instance = getWeb3();
    const lendRangeMin = 1.0;
    const lendRangeMax = 2.0;
    const maxIterations = randomIterations();
    let iterationCount = 0;
    let localNonce = await getNonce(web3Instance);

    while (iterationCount < maxIterations) {
        const gasPriceWei = randomGasPrice(web3Instance);

        const balanceWei = await web3Instance.eth.getBalance(walletAddress);
        const balance = new BN(balanceWei);
        const gasLimit = new BN(500000); 
        const totalTxCost = gasLimit.mul(gasPriceWei);

        console.log(`Gas Limit: ${gasLimit.toString()}, Gas Price: ${web3Instance.utils.fromWei(gasPriceWei, 'gwei')} Gwei`);
        console.log(`Total Tx Cost: ${web3Instance.utils.fromWei(totalTxCost.toString(), 'ether')} ETH`);

        if (balance.lt(totalTxCost)) {
            console.log("Insufficient funds to cover the transaction cost. Transaction skipped.");
            break;
        }

        // Lend
        let amount = Math.random() * (lendRangeMax - lendRangeMin) + lendRangeMin;
        amount = Math.floor(amount * 1_000_000);
        let txHash = await executeTransaction(lendAmount, gasPriceWei, localNonce, amount);
        if (!txHash) break;
        localNonce++;
        let txLink = `https://taikoscan.io/tx/${txHash}`;
        let amountDecimal = amount / 1_000_000;
        console.log(`Lend Transaction sent: ${txLink}, \nAmount: ${amountDecimal} USDC \nGwei: ${web3Instance.utils.fromWei(gasPriceWei, 'gwei')} Gwei`);

        // Redeem
        txHash = await executeTransaction(redeem, gasPriceWei, localNonce);
        if (!txHash) break;
        localNonce++;
        
        // Wrap
        const wrapAmountMin = 0.0003;
        const wrapAmountMax = 0.0004;
        let wrapAmount = Math.random() * (wrapAmountMax - wrapAmountMin) + wrapAmountMin;
        wrapAmount = parseFloat(wrapAmount.toFixed(6));
        txHash = await executeTransaction(wrap, gasPriceWei, localNonce, wrapAmount);
        if (!txHash) break;
        localNonce++;
        txLink = `https://taikoscan.io/tx/${txHash}`;
        console.log(`Wrap Transaction sent: ${txLink}, \nAmount: ${wrapAmount} ETH`);

        // Unwrap
        txHash = await executeTransaction(unwrap, gasPriceWei, localNonce, wrapAmount);
        if (!txHash) break;
        localNonce++;
        txLink = `https://taikoscan.io/tx/${txHash}`;
        console.log(`Unwrap Transaction sent: ${txLink}, \nAmount: ${wrapAmount} ETH`);

        iterationCount++;
    }

    console.log(`Completed ${maxIterations} iterations. Exiting loop.`);
}

main().catch(console.error);
