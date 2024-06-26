import { SPECIFIC_WORKSPACE_RESPONSE } from '@/services/workspaceServices';
import { Avatar, Flex, Tooltip } from '@mantine/core';
import { useRouter } from 'next/router';
import colors from '@/assets/json/color_background_theme.json';

export default function MemberList({ members = [] }: { members: SPECIFIC_WORKSPACE_RESPONSE['users'] }) {
  const router = useRouter();
  return (
    <Tooltip.Group openDelay={300} closeDelay={100}>
      <Flex mih={50} gap='lg' justify='flex-start' align='flex-start' direction='row' wrap='wrap'>
        {members.map((member) => (
          <Tooltip label={member.fuln} withArrow key={member.user_id}>
            <Avatar
              src={
                member.avatar ??
                `https://placehold.co/50x50/${colors.backgroundWorkspaceTheme[Math.floor(Math.random() * colors.backgroundWorkspaceTheme.length)]}/f2f2f2?text=${member.fuln?.substring(0, 1)}`
              }
              alt={member.usrn}
              size='md'
              className='border-2 drop-shadow-2xl'
              onClick={() => router.push(`https://youtu.be/watch_popup?v=Ts2Nv8z0lo4`)}
            />
          </Tooltip>
        ))}
      </Flex>
    </Tooltip.Group>
  );
}
