import { ActionIcon } from '@mantine/core';
import React from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const LoveIcon = ({
  isLoveBlog,
  isLoading,
  onRating
}: {
  isLoveBlog: boolean;
  isLoading: boolean;
  onRating: Function | undefined;
}) => {
  const handleRating = async () => {
    onRating && (await onRating());
  };

  return (
    <div onClick={handleRating}>
      {isLoveBlog && (
        <ActionIcon loading={isLoading} variant='subtle' aria-label='Love'>
          <FaHeart className='text-red-600' />
        </ActionIcon>
      )}
      {!isLoveBlog && (
        <ActionIcon loading={isLoading} variant='subtle' aria-label='Not Love'>
          <FaRegHeart className='text-red-600' />
        </ActionIcon>
      )}
    </div>
  );
};

export default LoveIcon;
