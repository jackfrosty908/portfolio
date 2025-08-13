import type { Tag as TagType } from '@payload-types';
import Tag from '@/client/features/blog-post/components/atoms/tag/tag';

const TagList = ({ tags }: { tags: TagType[] }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Tag key={tag.id} tag={tag} />
      ))}
    </div>
  );
};

export default TagList;
