import BlogPostFeature from '@/client/features/blog-post/blog-post-feature';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return <BlogPostFeature id={id} />;
};

export default Page;
