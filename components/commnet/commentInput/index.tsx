import { useMyInfo } from '@/libs/hooks/queries/userQueries';
import { Avatar, Button, Card, Flex, Textarea, Text } from '@mantine/core';
import { useState } from 'react';

const CommnetInput = ({ onComment, loading = false }: { onComment: Function; loading?: boolean }) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const { user } = useMyInfo();

  const handleComment = () => {
    if (!value) {
      setError('Please enter a comment before submit');
    }
    onComment && onComment(value);
  };

  const handleClear = () => {
    setValue(''), setError('');
  };
  return (
    <Card className='flex-column flex gap-3' shadow='sm' padding='lg' radius='md' withBorder>
      <Flex align='center' gap={7}>
        <Avatar src={user?.avatar || '/images/default-avatar.png'} alt="it's me" />
        <Text size='lg' fw={500}>
          {user?.fuln || user?.usrn}
        </Text>
      </Flex>
      <Textarea
        value={value}
        placeholder='Comment....'
        autosize
        minRows={3}
        maxRows={4}
        error={error}
        onChange={(event) => setValue(event.currentTarget.value)}
      />
      <Flex gap={10} justify={'end'}>
        <Button onClick={handleClear} variant='outline' className='w-[10%]' loading={loading}>
          Clear
        </Button>
        <Button onClick={handleComment} variant='filled' className='w-[10%]' loading={loading}>
          Comment
        </Button>
      </Flex>
    </Card>
  );
};

export default CommnetInput;
