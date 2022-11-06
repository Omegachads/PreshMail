const impressionJSON = require("../abi/Impression.json");
const { ethers } = require("ethers");

require("dotenv").config();
const IMPRESSION_TOKEN_ADDRESS = process.env.IMPRESSION_TOKEN_ADDRESS;

const SIGNER_KEY = process.env.SIGNER_KEY;
const RPC = process.env.RPC;
const networkProvider = new ethers.providers.JsonRpcProvider(RPC);
const signer = new ethers.Wallet(SIGNER_KEY, networkProvider);
const impression = new ethers.Contract(IMPRESSION_TOKEN_ADDRESS, impressionJSON.abi, networkProvider);

// Function to get balance of tokens of a certain address
const getBalance = async (address) => {
  try{
  await impression.balanceOf(address);
  } catch (e) {
    console.log(e);
  }
}

// Function to approve tokens to be spent by a certain address
const approve = async (spender, amount) => {
    try{
    await impression.approve(spender, amount);
    } catch (e) {
        console.log(e);
    }
}

