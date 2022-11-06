import Unfollow from '@components/Shared/Unfollow';
import UserProfile from '@components/Shared/UserProfile';
import type { Profile } from '@generated/types';
import { ChevronLeftIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { ethers } from 'ethers';
import { getCost } from '../../_impression_helpers/helpers';

import Follow from '../Shared/Follow';

interface Props {
  profile?: Profile;
}

const MessageHeader: FC<Props> = ({ profile }) => {
  const router = useRouter();
  const [following, setFollowing] = useState(true);

  const [price, setPrice] = useState<string>("");
  useEffect(() => {
    (async () => {
      const currentPrice = await getCost(profile?.ownedBy);

      setPrice(ethers.utils.formatEther(currentPrice));
    })();

  }, []);

  const onBackClick = () => {
    router.push('/messages');
  };

  useEffect(() => {
    setFollowing(profile?.isFollowedByMe ?? false);
  }, [profile?.isFollowedByMe, profile]);

  if (!profile) {
    return null;
  }

  return (
    <div className="dark:border-gray-700/80 flex items-center justify-between px-4 py-2 border-b-[1px]">
      <div className="flex items-center">
        <ChevronLeftIcon onClick={onBackClick} className="w-6 h-6 mr-1 lg:hidden cursor-pointer" />
        <UserProfile profile={profile} />
        <div className=" border-brand-600 border-2 rounded-lg py-1 px-1 ml-2">
          <p className="text-sm">Attention Value: {price} IMP</p>
        </div>
      </div>
      {!following ? (
        <Follow showText profile={profile} setFollowing={setFollowing} />
      ) : (
        <Unfollow showText profile={profile} setFollowing={setFollowing} />
      )}
    </div>
  );
};

export default MessageHeader;
