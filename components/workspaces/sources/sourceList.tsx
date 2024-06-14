import { Box, Button, Collapse } from '@mantine/core';
import SourceItem from './sourceItem';
import { useDisclosure } from '@mantine/hooks';
import { cn } from '@/libs/utils';
import { RESOURCE_TYPE } from '@/services/resourceServices';

export default function SourceList({ resources = [] }: { resources?: RESOURCE_TYPE[] }) {
  const [opened, { toggle }] = useDisclosure(false);
  return (
    <div className='min-h-[30vh] p-3'>
      <Box className='mb-2 flex justify-end'>
        <Button onClick={toggle} variant='outline' className={cn(resources.length > 3 ? '' : 'hidden')}>
          {!opened ? 'View all' : 'View less'}
        </Button>
      </Box>
      <Box
        className={cn('grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3', !opened ? 'h-auto' : 'hidden')}>
        {resources.map((item, index) => {
          return <SourceItem key={index} value={item} />;
        })}
      </Box>
      <Collapse in={opened} animateOpacity={false} transitionDuration={0}>
        <div className={cn('grid grid-cols-3 gap-4', opened ? 'h-auto' : 'hidden')}>
          {resources.map((item, index) => {
            return <SourceItem key={index} value={item} />;
          })}
        </div>
      </Collapse>
    </div>
  );
}
