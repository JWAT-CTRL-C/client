import { WorkspaceCardProps, WorkspaceCardPropsExpand } from '@/libs/types/workspace';
import { Avatar, Card, Group, Image, Text, Tooltip } from '@mantine/core';
import colors from '@/assets/json/color_background_theme.json';
import { cn } from '@/libs/utils';
import { useRouter } from 'next/router';
export default function WorkspaceCard({ value }: { value: WorkspaceCardPropsExpand }) {
  const { wksp_name, wksp_desc, wksp_id, users, index } = value;
  const router = useRouter();
  return (
    <Card
      shadow='sm'
      padding='lg'
      component='a'
      onClick={() => router.push(`/workspaces/${wksp_id}`)}
      target='_self'
      radius='md'
      className={cn(
        'w-[60%] min-w-64 hover:cursor-pointer hover:shadow-lg',
        'md:min-w-80 md:max-w-[33%] lg:max-w-[30%]'
      )}>
      <Card.Section>
        <Image
          h={110}
          fallbackSrc={`https://placehold.co/550x300/${colors.backgroundWorkspaceTheme[index]}/404040?text=${wksp_name.toUpperCase()}`}
          alt='Workspace Image'
        />
      </Card.Section>

      <Text fw={500} size='lg' mt='lg' truncate='end'>
        {wksp_name}
      </Text>

      <Text mt='xs' c='dimmed' size='sm' truncate='end'>
        {wksp_desc}
      </Text>
      <Avatar.Group className='mt-2' spacing='xs'>
        {users?.map((user, index) => {
          if (index > 3) return null;
          return (
            <Tooltip label={user.fuln} withArrow key={user.user_id}>
              <Avatar
                src={
                  user.avatar ??
                  `https://placehold.co/50x50/${colors.backgroundWorkspaceTheme[Math.floor(Math.random() * colors.backgroundWorkspaceTheme.length)]}/f2f2f2?text=${user.fuln?.substring(0, 1)}`
                }
                radius='xl'
                size='sm'
              />
            </Tooltip>
          );
        })}
        {users?.length > 4 && <Avatar size='sm'>+{users?.length - 4}</Avatar>}
      </Avatar.Group>
    </Card>
  );
}
