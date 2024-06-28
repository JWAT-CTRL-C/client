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

  return isLoveBlog ? (
    <ActionIcon loading={isLoading} variant='subtle' aria-label='Love' onClick={handleRating}>
      <FaHeart className='text-red-600' />
    </ActionIcon>
  ) : (
    <ActionIcon loading={isLoading} variant='subtle' aria-label='Not Love' onClick={handleRating}>
      <FaRegHeart className='text-red-600' />
    </ActionIcon>
  );
};

export default LoveIcon;
