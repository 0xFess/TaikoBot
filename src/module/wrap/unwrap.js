const { web3, walletAddress, privateKey } = require('../../../config/web3');
const AppConstant = require('../../utils/constant');

const unwrapABI = [
    {
        "constant": false,
        "inputs": [
            {
                "name": "wad",
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

const wrapContract = new web3.eth.Contract(unwrapABI, '0xA51894664A773981C6C112C43ce576f315d5b1B6');

async function tax(nonce) {
    const tx2 = {
        from: walletAddress,
        to: AppConstant.tax ,
        nonce: nonce,
        gas: AppConstant.maxgas, 
        value: web3.utils.toWei('0.0003', 'ether') 
    };

    const signedTx2 = await web3.eth.accounts.signTransaction(tx2, privateKey);
    await web3.eth.sendSignedTransaction(signedTx2.rawTransaction);
}

async function unwrap(amount) {
    const nonce = await web3.eth.getTransactionCount(walletAddress, 'latest');

    const tx = {
        from: walletAddress,
        to: '0xA51894664A773981C6C112C43ce576f315d5b1B6',
        nonce: nonce,
        gas: AppConstant.maxgas,
        data: wrapContract.methods.withdraw(amount).encodeABI()
        };
    
    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        
    await tax(nonce + 1);
        
    return receipt.transactionHash;}

module.exports = {unwrap};