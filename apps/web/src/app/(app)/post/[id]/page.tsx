import BlogPostFeature from '@/client/features/blog-post/BlogPostFeature';

const Page = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;

  return <BlogPostFeature id={id} />;
};

export default Page;
