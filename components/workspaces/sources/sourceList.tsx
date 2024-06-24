import { Box, Button, Collapse } from '@mantine/core';
import SourceItem from './sourceItem';
import { useDisclosure } from '@mantine/hooks';
import { cn, useBreakpoint } from '@/libs/utils';
import { RESOURCE_TYPE } from '@/services/resourceServices';
import _ from 'lodash';

export default function SourceList({ resources = [] }: { resources?: RESOURCE_TYPE[] }) {
  const [opened, { toggle }] = useDisclosure(false);
  const breakpoint = useBreakpoint();
  const breakpointType: { [breakpoint: string]: { length: number } } = {
    lg: {
      length: 3
    },
    md: {
      length: 3
    },
    sm: {
      length: 2
    },
    xs: {
      length: 1
    }
  };
  if (_.isEmpty(resources)) {
    return <div className='bg-slate-100 p-5'> No resources</div>;
  }
  return (
    <div className='p-3'>
      <Box className='mb-2 flex justify-end'>
        <Button
          onClick={toggle}
          variant='outline'
          className={cn(resources.length > breakpointType[breakpoint].length ? '' : 'hidden')}>
          {!opened ? 'View all' : 'View less'}
        </Button>
      </Box>
      <Box
        className={cn('grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3', !opened ? 'h-auto' : 'hidden')}>
        {resources.map((item, index) => {
          return index < breakpointType[breakpoint].length && <SourceItem key={index} value={item} />;
        })}
      </Box>
      <Collapse in={opened} animateOpacity={false} transitionDuration={0}>
        <div
          className={cn(
            'grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3',
            opened ? 'h-auto' : 'hidden'
          )}>
          {resources.map((item, index) => {
            return <SourceItem key={index} value={item} />;
          })}
        </div>
      </Collapse>
    </div>
  );
}
