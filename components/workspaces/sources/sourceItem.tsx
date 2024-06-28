import { RESOURCE_TYPE } from '@/services/resourceServices';
import { Text } from '@mantine/core';
import { useRouter } from 'next/router';

export default function SourceItem({ value }: { value: RESOURCE_TYPE }) {
  const router = useRouter();
  const wksp_id = router.query.id as string;
  const handleClick = () => {
    router.push(`/workspaces/${wksp_id}/resources/${value.resrc_id}/view`);
  };
  return (
    <div
      className='col-span-1 overflow-hidden rounded-md bg-muted px-3 py-2 hover:cursor-pointer sm:px-4 sm:py-3 md:px-5 md:py-4 lg:px-6 lg:py-5 xl:px-8 xl:py-6 2xl:px-10 2xl:py-7'
      onClick={() => handleClick()}>
      <div className='truncate'>
        <Text>{value.resrc_name}</Text>
      </div>
      <div className='truncate'>
        <Text c='dimmed' size='sm'>
          {value.resrc_url}
        </Text>
      </div>
    </div>
  );
}
