import { Text } from '@mantine/core';
import { ReactNode } from 'react';
const TextColumn = ({
  children,
  onClick,
  blog_id
}: {
  children: ReactNode;
  onClick: Function;
  blog_id: string | number;
}) => {
  return (
    <Text className='cursor-pointer' fw={500} onClick={() => onClick && onClick(blog_id)}>
      {children}
    </Text>
  );
};

export default TextColumn;
