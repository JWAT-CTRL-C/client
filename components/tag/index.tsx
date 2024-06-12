import { Badge } from '@mantine/core';
import React from 'react';

const TagComp = ({ tag }: { tag: string }) => {
  return (
    <Badge variant='outline' size='sm'>
      {tag}
    </Badge>
  );
};

export default TagComp;
