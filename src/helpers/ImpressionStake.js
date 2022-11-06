const impressionStakeJSON = require('../abis/ImpressionStake.json');

const { ethers } = require('ethers');
const { keccak256 } = require('ethers/lib/utils');

// require('dotenv').config();

const IMPRESSION_TOKEN_ADDRESS = '0xb1151AAC9eA4F4151779a57e030119bbE3E0D5d1';
const IMPRESSION_STAKE_ADDRESS = '0x250Af4E4d69dE7bf6f0d33E7C3C465F91c704505';
const SIGNER_KEY = '1111111111111111111111111111111111111111111111111111111111111111';
const RPC = 'https://rpc-mumbai.maticvigil.com';

const networkProvider = new ethers.providers.JsonRpcProvider(RPC);
const impressionStake = new ethers.Contract(
  IMPRESSION_STAKE_ADDRESS,
  impressionStakeJSON.abi,
  networkProvider
);

// Function to create a message request
const requestMessage = async (to, amt, message) => {
  try {
    await impressionStake.requestMessage(to, amt, hashMessage(message));
  } catch (e) {
    console.log(e);
  }
};

// Function to claim a message request
const claimMessage = async (requestId, signature, textMessageHash) => {
  try {
    await impressionStake.claimMessage(requestId, signature, textMessageHash);
  } catch (e) {
    console.log(e);
  }
};

// Function to hash a message
export const hashMessage = (message) => {
  try {
    const hash = ethers.utils.solidityKeccak256(['string'], [message]);
    return hash;
  } catch (e) {
    console.log(e);
  }
};
// Function to get signature
export const getSignatureHelper = async (requestId, message, signer) => {
  try {
    console.log("message", message);

    // const signer = new ethers.Wallet(SIGNER_KEY, networkProvider);

    // Hash the text message
    let textMessageHash = hashMessage(message);
    
    // console.log("ADDRESS", signer._address); 
    // console.log(signer.address);
    // Hash the message to be signed (not textMessage)
    let msgHash = ethers.utils.solidityKeccak256(
      ['uint256', 'address', 'bytes'],
      [requestId, signer._address, textMessageHash]
    );

    console.log(msgHash);
    // Sign the message hash using your private key, not the receiver's
    const signature = await signer.signMessage(ethers.utils.arrayify(msgHash));
    return signature;
  } catch (e) {
    console.log("ERROR", e);
  }
};
