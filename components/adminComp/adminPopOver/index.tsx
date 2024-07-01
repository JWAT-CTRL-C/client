import { useState } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { FiKey, FiRotateCcw } from 'react-icons/fi';
import { HiDotsHorizontal } from 'react-icons/hi';

import FormModalAdmin from '@/components/adminComp/formModal';
import { User } from '@/libs/types/userType';
import { ActionIcon, Button, Flex, Popover, Tooltip } from '@mantine/core';

type Props = {
  id: string | number;
  onClickDeleteFunction: (id: string) => void;
  onClickRestore: (id: string) => void;
  onClickReset: (id: string) => void;
  user?: User;
};

const AdminPopover = ({ id, onClickDeleteFunction, onClickRestore, user, onClickReset }: Props) => {
  const [opened, setOpened] = useState(false);
  const isActive = user ? !user.deleted_at : true;

  return (
    <Popover
      zIndex={10}
      closeOnClickOutside={true}
      onChange={setOpened}
      width={180}
      position='bottom'
      withArrow
      shadow='md'
      keepMounted
      opened={opened}>
      <Popover.Target>
        <Button variant='subtle' onClick={() => setOpened((o) => !o)}>
          <HiDotsHorizontal />
        </Button>
      </Popover.Target>
      <Popover.Dropdown className='overflow-clip'>
        <div className='overflow-clip'>
          <Flex justify='space-between'>
            <Tooltip label='Edit'>
              <div onClick={() => setOpened(true)} onContextMenu={() => setOpened(true)}>
                <FormModalAdmin user={user} />
              </div>
            </Tooltip>

            <Tooltip label='Reset Password'>
              <ActionIcon
                className='bg-blue-500 hover:bg-blue-500 focus:bg-blue-500'
                onClick={() => onClickReset(id as string)}>
                <FiKey />
              </ActionIcon>
            </Tooltip>

            <Tooltip label='Delete'>
              <ActionIcon
                className={`${isActive ? 'bg-red-500 hover:bg-red-500 focus:bg-red-500' : 'cursor-not-allowed bg-gray-400'}`}
                disabled={!isActive}
                onClick={() => onClickDeleteFunction(id as string)}>
                <FaRegTrashAlt />
              </ActionIcon>
            </Tooltip>

            <Tooltip label='Restore'>
              <ActionIcon
                className={`${!isActive ? 'bg-yellow-500 hover:bg-yellow-500 focus:bg-yellow-500' : 'cursor-not-allowed bg-gray-400'}`}
                disabled={isActive}
                onClick={() => onClickRestore(id as string)}>
                <FiRotateCcw />
              </ActionIcon>
            </Tooltip>
          </Flex>
        </div>
      </Popover.Dropdown>
    </Popover>
  );
};

export default AdminPopover;
