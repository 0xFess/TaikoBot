require('dotenv').config();
const Web3 = require('web3');

const rpcUrls = [
    'https://rpc.taiko.xyz',
    'https://rpc.mainnet.taiko.xyz',
    'https://rpc.ankr.com/taiko',
    'https://rpc.taiko.tools',
    'https://taiko.blockpi.network/v1/rpc/public'
];

let currentRpcIndex = 0;

function getWeb3() {
    const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrls[currentRpcIndex]));
    return web3;
}

function switchRpc() {
    currentRpcIndex = (currentRpcIndex + 1) % rpcUrls.length;
    console.log(`Switching to RPC: ${rpcUrls[currentRpcIndex]}`);
    return getWeb3();
}

const web3 = getWeb3();
const privateKey = process.env.PRIVATE_KEY;
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
const walletAddress = account.address;

console.log("Wallet Address:", walletAddress);

module.exports = {
    getWeb3,
    web3,
    walletAddress,
    privateKey,
    switchRpc
};
