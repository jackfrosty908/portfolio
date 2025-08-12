import { gql } from '@apollo/client';
import type { ReactElement } from 'react';
import RichTextFeature from '@/client/features/rich-text/RichTextFeature';
import createApolloClient from '@/server/integrations/payload-client/client';
import type { Post as PostType, User } from '../../../../../payload-types';

type PostsResponse = { Posts: { docs: PostType[] } };

const GET_POSTS = gql`
  query GetPosts($id: String!) {
    Posts(where: { id: { equals: $id } }) {
      docs {
        title
        content
        tags {
          name
        }
        author {
          first_name
          last_name
        }
      }
    }
  }
`;

const PostPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<ReactElement> => {
  const { id } = await params;
  const client = createApolloClient();

  const { data } = await client.query<PostsResponse>({
    query: GET_POSTS,
    variables: { id },
    fetchPolicy: 'no-cache',
  });

  const post = data?.Posts?.docs?.[0];
  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <RichTextFeature content={post.content} />
      <p>{post.tags?.map((tag) => tag).join(', ') ?? 'No tags'}</p>
      <p>
        {(post.author as User)?.first_name} {(post.author as User)?.last_name}
      </p>
    </div>
  );
};

export default PostPage;
