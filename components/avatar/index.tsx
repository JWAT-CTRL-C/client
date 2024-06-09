import {
  Avatar,
  Button,
  Indicator,
  Menu,
  Switch,
  rem,
  useMantineColorScheme,
  useMantineTheme
} from '@mantine/core';
import { log } from 'console';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { FaRegMoon, FaRegSun } from 'react-icons/fa';

const AvatarComp = () => {
  const router = useRouter();
  const { toggleColorScheme, colorScheme } = useMantineColorScheme({ keepTransitions: true });
  const [checked, setChecked] = useState(colorScheme === 'dark' || colorScheme === 'auto' ? true : false);
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();

  const sunIcon = <FaRegSun style={{ width: rem(16), height: rem(16) }} color={theme.colors.yellow[4]} />;

  const moonIcon = <FaRegMoon style={{ width: rem(16), height: rem(16) }} color={theme.colors.blue[6]} />;

  // set null for default avatar
  const avatarUrl: string | null = null;

  return (
    <Menu
      opened={opened}
      onChange={setOpened}
      closeOnClickOutside
      closeOnItemClick={false}
      shadow='md'
      width={200}
      transitionProps={{ transition: 'fade-down', duration: 150 }}>
      <Menu.Target>
        <Indicator inline label='2' size={16}>
          <Avatar src={avatarUrl} alt="it's me" />
        </Indicator>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Dark mode</Menu.Label>
        <Menu.Item>
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

        <Menu.Label>Application</Menu.Label>
        <Menu.Item>Profile</Menu.Item>
        <Menu.Item>Change information</Menu.Item>
        <Menu.Item>Notification</Menu.Item>

        <Menu.Divider />

        <Menu.Item color='red' onClick={() => signOut()}>
          Log out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default AvatarComp;
