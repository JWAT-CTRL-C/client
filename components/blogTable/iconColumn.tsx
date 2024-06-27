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
  }
>(({ children, onClick, blog_id, isRed = false, isLoading, isYellow = false }, ref) => {
  return (
    <Flex justify='center' ref={ref}>
      {isRed ? (
        <ActionIcon bg={'red'} onClick={() => onClick(blog_id)}>
          {children}
        </ActionIcon>
      ) : (
        <ActionIcon bg={isYellow ? 'yellow' : 'violet'} loading={isLoading} onClick={() => onClick(blog_id)}>
          {children}
        </ActionIcon>
      )}
    </Flex>
  );
});

export default IconColumn;
