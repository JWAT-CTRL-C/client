import DefaultLayout from '@/components/layouts/DefaultLayout';
import React from 'react';

const WorkSpace = () => {
  return <div>WorkSpace</div>;
};

export default WorkSpace;

WorkSpace.getLayout = function getLayout(page: any) {
  return <DefaultLayout>{page}</DefaultLayout>;
};
