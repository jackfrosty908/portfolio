import type { Tag as TagType } from '@payload-types';
import { Badge } from '@/client/features/common/components/ui/badge';

const Tag = ({ tag }: { tag: TagType }) => {
  return <Badge variant="outline">{tag.name}</Badge>;
};

export default Tag;
