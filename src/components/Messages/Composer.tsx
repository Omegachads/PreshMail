import { Button } from '@components/UI/Button';
import { Input } from '@components/UI/Input';
import { Spinner } from '@components/UI/Spinner';
import { Modal } from '@components/UI/Modal';
import useWindowSize from '@components/utils/hooks/useWindowSize';
import { ArrowRightIcon, CurrencyDollarIcon } from '@heroicons/react/outline';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MIN_WIDTH_DESKTOP } from 'src/constants';
import type { Profile } from '@generated/types';
import { useAppStore } from 'src/store/app';
import { useMessageStore } from 'src/store/message';
import { useSigner, useSignTypedData } from 'wagmi';
import { ethers, BigNumber } from 'ethers';
import { IMPRESSION_STAKE_ADDRESS, approve, requestMessage } from '../../_impression_helpers/helpers';

interface Props {
  sendMessage: (message: string) => Promise<boolean>;
  conversationKey: string;
  disabledInput: boolean;
}

const Composer: FC<Props> = ({ sendMessage, conversationKey, disabledInput }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const profile = useMessageStore((state) => state.messageProfiles.get(conversationKey));

  const { data: signer } = useSigner();

  const [isAdvertiser, setIsAdvertiser] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [price, setPrice] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);
  const { width } = useWindowSize();

  useEffect(() => {
    setIsAdvertiser(currentProfile ? currentProfile.handle.startsWith("ad") : false);
  }, [currentProfile])

  const canSendMessage = !disabledInput && !sending && message.length > 0;

  const multiHandleSend = async () => {
    if (isAdvertiser) {
      const msgHash = ethers.utils.solidityKeccak256(["string"], [message]);

      await approve(
        signer,
        IMPRESSION_STAKE_ADDRESS,
        ethers.utils.parseEther("1000000"),
      );

      await requestMessage(
        signer,
        profile?.ownedBy,
        ethers.utils.parseEther(price),
        msgHash,
      );

      handleSend();
    } else {
      handleSend();
    }
  }

  const handleSend = async () => {
    if (!canSendMessage) {
      return;
    }
    setSending(true);
    const sent = await sendMessage(message);
    if (sent) {
      setMessage('');
    } else {
      toast.error('Error sending message');
    }
    setSending(false);
  };

  useEffect(() => {
    setMessage('');
  }, [conversationKey]);

  const handleKeyDown = (event: { key: string }) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex space-x-4 p-4">
      <Input
        label="Message"
        type="text"
        placeholder="Send a message here"
        value={message}
        disabled={disabledInput}
        onKeyDown={handleKeyDown}
        onChange={(event) => setMessage(event.target.value)}
      />
      {
        isAdvertiser ?
          <div className="w-3/12">
            <Input
              label="Attention Price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            ></Input>
          </div> : null
      }
      <Button disabled={!canSendMessage} onClick={multiHandleSend} variant="primary" aria-label="Send message">
        <div className="flex items-center space-x-2">
          {Number(width) > MIN_WIDTH_DESKTOP ? <span>Send</span> : null}
          {!sending && <ArrowRightIcon className="h-5 w-5" />}
          {sending && <Spinner size="sm" className="h-5 w-5" />}
        </div>
      </Button>
    </div>
  );
};

export default Composer;
