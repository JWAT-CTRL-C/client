import { ActionIcon, Flex } from '@mantine/core';
import { ReactNode } from 'react';

const IconColumn = ({
  children,
  onClick,
  blog_id,
  isRed = false
}: {
  children: ReactNode;
  onClick: Function;
  blog_id: string | number;
  isRed?: boolean;
}) => {
  return (
    <Flex justify='center' onClick={() => onClick && onClick(blog_id)}>
      {isRed && <ActionIcon bg={'red'}>{children}</ActionIcon>}

      {!isRed && <ActionIcon>{children}</ActionIcon>}
    </Flex>
  );
};

export default IconColumn;
