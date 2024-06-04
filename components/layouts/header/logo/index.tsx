import React from 'react';
import Image from 'next/image';
import syllabusLogo from '@/public/images/logo.svg';
const Logo = () => {
  return (
    <div className='flex items-center'>
      {' '}
      <Image src={syllabusLogo} alt={''} width={36} height={36} />
      <h2 className='ml-1 text-2xl'>Syllabus</h2>
    </div>
  );
};

export default Logo;
