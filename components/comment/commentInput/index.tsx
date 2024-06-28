import { useMyInfo } from '@/libs/hooks/queries/userQueries';
import { Avatar, Button, Card, Flex, Textarea, Text, Skeleton } from '@mantine/core';
import React, { useEffect, useState } from 'react';

const CommentInput = ({
  onComment,
  loading = false,
  isSuccess
}: {
  onComment: Function;
  loading?: boolean;
  isSuccess: boolean;
}) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const { user } = useMyInfo();

  const handleComment = async () => {
    if (!value) {
      setError('Please enter a comment before submit');
    } else {
      onComment && (await onComment(value));
    }
  };

  useEffect(() => {
    if (isSuccess) {
      handleClear();
    }
  }, [isSuccess]);

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
      <Skeleton visible={loading}>
        <Textarea
          value={value}
          placeholder='Comment....'
          autosize
          minRows={3}
          maxRows={4}
          error={error}
          onChange={(event) => setValue(event.currentTarget.value)}
        />
      </Skeleton>
      <Flex gap={10} justify={'end'}>
        <Button onClick={handleClear} variant='outline' className='w-[25%]' loading={loading}>
          Clear
        </Button>
        <Button onClick={handleComment} variant='filled' className='w-[25%]' loading={loading}>
          Comment
        </Button>
      </Flex>
    </Card>
  );
};

export default CommentInput;
