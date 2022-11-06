import { Button } from '@components/UI/Button';
import { Modal } from '@components/UI/Modal';
import { ArrowCircleRightIcon } from '@heroicons/react/outline';
import type { FC } from 'react';
import { useState } from 'react';

import Login from './Login';

const LoginButton: FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <>
      <Modal
        title="Login"
        icon={<ArrowCircleRightIcon className="w-5 h-5 text-brand" />}
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      >
        <Login />
      </Modal>
      <Button
        onClick={() => setShowLoginModal(!showLoginModal)}
      >
        Login
      </Button>
    </>
  );
};

export default LoginButton;
