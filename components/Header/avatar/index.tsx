import { useMyInfo } from '@/libs/hooks/queries/userQueries';
import { removeUserAuth } from '@/libs/utils';
import { Avatar, Menu, Skeleton, Switch, rem, useMantineColorScheme, useMantineTheme } from '@mantine/core';

import { useRouter } from 'next/router';
import { useState } from 'react';
import { FaRegMoon, FaRegSun } from 'react-icons/fa';

const AvatarComp = () => {
  const router = useRouter();
  const { toggleColorScheme, colorScheme } = useMantineColorScheme({ keepTransitions: true });
  const [checked, setChecked] = useState(colorScheme === 'dark' || colorScheme === 'auto' ? true : false);
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();

  const sunIcon = <FaRegSun style={{ width: rem(16), height: rem(16) }} color={theme.colors.yellow[4]} />;

  const moonIcon = <FaRegMoon style={{ width: rem(16), height: rem(16) }} color={theme.colors.blue[6]} />;

  const { user, isPending } = useMyInfo();

  return (
    <Menu
      opened={opened}
      onChange={setOpened}
      closeOnClickOutside
      closeOnItemClick
      shadow='md'
      disabled={isPending}
      width={200}
      transitionProps={{ transition: 'fade-down', duration: 150 }}>
      <Menu.Target>
        {isPending ? (
          <Skeleton circle h={40} w={40} />
        ) : (
          <Avatar
            className='cursor-pointer'
            src={user?.avatar || '/images/default-avatar.png'}
            alt="it's me"
          />
        )}
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>
          {user?.fuln} #{user?.user_id}
        </Menu.Label>
        <Menu.Divider />
        <Menu.Label>Dark mode</Menu.Label>
        <Menu.Item closeMenuOnClick={false}>
          <Switch
            checked={checked}
            onChange={(event) => setChecked(event.currentTarget.checked)}
            onClick={toggleColorScheme}
            size='md'
            color='dark.4'
            onLabel={moonIcon}
            offLabel={sunIcon}
          />
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item
          color='red'
          onClick={() => {
            router.push('/auth');
            removeUserAuth();
          }}>
          Log out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default AvatarComp;
