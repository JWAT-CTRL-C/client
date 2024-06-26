import IconColumn from '@/components/blogTable/iconColumn';
import { Button, Flex, Popover, Text, Title, Tooltip } from '@mantine/core';
import React, { useState } from 'react';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';

type Props = {
  blog_id: string;
  onClickEditFunction: (id: string | number) => void;
  onClickDeleteFunction: (blog_id: string) => void;
};

const BlogPopover = ({ blog_id, onClickEditFunction, onClickDeleteFunction }: Props) => {
  const [opened, setOpened] = useState(false);
  return (
    <Popover width={100} position='bottom' withArrow shadow='md' opened={opened} onChange={setOpened}>
      <Popover.Target>
        <Button variant='subtle' onClick={() => setOpened((o) => !o)}>
          ...
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <div className=''>
          <Flex justify={'space-between'}>
            <Tooltip label='Edit'>
              <IconColumn blog_id={blog_id} onClick={onClickEditFunction}>
                <FaRegEdit />
              </IconColumn>
            </Tooltip>
            <Tooltip label='Delete'>
              <IconColumn isRed={true} blog_id={blog_id} onClick={onClickDeleteFunction}>
                <FaRegTrashAlt />
              </IconColumn>
            </Tooltip>
          </Flex>
        </div>
      </Popover.Dropdown>
    </Popover>
  );
};

export default BlogPopover;
