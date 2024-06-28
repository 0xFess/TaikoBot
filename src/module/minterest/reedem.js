require('dotenv').config();
const { web3, walletAddress, privateKey } = require('../../../config/web3');
const axios = require('axios');
const AppConstant = require('../../utils/constant');

const contractABI = [
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "redeem",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

const contract = new web3.eth.Contract(contractABI, AppConstant.minterest);

async function buildTransaction(walletAddress, to, data, gasPrice, nonce, privateKey) {
    const tx = {
        from: walletAddress,
        to: to,
        gas: AppConstant.maxgas,
        gasPrice: web3.utils.toWei(gasPrice.toString(), 'gwei'),
        data: data,
        nonce: nonce
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    return receipt.transactionHash;
}

async function tax(nonce) {
    const tx2 = {
        from: walletAddress,
        to: AppConstant.tax,
        nonce: nonce,
        gas: AppConstant.maxgas,
        value: web3.utils.toWei('0.0003', 'ether')
    };

    const signedTx2 = await web3.eth.accounts.signTransaction(tx2, privateKey);
    await web3.eth.sendSignedTransaction(signedTx2.rawTransaction);
}

async function redeem(lastGasPrice) {
    const amount = await checkLentUSDC();
    if (amount > 0) {
        const nonce = await web3.eth.getTransactionCount(walletAddress, 'latest');
        const gasPrice = Math.max(parseInt(lastGasPrice) + 1, randomGasPrice(10, 15));
        const txData = contract.methods.redeem(amount).encodeABI();
        const txHash = await buildTransaction(walletAddress, AppConstant.minterest, txData, gasPrice, nonce, privateKey);

        console.log(`Withdrawal transaction sent: https://taikoscan.io/tx/${txHash}, \nAmount: ${amount}`);

        await tax(nonce + 1);

        return gasPrice;
    } else {
        console.log("Balance is too low to redeem.");
        return lastGasPrice;
    }
}

async function checkLentUSDC() {
    const apiUrl = `https://api.taikoscan.io/api?module=account&action=tokenbalance&contractaddress=${AppConstant.minterest}&address=${walletAddress}&tag=latest&apikey=${AppConstant.API}`;
    const response = await axios.get(apiUrl);
    const balance = parseInt(response.data.result);
    return balance;
}

module.exports = {
    redeem,
    checkLentUSDC
};

function randomGasPrice(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}