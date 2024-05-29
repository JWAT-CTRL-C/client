import { Button, ButtonProps } from '@mantine/core';
import { BsTwitter } from 'react-icons/bs';

export function TwitterButton(props: ButtonProps & React.ComponentPropsWithoutRef<'button'>) {
  return (
    <Button
      leftSection={<BsTwitter style={{ width: '1rem', height: '1rem' }} color='#00ACEE' />}
      variant='default'
      {...props}
    />
  );
}
