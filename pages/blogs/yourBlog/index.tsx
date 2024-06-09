import BlogTable from '@/components/blogTable';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import { blogCommentType } from '@/libs/types/blogCommentType';
import { blogRatingType } from '@/libs/types/blogRatingType';
import { blogTableType } from '@/libs/types/blogTableType';
import { Tag } from '@/libs/types/tagType';
import { Container, Flex } from '@mantine/core';
import React from 'react';

const YourBlog = () => {
  const fakeTags: Tag[] = [
    { tag_id: 1, tag_name: 'React', crd_at: '2024-06-05T23:26:40.692Z', upd_at: '2024-06-05T23:26:40.692Z' },
    { tag_id: 2, tag_name: 'Angular', crd_at: '2024-06-05T23:26:40.692Z', upd_at: '2024-06-05T23:26:40.692Z' },
    { tag_id: 3, tag_name: 'Vue', crd_at: '2024-06-05T23:26:40.692Z', upd_at: '2024-06-05T23:26:40.692Z' },
    { tag_id: 4, tag_name: 'Svelte', crd_at: '2024-06-05T23:26:40.692Z', upd_at: '2024-06-05T23:26:40.692Z' }
  ];
  
  const fakeBlogComments: blogCommentType[] = [
    {
      blog_cmt_id: '1',
      blog_cmnt_ctn: 'Great post!',
      crd_at: '2024-06-05T23:26:40.692Z',
      upd_at: '2024-06-05T23:26:40.692Z'
    },
    {
      blog_cmt_id: '2',
      blog_cmnt_ctn: 'Very informative.',
      crd_at: '2024-06-05T23:26:40.692Z',
      upd_at: '2024-06-05T23:26:40.692Z'
    }
  ];
  
  const fakeBlogRatings: blogRatingType[] = [
    {
      blog_rtg_id: '1',
      blog_rtg: 5,
      is_rated: true,
      crd_at: '2024-06-05T23:26:40.692Z',
      upd_at: '2024-06-05T23:26:40.692Z'
    },
    {
      blog_rtg_id: '2',
      blog_rtg: 4,
      is_rated: true,
      crd_at: '2024-06-05T23:26:40.692Z',
      upd_at: '2024-06-05T23:26:40.692Z'
    }
  ];
  
  const fakeBlogTableData: blogTableType[] = [
    {
      blog_id: 1,
      blog_tle: 'Norway Fjord Adventures',
      blog_cmt: fakeBlogComments,
      blog_rtg: fakeBlogRatings,
      blog_tag: [fakeTags[0]],
      crd_at: '2024-06-05T23:26:40.692Z',
      upd_at: '2024-06-05T23:26:40.692Z'
    },
    {
      blog_id: 2,
      blog_tle: 'Discover the Alps',
      blog_cmt: fakeBlogComments,
      blog_rtg: fakeBlogRatings,
      blog_tag: [fakeTags[1]],
      crd_at: '2024-06-05T23:26:40.692Z',
      upd_at: '2024-06-05T23:26:40.692Z'
    },
    {
      blog_id: 3,
      blog_tle: 'Sahara Desert Expedition',
      blog_cmt: fakeBlogComments,
      blog_rtg: fakeBlogRatings,
      blog_tag: [fakeTags[2]],
      crd_at: '2024-06-05T23:26:40.692Z',
      upd_at: '2024-06-05T23:26:40.692Z'
    },
    {
      blog_id: 4,
      blog_tle: 'Amazon Rainforest Journey',
      blog_cmt: fakeBlogComments,
      blog_rtg: fakeBlogRatings,
      blog_tag: [fakeTags[3]],
      crd_at: '2024-06-05T23:26:40.692Z',
      upd_at: '2024-06-05T23:26:40.692Z'
    },
    {
      blog_id: 5,
      blog_tle: 'Great Barrier Reef Diving',
      blog_cmt: fakeBlogComments,
      blog_rtg: fakeBlogRatings,
      blog_tag: [fakeTags[0], fakeTags[1]],
      crd_at: '2024-06-05T23:26:40.692Z',
      upd_at: '2024-06-05T23:26:40.692Z'
    }
  ];
  return (
    <Flex>
      <BlogTable tags={fakeTags} data={ fakeBlogTableData} />
    </Flex>
  );
};

export default YourBlog;

YourBlog.getLayout = function getLayout(page: any) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
