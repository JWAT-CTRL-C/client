import { SimpleGrid } from '@mantine/core';
import WorkspaceCard from './workspaceCard';

export default function WorkspaceList() {
  // todo: comment when pushing
  const fakeData = [
    {
      wksp_id: '1',
      wksp_name: 'Workspace 1',
      wksp_desc: 'Workspace 1 Description',
      users: [
        {
          user_id: 1,
          usrn: 'User 1'
        }
      ]
    },
    {
      wksp_id: '2',
      wksp_name: 'Workspace 2',
      wksp_desc: 'Workspace 2 Description',
      users: [
        {
          user_id: 1,
          usrn: 'User 1'
        },
        {
          user_id: 2,
          usrn: 'User 2'
        },
        {
          user_id: 3,
          usrn: 'User 3'
        },
        {
          user_id: 4,
          usrn: 'User 4'
        },
        {
          user_id: 5,
          usrn: 'User 5'
        },
        {
          user_id: 6,
          usrn: 'User 6'
        }
      ]
    },
    {
      wksp_id: '3',
      wksp_name: 'Workspace 3',
      wksp_desc: 'Workspace 3 Description',
      users: [
        {
          user_id: 1,
          usrn: 'User 1'
        }
      ]
    },
    {
      wksp_id: '4',
      wksp_name: 'Workspace 4',
      wksp_desc: 'Workspace 4 Description',
      users: [
        {
          user_id: 1,
          usrn: 'User 1'
        }
      ]
    }
  ];
  return (
    <div className='flex w-full justify-center px-1 py-2 md:px-3 md:py-5'>
      <SimpleGrid
        cols={{ sm: 1, md: 2, lg: 3 }}
        spacing={{ base: 'xl', md: 'xl' }}
        verticalSpacing={{ base: 'md', md: 'lg' }}>
        {fakeData.map((data, index) => {
          return <WorkspaceCard value={{ ...data, index }} key={data.wksp_id} />;
        })}
      </SimpleGrid>
    </div>
  );
}
