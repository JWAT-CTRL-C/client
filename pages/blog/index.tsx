import BlogCard from '@/components/blogCard';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import { BlogCardType } from '@/libs/types/blogCardType';
import { SimpleGrid } from '@mantine/core';
import React from 'react';

const fakeDataBlogCards: BlogCardType[] = [
  {
    id: '1',
    title: 'Norway Fjord Adventures',
    createdAt: '12/23/2023',
    bgUrl: undefined,
    authorName: 'Mr.Terrafic',
    tag: 'onSale',
    rating: 5,
    description: 'Explore the breathtaking fjords of Norway with our guided adventures.'
  },
  {
    id: '2',
    title: 'Discover the Alps',
    createdAt: '01/15/2024',
    bgUrl: undefined,
    authorName: 'Ms.Mountain',
    tag: 'new',
    rating: 2,
    description: 'Join us on a journey through the majestic Alps and discover stunning landscapes.'
  },
  {
    id: '3',
    title: 'Sahara Desert Expedition',
    createdAt: '02/10/2024',
    bgUrl: undefined,
    authorName: 'Dr.Sand',
    tag: 'popular',
    rating: 3,
    description: 'Experience the vast and beautiful Sahara Desert with our expert guides.'
  },
  {
    id: '4',
    title: 'Amazon Rainforest Journey',
    rating: 2.2,
    createdAt: '03/05/2024',
    bgUrl: null,
    authorName: 'Mr.Green',
    tag: 'recommended',
    description: 'Dive into the heart of the Amazon Rainforest and explore its rich biodiversity.'
  },
  {
    id: '5',
    title: 'Great Barrier Reef Diving',
    rating: 1.5,
    createdAt: '04/20/2024',
    bgUrl: undefined,
    authorName: 'Ms.Ocean',
    tag: 'featured',
    description: 'Discover the underwater wonders of the Great Barrier Reef with our diving tours.'
  }
];


const Blog = () => {
  return (
    <SimpleGrid
      cols={{ base: 1, sm: 1, md: 2, lg: 3 }}
      spacing={{ base: 5, sm: 'xl' }}
      verticalSpacing={{ base: 'md', sm: 'xl' }}>
      {fakeDataBlogCards.map((blog) => (
        <BlogCard blog={blog} key={blog.id} />
      ))}
    </SimpleGrid>
  );
};

export default Blog;

Blog.getLayout = function getLayout(page: any) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
