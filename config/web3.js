require('dotenv').config();
const Web3 = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider('https://rpc.taiko.xyz'));
const privateKey = process.env.PRIVATE_KEY;
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
const walletAddress = account.address;

console.log("Wallet Address:", walletAddress);

module.exports = {
    web3,
    walletAddress,
    privateKey
};