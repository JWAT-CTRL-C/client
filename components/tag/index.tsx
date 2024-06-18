import { Badge } from '@mantine/core';
import React, { ReactNode } from 'react';

const TagComp = ({ tag }: { tag: ReactNode }) => {
  return (
    <Badge variant='outline' size='sm'>
      {tag}
    </Badge>
  );
};

export default TagComp;
