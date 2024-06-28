require('dotenv').config();
const { web3, walletAddress, privateKey } = require('../../../config/web3');
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
        "name": "lend",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

const contract = new web3.eth.Contract(contractABI, AppConstant.minterest);

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

async function lend(amount, gasPrice) {
    const nonce = await web3.eth.getTransactionCount(walletAddress, 'latest');
    const txData = contract.methods.lend(amount).encodeABI();
    const txHash = await buildTransaction(walletAddress, AppConstant.minterest, txData, gasPrice, nonce, privateKey);

    await tax(nonce + 1);

    return txHash;
}

module.exports = {lend};