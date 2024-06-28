import { User } from '@/libs/types/userType';
import { ActionIcon, Flex } from '@mantine/core';
import { ReactNode, forwardRef } from 'react';

const IconColumn = forwardRef<
  HTMLDivElement,
  {
    children: ReactNode;
    onClick: Function;
    blog_id: string | number;
    isRed?: boolean;
    isYellow?: boolean;
    isLoading?: boolean;
    isActive?: boolean;
  }
>(({ children, onClick, blog_id, isRed = false, isLoading, isYellow = false, isActive }, ref) => {
  return (
    <Flex justify='center' ref={ref}>
      {isRed ? (
        <ActionIcon
          className={`${isActive ? 'bg-red-500' : 'pointer-events-none cursor-not-allowed bg-gray-400'}`}
          disabled={!isActive}
          onClick={() => onClick(blog_id)}>
          {children}
        </ActionIcon>
      ) : (
        <ActionIcon
          className={`${!isActive ? 'bg-yellow-500' : 'pointer-events-none cursor-not-allowed bg-gray-400'} ${isYellow && 'bg-yellow-500'}`}
          disabled={isActive === true}
          loading={isLoading}
          onClick={() => onClick(blog_id)}>
          {children}
        </ActionIcon>
      )}
    </Flex>
  );
});

export default IconColumn;
