import MessageIcon from '@components/Messages/MessageIcon';
import NotificationIcon from '@components/Notification/NotificationIcon';
import useStaffMode from '@components/utils/hooks/useStaffMode';
import { Modal } from '@components/UI/Modal';
import { Input } from '@components/UI/Input';
import { Button } from '@components/UI/Button';

import { CurrencyDollarIcon } from '@heroicons/react/outline';
import type { Profile } from '@generated/types';
import { Disclosure } from '@headlessui/react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import hasPrideLogo from '@lib/hasPrideLogo';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect, FC } from 'react';
import { useSigner, useSignTypedData } from 'wagmi';

import { useAppStore } from 'src/store/app';

import MenuItems from './MenuItems';
import MoreNavItems from './MoreNavItems';
import Search from './Search';
import StaffBar from './StaffBar';

import { getBalance, getCost, setCost } from '../../../_impression_helpers/helpers';
import { ethers } from 'ethers';


const Navbar: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { data: signer } = useSigner();

  const [balance, setBalance] = useState<string>("");
  const [price, setPrice] = useState<string>("");

  const [showSetPriceModal, setShowSetPriceModal] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const currentBalance = await getBalance(currentProfile?.ownedBy);

      setBalance(ethers.utils.formatEther(currentBalance));
    })();

  }, [currentProfile]);

  useEffect(() => {
    (async () => {
      const currentPrice = await getCost(currentProfile?.ownedBy);

      setPrice(ethers.utils.formatEther(currentPrice));
    })();

  }, [currentProfile]);

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (price === "") {
      return;
    }

    await setCost(signer, ethers.utils.parseEther(price));
    setShowSetPriceModal(false);
  }

  const { allowed: staffMode } = useStaffMode();
  const router = useRouter();

  const onProfileSelected = (profile: Profile) => {
    router.push(`/u/${profile?.handle}`);
  };

  interface NavItemProps {
    url: string;
    name: string;
    current: boolean;
  }

  const NavItem = ({ url, name, current }: NavItemProps) => {
    return (
      <Link href={url} aria-current={current ? 'page' : undefined}>
        <Disclosure.Button
          className={clsx(
            'w-full text-left px-2 md:px-3 py-1 rounded-md font-bold cursor-pointer text-sm tracking-wide',
            {
              'text-black dark:text-white bg-gray-200 dark:bg-gray-800': current,
              'text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800':
                !current
            }
          )}
        >
          {name}
        </Disclosure.Button>
      </Link>
    );
  };

  const NavItems = () => {
    const { pathname } = useRouter();

    return (
      <>

      </>
    );
  };

  return (
    <Disclosure
      as="header"
      className="sticky top-0 z-10 w-full bg-white border-b dark:bg-gray-900 dark:border-b-gray-700/80"
    >
      {({ open }) => (
        <>
          {staffMode && <StaffBar />}
          <div className="container px-5 mx-auto max-w-screen-xl">
            <div className="flex relative justify-between items-center h-14 sm:h-16">
              <div className="flex justify-start items-center">
                <Disclosure.Button className="inline-flex justify-center items-center mr-4 text-gray-500 rounded-md sm:hidden focus:outline-none">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block w-6 h-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block w-6 h-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
                <Link href="/">
                  <img
                    className="w-8 h-8"
                    height={32}
                    width={32}
                    src={currentProfile && hasPrideLogo(currentProfile) ? '/pride.svg' : '/logo.svg'}
                    alt="Logo"
                  />
                </Link>
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex items-center space-x-4">
                    <div className="hidden lg:block">
                    </div>
                    <NavItems />
                  </div>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                {currentProfile ? (
                  <>
                    <p>Balance: {balance} IMP</p>
                    <button
                      className="bg-brand-500 px-2 py-2 rounded-lg"
                      onClick={() => { setShowSetPriceModal(true) }}
                    >
                      <p>Attention Value: {price} IMP</p>
                    </button>
                    <MessageIcon />
                  </>
                ) : null}
                <MenuItems />
              </div>
            </div>
          </div>

          <>
            <Modal
              title="Set Attention Price in IMP"
              icon={<CurrencyDollarIcon className="w-5 h-5 text-brand" />}
              size="sm"
              show={showSetPriceModal}
              onClose={() => setShowSetPriceModal(false)}
            >
              <div className="px-4 py-4">
                <form onSubmit={handleSubmit}>
                  <Input
                    label="Attention Price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  ></Input>
                  <Button className="my-2" type="submit">Submit</Button>
                </form>
              </div>
            </Modal>
          </>

          <Disclosure.Panel className="sm:hidden">
            <div className="flex flex-col p-3 space-y-2">
              <div className="mb-2">
                <Search hideDropdown onProfileSelected={onProfileSelected} />
              </div>
              <NavItems />
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;
