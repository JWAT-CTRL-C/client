import { FaUserCog } from 'react-icons/fa';

import { Modal, NavLink, Tabs } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import GeneralForm from './GeneralForm';
import PasswordForm from './PasswordForm';

function ChangeInformation() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title='Profile information'
        centered
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3
        }}>
        <Tabs defaultValue='general'>
          <Tabs.List justify='center'>
            <Tabs.Tab value='general'>General</Tabs.Tab>
            <Tabs.Tab value='password'>Password</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value='general'>
            <GeneralForm opened={opened} close={close} />
          </Tabs.Panel>
          <Tabs.Panel value='password'>
            <PasswordForm close={close} />
          </Tabs.Panel>
        </Tabs>
      </Modal>

      <NavLink
        label='Profile'
        className={`my-5 cursor-pointer rounded-md p-4`}
        onClick={open}
        leftSection={<FaUserCog size={20} />}></NavLink>
    </>
  );
}

export default ChangeInformation;
