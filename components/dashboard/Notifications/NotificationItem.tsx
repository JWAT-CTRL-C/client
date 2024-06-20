import { Text, Avatar, Group, TypographyStylesProvider, Paper } from '@mantine/core';

export function NotificationItem() {
  return (
    <Paper withBorder radius='md' className='px-2 py-4'>
      <Group>
        <Avatar
          src='https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png'
          alt='Jacob Warnhalter'
          radius='xl'
        />
        <div>
          <Text fz='sm'>Jacob Warnhalter</Text>
          <Text fz='xs' c='dimmed'>
            10 minutes ago
          </Text>
        </div>
      </Group>
      <TypographyStylesProvider className='pl-14 pt-4'>
        <div
          className='[&_>_p:last-child]:mb-0'
          dangerouslySetInnerHTML={{
            __html:
              '<p>I use <a href="https://heroku.com/" rel="noopener noreferrer" target="_blank">Heroku</a> to host my Node.js application, but MongoDB add-on appears to be too <strong>expensive</strong>. I consider switching to <a href="https://www.digitalocean.com/" rel="noopener noreferrer" target="_blank">Digital Ocean</a> VPS to save some cash.</p>'
          }}
        />
      </TypographyStylesProvider>
    </Paper>
  );
}
