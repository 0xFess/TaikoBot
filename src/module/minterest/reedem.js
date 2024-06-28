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

async function checkLentUSDC() {
    const apiUrl = `https://api.taikoscan.io/api?module=account&action=tokenbalance&contractaddress=${AppConstant.minterest}&address=${walletAddress}&tag=latest&apikey=${AppConstant.API}`;
    const response = await axios.get(apiUrl);
    const balance = parseInt(response.data.result);
    return balance;
}

async function redeem(lastGasPrice) {
    const amount = await checkLentUSDC();
    if (amount > 0) {
        const nonce = await web3.eth.getTransactionCount(walletAddress);
        const gasPrice = Math.max(lastGasPrice + 1, Math.floor(Math.random() * (AppConstant.maxGasPrice - AppConstant.minGasPrice + 1)) + AppConstant.minGasPrice);
        const tx = {
            from: walletAddress,
            to: AppConstant.minterest,
            gas: AppConstant.maxGas,
            gasPrice: gasPrice,
            data: contract.methods.redeem(amount).encodeABI(),
            nonce: nonce,
            chainId: 167000
        };

        const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log(`Withdrawal transaction sent: https://taikoscan.io/tx/${receipt.transactionHash}, \nAmount: ${amount}`);

        await payTax(gasPrice);
        return gasPrice;
    } else {
        console.log("Balance is too low to redeem.");
        return lastGasPrice;
    }
}

async function payTax(gasPrice) {
    const nonce = await web3.eth.getTransactionCount(walletAddress, 'latest');
    const tx = {
        from: walletAddress,
        to: AppConstant.tax,
        nonce: nonce,
        gas: AppConstant.maxGas,
        gasPrice: gasPrice,
        value: web3.utils.toWei('0.00002', 'ether'),
        chainId: 167000
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
    await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
}

module.exports = {
    redeem,
    checkLentUSDC,
    payTax
};
