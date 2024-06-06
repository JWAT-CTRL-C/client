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

  const avatarUrl =
    'data:image/jpeg;base64,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';
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
