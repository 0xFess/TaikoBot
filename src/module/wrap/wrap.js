const { web3, walletAddress, privateKey } = require('../../../config/web3');
const AppConstant = require('../../utils/constant');

const wrapABI = [
    {
        "constant": false,
        "inputs": [],
        "name": "deposit",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    }
];

const wrapContract = new web3.eth.Contract(wrapABI, AppConstant.wrap);

async function wrap(amount, gasPrice) {
    const nonce = await web3.eth.getTransactionCount(walletAddress);
    const tx = {
        from: walletAddress,
        to: AppConstant.wrap,
        value: web3.utils.toWei(amount.toString(), 'ether'),
        gas: AppConstant.maxGas,
        gasPrice: gasPrice,
        data: wrapContract.methods.deposit().encodeABI(),
        nonce: nonce,
        chainId: 167000
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

    await payTax(gasPrice);
    return receipt.transactionHash;
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
    wrap,
    payTax
};
