import { Alert } from '@mantine/core';
import { IoInformationCircle } from 'react-icons/io5';
import Cookies from 'js-cookie';
import { useState } from 'react';

interface TokenExpiredProps {
  expired: boolean;
}

export default function TokenExpired({ expired }: TokenExpiredProps) {
  const icon = <IoInformationCircle />;

  const [isExpired, setIsExpired] = useState(!!expired);

  const onClose = () => {
    Cookies.remove('expired');
    setIsExpired(false);
  };

  return isExpired ? (
    <Alert
      m='lg'
      h='fit-content'
      variant='filled'
      color='red'
      title='Token expired'
      icon={icon}
      withCloseButton
      onClose={onClose}>
      Your token has expired, please login again
    </Alert>
  ) : null;
}
