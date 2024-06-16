import { blogCommentType } from "@/libs/types/blogCommentType";
import { User } from "@/libs/types/userType";

// Generate fake User data
const generateFakeUser = (): User => ({
  user_id: Math.floor(Math.random() * 1000),
  usrn: `user_${Math.floor(Math.random() * 1000)}`,
  fuln: `Full Name ${Math.floor(Math.random() * 1000)}`,
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  email: `user${Math.floor(Math.random() * 1000)}@example.com`,
  phone: `+123456789${Math.floor(Math.random() * 10)}`,
  role: 'user',
});

// Generate fake blog comment data
const generateFakeBlogComment = (): blogCommentType => ({
  blog_cmt_id: `${Math.floor(Math.random() * 10000)}`,
  blog_cmnt_ctn: 'This is a sample comment content',
  crd_at: new Date().toISOString(),
  upd_at: new Date().toISOString(),
  user: generateFakeUser(),
});

// Generate an array of fake blog comments
const generateFakeBlogComments = (count: number): blogCommentType[] => {
  return Array.from({ length: count }, generateFakeBlogComment);
};

// Example usage
const fakeBlogComments = generateFakeBlogComments(5);
console.log(fakeBlogComments);

export { generateFakeUser, generateFakeBlogComment, generateFakeBlogComments };
