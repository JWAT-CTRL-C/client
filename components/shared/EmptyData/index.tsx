import { Image } from '@mantine/core';
import * as React from 'react';

export interface INoDataProps {
  title: string;
}

export default function NoData({ title }: INoDataProps) {
  return (
    <div className='flex-center flex-col'>
      <Image
        src='/images/nodata.png'
        alt='No blogs'
        className='mx-auto w-20 lg:w-40'
        width={500}
        height={500}
      />
      <span className='text-center'>{title}</span>
    </div>
  );
}
