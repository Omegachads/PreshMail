import { useMutation } from '@apollo/client';
import { Button } from '@components/UI/Button';
import { Spinner } from '@components/UI/Spinner';
import useBroadcast from '@components/utils/hooks/useBroadcast';
import type { CreateBurnEip712TypedData, Mutation, Profile } from '@generated/types';
import { CreateUnfollowTypedDataDocument } from '@generated/types';
import { UserRemoveIcon } from '@heroicons/react/outline';
import getSignature from '@lib/getSignature';
import onError from '@lib/onError';
import splitSignature from '@lib/splitSignature';
import type { Signer } from 'ethers';
import { Contract, ethers, BigNumber } from 'ethers';
import type { Dispatch, FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { RELAY_ON, SIGN_WALLET } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { useSigner, useSignTypedData } from 'wagmi';
import { hashMessage, getSignatureHelper } from '../../helpers/ImpressionStake';
let abi = require('../../abis/ImpressionStake.json').abi;
interface Props {}

const claimMessage = async (request: any, message: string, signer: any) => {
  console.log(request);
  let contract = new ethers.Contract('0x46387Eb5a91DA39b83eB55B337beeCa67FFcbb34', abi, signer);
  let requestId = request.requestId;
  console.log(request);
  let signature = await getSignatureHelper(requestId, message, signer);
  let textMessageHash = hashMessage(message);
  // Claim tokens
  console.log(requestId, signature, textMessageHash);

  try {
    await contract.claimMessage(requestId, signature, textMessageHash);
    toast.success(`User successfully claimed ${request.amount ? ethers.utils.formatEther(request.amount) : "some"} tokens`);
    return 'CLAIMED';
  } catch (e) {
    return toast.error('User has already claimed the tokens for this message');
    console.log('ERROR', e);
    return 'ERROR';
  }
  // TODO: FEEDBACK TO USER THAT THEY CLAIMED
};

interface Props {
  request: any;
  message: string;
}

const Claim: FC<Props> = ({ request, message }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { data: signer } = useSigner();
  const [claim, setClaimed] = useState(false);

  return (
    <Button
      className="text-lg !px-3 !py-1.5"
      outline
      onClick={() => claimMessage(request, message, signer)}
      disabled={false}
      variant="success"
      aria-label="Claim"
      //   icon={
      //     <></>
      //   }
    >
      Claim 💰
    </Button>
  );
};

export default Claim;
