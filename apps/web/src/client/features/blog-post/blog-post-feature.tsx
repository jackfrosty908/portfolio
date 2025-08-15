import { gql } from '@apollo/client';
import type { Post as PostType, Tag, User } from '@payload-types';
import dayjs from 'dayjs';
import type { ReactElement } from 'react';
import TagList from '@/client/features/blog-post/components/molecules/tag-list/tag-list';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/client/features/common/components/ui/card';
import RichTextFeature from '@/client/features/rich-text/rich-text-feature';
import createApolloClient from '@/server/integrations/payload-client/client';

type PostsResponse = { Posts: { docs: PostType[] } };

const GET_POSTS = gql`
  query GetPosts($id: String!) {
    Posts(where: { id: { equals: $id } }) {
      docs {
        title
        content
        tags {
          id
          name
        }
        author {
          first_name
          last_name
        }
        updatedAt
      }
    }
  }
`;

const Page = async ({ id }: { id: string }): Promise<ReactElement> => {
  const client = createApolloClient();

  const { data } = await client.query<PostsResponse>({
    query: GET_POSTS,
    variables: { id },
    fetchPolicy: 'no-cache',
  });

  const post = data?.Posts?.docs?.[0];
  if (!post) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <div className="text-muted-foreground">Post not found</div>
      </div>
    );
  }

  const author =
    post.author && typeof post.author === 'object'
      ? (post.author as User)
      : null;
  const authorName = author
    ? [author.first_name, author.last_name].filter(Boolean).join(' ')
    : 'Anonymous';

  const tags = (post.tags ?? [])
    .filter(Boolean)
    .map((t) =>
      typeof t === 'string'
        ? ({ id: t, name: t } as unknown as Tag)
        : (t as Tag)
    );

  return (
    <div className="mx-auto w-3/4 p-6">
      <Card className="bg-background">
        <CardHeader>
          <CardTitle className="w-full font-bold text-3xl tracking-tight">
            {post.title}
          </CardTitle>
          <div className="text-muted-foreground text-sm">
            Updated {dayjs(post.updatedAt).format('DD MMM YYYY')} by&nbsp;
            {authorName}
          </div>
        </CardHeader>

        <CardContent className="prose dark:prose-invert max-w-none">
          <RichTextFeature content={post.content} />
        </CardContent>

        <CardFooter className="flex items-center justify-between">
          <TagList tags={tags} />
        </CardFooter>
      </Card>
    </div>
  );
};

export default Page;
