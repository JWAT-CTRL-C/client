export type BlogCardType = {
  id: number | string;
  title: string;
  // description: string;
  createdAt: string;
  bgUrl: string | null | undefined;
  authorAvatar?: string;
  authorName: string;
  rating: number;
  tag: Tag;
};

export type Tag = keyof typeof tagColors;

export const tagColors = {
  onSale: '#f03e3e', // Red
  new: '#12b886', // Green
  popular: '#228be6', // Blue
  recommended: '#be4bdb', // Purple
  featured: '#f59f00' // Yellow
};
