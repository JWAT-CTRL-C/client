import BlogCard from '@/components/blogCard';
import DefaultLayout from '@/components/layouts/DefaultLayout';
import { BlogCardType } from '@/libs/types/blogCardType';
import { SimpleGrid } from '@mantine/core';
import React from 'react';

const fakeDataBlogCards: BlogCardType[] = [
  {
    id: '1',
    title: 'Norway Fjord Adventures',
    description:
      'With Fjord Tours you can explore more of the magical fjord landscapes with tours and activities on and around the fjords of Norway.',
    createdAt: '12/23/2023',
    bgUrl: undefined,
    authorAvatar: 'https://example.com/avatar1.jpg',
    authorName: 'Mr.Terrafic',
    tag: 'onSale'
  },
  {
    id: '2',

    title: 'Discover the Alps',
    description:
      'Join us for an unforgettable adventure in the Alps with guided tours, skiing, and breathtaking views.',
    createdAt: '01/15/2024',
    bgUrl: undefined,
    authorAvatar: 'https://example.com/avatar2.jpg',
    authorName: 'Ms.Mountain',
    tag: 'new'
  },
  {
    id: '3',

    title: 'Sahara Desert Expedition',
    description:
      'Experience the vastness of the Sahara Desert with our expert guides and luxurious camping facilities.',
    createdAt: '02/10/2024',
    bgUrl: undefined,
    authorAvatar: 'https://example.com/avatar3.jpg',
    authorName: 'Dr.Sand',
    tag: 'popular'
  },
  {
    id: '4',

    title: 'Amazon Rainforest Journey',
    description:
      'Dive deep into the heart of the Amazon Rainforest with our eco-friendly tours and discover the incredible biodiversity.',
    createdAt: '03/05/2024',
    bgUrl: null,
    authorAvatar: 'https://example.com/avatar4.jpg',
    authorName: 'Mr.Green',
    tag: 'recommended'
  },
  {
    id: '5',

    title: 'Great Barrier Reef Diving',
    description:
      'Explore the underwater wonders of the Great Barrier Reef with our diving tours and see the vibrant marine life up close.',
    createdAt: '04/20/2024',
    bgUrl: undefined,
    authorAvatar: 'https://example.com/avatar5.jpg',
    authorName: 'Ms.Ocean',
    tag: 'featured'
  }
];

const Blog = () => {
  return (
    <SimpleGrid
      cols={{ base: 1, sm: , lg: 3 }}
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
