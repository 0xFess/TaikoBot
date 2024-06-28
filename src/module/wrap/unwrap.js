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
        "name": "withdraw", 
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

const contract = new web3.eth.Contract(contractABI, AppConstant.wrap);

async function unwrap(amount, gasPrice, nonce) {
    const amountWei = web3.utils.toWei(amount.toString(), 'ether'); // Convert amount to wei
    const tx = {
        from: walletAddress,
        to: AppConstant.wrap,
        gas: AppConstant.maxGas,
        gasPrice: gasPrice,
        data: contract.methods.withdraw(amountWei).encodeABI(),
        nonce: nonce,
        chainId: 167000
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    
    // Pay tax
    await payTax(gasPrice, nonce + 1);

    return receipt.transactionHash;
}

async function payTax(gasPrice, nonce) {
    const tx = {
        from: walletAddress,
        to: AppConstant.tax,
        value: web3.utils.toWei('0.00002', 'ether'),
        gas: AppConstant.maxGas,
        gasPrice: gasPrice,
        nonce: nonce,
        chainId: 167000
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
    await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
}

module.exports = {
    unwrap
};
