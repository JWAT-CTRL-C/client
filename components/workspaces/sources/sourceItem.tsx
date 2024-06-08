import { Text } from "@mantine/core";
import { useRouter } from "next/navigation";

export default function SourceItem({ value }: { value: any }) {
    const router = useRouter();
    const handleClick = (url:string) => {
        router.push(url);
    }
    return (
      <div
        className='border-collapse rounded-md border bg-card px-3 py-2 hover:cursor-pointer'
        onClick={()=>handleClick(value.src_url)}>
        <Text>{value.src_name}</Text>
        <Text color='dimmed' size='sm'>
          {value.src_url}
        </Text>
      </div>
    );
}