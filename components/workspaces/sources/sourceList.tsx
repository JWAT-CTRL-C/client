import { Box, Button, Collapse } from '@mantine/core';
import SourceItem from './sourceItem';
import { useDisclosure } from '@mantine/hooks';
import { cn } from '@/libs/utils';

const data = [
  {
    src_id: '1',
    src_name: 'Source 1',
    src_url: 'https://example.com',
    crd_at: new Date(),
    upd_at: new Date()
  },
  {
    src_id: '2',
    src_name: 'Source 2',
    src_url: 'https://example.com',
    crd_at: new Date(),
    upd_at: new Date()
  },
  {
    src_id: '3',
    src_name: 'Source 3',
    src_url: 'https://example.com',
    crd_at: new Date(),
    upd_at: new Date()
  },
  {
    src_id: '4',
    src_name: 'Source 4',
    src_url: 'https://example.com',
    crd_at: new Date(),
    upd_at: new Date()
  },
  {
    src_id: '5',
    src_name: 'Source 5',
    src_url: 'https://example.com',
    crd_at: new Date(),
    upd_at: new Date()
  },
  {
    src_id: '6',
    src_name: 'Source 6',
    src_url: 'https://example.com',
    crd_at: new Date(),
    upd_at: new Date()
  }
];
export default function SourceList() {
  const [opened, { toggle }] = useDisclosure(false);
  return (
    <div className='p-3 min-h-[30vh]'>
      <Box className='mb-2 flex justify-end'>
        <Button onClick={toggle} variant='outline' className={cn(data.length > 3 ? '' : 'hidden')}>
          {!opened?"View all":"View less"}
        </Button>
      </Box>
      <Box className={cn('grid grid-cols-3 gap-4', !opened ? 'h-auto' : 'hidden')}>
        {data.map((item, index) => {
          if (index > 2) return null;
          return <SourceItem key={index} value={item} />;
        })}
      </Box>
      <Collapse in={opened} animateOpacity={false} transitionDuration={0}>
        <div className={cn('grid grid-cols-3 gap-4', opened ? 'h-auto' : 'hidden')}>
          {data.map((item, index) => {
            return <SourceItem key={index} value={item} />;
          })}
        </div>
      </Collapse>
    </div>
  );
}
