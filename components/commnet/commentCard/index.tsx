import { blogCommentType } from '@/libs/types/blogCommentType';
import { convertIsoToDate } from '@/libs/utils';
import { Avatar, Card, Flex, Text } from '@mantine/core';
import React from 'react';

const CommentCard = ({ comment }: { comment: blogCommentType }) => {
  const { user } = comment;
  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder>
      <Flex align='center' justify={'space-between'}>
        <Flex align='center' gap={7}>
          <Avatar
            src={comment?.user?.avatar || '/images/default-avatar.png'}
            alt={`${comment?.user?.fuln}`}
          />
          <Text size='lg' fw={500}>
            {user?.fuln || user?.usrn}
          </Text>
        </Flex>
        <Text>{convertIsoToDate(comment?.crd_at as string)}</Text>
      </Flex>

      <Text mt={'lg'}>{comment?.blog_cmnt_ctn}</Text>
    </Card>
  );
};

export default CommentCard;
