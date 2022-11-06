import { ethers } from "ethers"

import impressionJSON from "../abis/Impression.json";
import impressionStakeJSON from "../abis/ImpressionStake.json";

const RPC = "https://rpc-mumbai.maticvigil.com";
export const IMPRESSION_TOKEN_ADDRESS = "0xb1151AAC9eA4F4151779a57e030119bbE3E0D5d1";
export const IMPRESSION_STAKE_ADDRESS = "0x46387Eb5a91DA39b83eB55B337beeCa67FFcbb34";

const networkProvider = new ethers.providers.JsonRpcProvider(RPC);

export const getBalance = async (
    address: string,
) => {
    const impression = new ethers.Contract(
        IMPRESSION_TOKEN_ADDRESS,
        impressionJSON.abi,
        networkProvider,
    );

    const balance = await impression.balanceOf(address);

    return balance;
}

export const getCost = async (
    address: string,
) => {
    const impressionStake = new ethers.Contract(
        IMPRESSION_STAKE_ADDRESS,
        impressionStakeJSON.abi,
        networkProvider,
    )

    const cost = await impressionStake.userCost(address);

    return cost;
}

export const setCost = async (
    signer: ethers.Signer,
    cost: ethers.BigNumber
) => {
    const impressionStake = new ethers.Contract(
        IMPRESSION_STAKE_ADDRESS,
        impressionStakeJSON.abi,
        signer,
    )

    await impressionStake.setUserCost(cost);
}

export const approve = async (
    signer: ethers.Signer,
    spender: string,
    amount: ethers.BigNumber
) => {
    const impression = new ethers.Contract(
        IMPRESSION_TOKEN_ADDRESS,
        impressionJSON.abi,
        signer,
    );

    await impression.approve(spender, amount);
}

export const requestMessage = async (
    signer: ethers.Signer,
    to: string,
    amount: ethers.BigNumber,
    msgHash: string
) => {
    const impressionStake = new ethers.Contract(
        IMPRESSION_STAKE_ADDRESS,
        impressionStakeJSON.abi,
        signer,
    )

    await impressionStake.requestMessage(to, amount, msgHash);

}