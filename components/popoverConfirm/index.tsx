import { Tooltip, Button, Text, Popover, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { ReactNode, useState } from 'react';
const PopoverConfirm = ({
  children,
  title,
  confirmLable,
  cancelLable,
  handleConfirm
}: {
  children: ReactNode;
  title?: string;
  confirmLable?: string;
  cancelLable?: string;
  handleConfirm: () => void;
}) => {
  const [opened, { close, open }] = useDisclosure(false);
  const handleCancel = () => {
    close();
  };
  return (
    <Popover width={200} position='top' withArrow shadow='lg' opened={opened} radius='md'>
      <Popover.Target>
        {React.cloneElement(React.Children.only(children) as React.ReactElement, { onClick: open })}
      </Popover.Target>
      <Popover.Dropdown>
        <div className='px-4 py-2'>
          <Text ta='center'>{title ?? 'Confirm'}</Text>
          <Group mt='md' justify='center'>
            <Button onClick={() => handleConfirm()} variant='filled' color='green'>
              {confirmLable ?? 'Yes'}
            </Button>
            <Button onClick={() => handleCancel()} variant='outline' color='red'>
              {cancelLable ?? 'No'}
            </Button>
          </Group>
        </div>
      </Popover.Dropdown>
    </Popover>
  );
};
export default PopoverConfirm;
