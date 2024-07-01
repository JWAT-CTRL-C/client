import { Can, useAbility } from '@/providers/AbilityProvider';
import { Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useRouter } from 'next/router';
import { FaBlog, FaBriefcase, FaBullhorn, FaPlus } from 'react-icons/fa';
import CreateWorkspaceForm from '../workspaces/createForm';
import CreateNotificationForm from '../Notifications/CreateForm';
import { useState } from 'react';
import { useFetchWorkspaceById } from '@/libs/hooks/queries/workspaceQueries';
import { subject } from '@casl/ability';

export default function FloatingButton() {
  const router = useRouter();
  const ability = useAbility();

  const [openedCreateWksp, { toggle: toggleCreateWksp }] = useDisclosure(false);
  const [openedCreateNoti, setOpenedCreateNoti] = useState(false);

  const { workspace } = useFetchWorkspaceById(router.query.id as string);

  const inWorkspace = router.pathname.includes('/workspaces');
  const canCreateGlobalNoti = ability.can('create', 'global_notification');
  const canCreateWorkspaceNoti = ability.can('edit', subject('workspace', workspace!)); // edit permission is used for creating notification

  const handleOpenCreateNoti = () => setOpenedCreateNoti(true);

  const handleCloseCreateNoti = () => setOpenedCreateNoti(false);

  return (
    <div className='group fixed bottom-5 right-24 flex h-24 w-24 items-end justify-end p-2 *:cursor-pointer'>
      <div className='flex-center absolute z-50 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 p-3 text-white shadow-xl'>
        <FaPlus className='size-6' />
      </div>

      <Tooltip
        label='Create new blog'
        position='top'
        withArrow
        arrowOffset={10}
        maw={300}
        multiline
        transitionProps={{ duration: 300 }}
        offset={10}>
        <div
          className='flex-center absolute scale-100 scale-y-0 rounded-full bg-green-400 p-2 text-white transition-all duration-200 ease-out hover:bg-green-500 hover:p-3 group-hover:-translate-y-16 group-hover:scale-y-100'
          onClick={() => router.push('/blogs/create')}>
          <FaBlog className='size-6' />
        </div>
      </Tooltip>

      <Can I='create' a='workspace'>
        <Tooltip
          label='Create new workspace'
          position='left'
          withArrow
          arrowOffset={10}
          maw={300}
          multiline
          transitionProps={{ duration: 300 }}
          offset={10}>
          <div
            className='flex-center absolute scale-x-0 rounded-full bg-blue-400 p-2 text-white transition-all duration-200 ease-out hover:bg-blue-500 hover:p-3 group-hover:-translate-x-14 group-hover:-translate-y-14 group-hover:scale-x-100'
            onClick={toggleCreateWksp}>
            <FaBriefcase className='size-6' />
          </div>
        </Tooltip>
        <CreateWorkspaceForm opened={openedCreateWksp} handleClose={toggleCreateWksp} />
      </Can>

      {(canCreateGlobalNoti || (inWorkspace && canCreateWorkspaceNoti)) && (
        <>
          <Tooltip
            label='Create new notification'
            position='left'
            withArrow
            arrowOffset={10}
            maw={300}
            multiline
            transitionProps={{ duration: 300 }}
            offset={10}>
            <div
              className='flex-center absolute scale-x-0 rounded-full bg-yellow-400 p-2 text-white transition-all duration-200 ease-out hover:bg-yellow-500 hover:p-3 group-hover:-translate-x-16 group-hover:scale-x-100'
              onClick={handleOpenCreateNoti}>
              <FaBullhorn className='size-6' />
            </div>
          </Tooltip>

          <CreateNotificationForm opened={openedCreateNoti} handleClose={handleCloseCreateNoti} />
        </>
      )}
    </div>
  );
}
