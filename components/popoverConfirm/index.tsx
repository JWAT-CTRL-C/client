import { Tooltip, Button, Text, Popover, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Children, cloneElement, ReactNode } from 'react';
const PopoverConfirm = ({
  children,
  title,
  confirmLabel,
  cancelLable,
  disabled = false,
  size = 200,
  onConfirm
}: {
  children: ReactNode;
  title?: string;
  confirmLabel?: string;
  cancelLable?: string;
  disabled?: boolean;
  size?: number;
  onConfirm: () => void;
}) => {
  const [opened, { close, open }] = useDisclosure(false);
  const handleCancel = () => {
    close();
  };

  const handleConfirm = () => {
    onConfirm();
    close();
  };
  return (
    <Popover
      width={size}
      position='top'
      withArrow
      shadow='lg'
      opened={opened}
      radius='md'
      disabled={disabled}
      onPositionChange={handleCancel}
      zIndex={10}>
      <Popover.Target>
        {cloneElement(Children.only(children) as React.ReactElement, { onClick: open })}
      </Popover.Target>
      <Popover.Dropdown>
        <div className='px-4 py-2'>
          <Text ta='center'>{title ?? 'Confirm'}</Text>
          <Group mt='md' justify='center'>
            <Button onClick={handleConfirm} variant='filled' color='green' loading={disabled}>
              {confirmLabel ?? 'Yes'}
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
