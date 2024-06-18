import { RESOURCE_TYPE } from '@/services/resourceServices';
import { SPECIFIC_WORKSPACE_RESPONSE } from '@/services/workspaceServices';
import { Text } from '@mantine/core';
import { useRouter } from 'next/navigation';

export default function SourceItem({ value }: { value: RESOURCE_TYPE }) {
  const router = useRouter();
  const handleClick = (url: string) => {
    router.push(url);
  };
  return (
    <div
      className='border-collapse overflow-hidden rounded-md border bg-gray-100 px-3 py-2 hover:cursor-pointer sm:px-4 sm:py-3 md:px-5 md:py-4 lg:px-6 lg:py-5 xl:px-8 xl:py-6 2xl:px-10 2xl:py-7'
      onClick={() => handleClick(value.resrc_url)}>
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
