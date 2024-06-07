import React from 'react';
import Image from 'next/image';
import SynergyLogo from '@/public/images/logo.svg';
const Logo = () => {
  return (
    <div className='flex items-center'>
      {' '}
      <Image src={SynergyLogo} alt={''} width={36} height={36} />
      <h2 className='ml-1 text-2xl'>Synergy</h2>
    </div>
  );
};

export default Logo;
