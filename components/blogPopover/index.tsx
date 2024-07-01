import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Flex, Popover, Tooltip } from '@mantine/core';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
import { FiRotateCcw } from 'react-icons/fi';
import { HiDotsHorizontal } from 'react-icons/hi';

import IconColumn from '@/components/blogTable/iconColumn';
import { User } from '@/libs/types/userType';
import FormModalAdmin from '@/components/adminComp/formModal';
import { useDisclosure } from '@mantine/hooks';

type Props = {
  id: string;
  onClickEditFunction: (id: string | number) => void;
  onClickDeleteFunction: (id: string) => void;
  isLoading?: boolean;
  onClickRestore?: (id: string) => void;
  user?: User;
};

const BlogPopover = ({
  id,
  onClickEditFunction,
  onClickDeleteFunction,
  isLoading,
  onClickRestore,
  user
}: Props) => {
  const [opened, setOpened] = useState(false);

  return (
    <Popover
      closeOnClickOutside={true}
      onChange={setOpened}
      width={100}
      position='bottom'
      withArrow
      shadow='md'
      opened={opened}>
      <Popover.Target>
        <Button variant='subtle' onClick={() => setOpened((o) => !o)}>
          <HiDotsHorizontal />
        </Button>
      </Popover.Target>
      <Popover.Dropdown className='overflow-clip'>
        <div className='overflow-clip'>
          <Flex justify='space-between'>
            {user && (
              <Tooltip label='Edit'>
                <div onClick={() => setOpened(true)} onContextMenu={() => setOpened(true)}>
                  <FormModalAdmin user={user} />
                </div>
              </Tooltip>
            )}

            {!user && (
              <Tooltip label='Edit'>
                <div>
                  <IconColumn blog_id={id} onClick={onClickEditFunction}>
                    <FaRegEdit />
                  </IconColumn>
                </div>
              </Tooltip>
            )}
            <Tooltip label='Delete'>
              <div>
                <IconColumn isRed={true} blog_id={id} onClick={onClickDeleteFunction}>
                  <FaRegTrashAlt />
                </IconColumn>
              </div>
            </Tooltip>
            {onClickRestore && (
              <Tooltip label='Restore'>
                <IconColumn blog_id={id} onClick={onClickRestore}>
                  <FiRotateCcw />
                </IconColumn>
              </Tooltip>
            )}
          </Flex>
        </div>
      </Popover.Dropdown>
    </Popover>
  );
};

export default BlogPopover;
