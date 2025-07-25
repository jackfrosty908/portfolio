import type { LucideIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/client/features/common/components/ui/card';

interface IconCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

const IconCard = ({ title, description, icon: Icon }: IconCardProps) => {
  return (
    <Card className="text-center transition-shadow hover:shadow-lg">
      <CardHeader>
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-6 w-6 rounded-sm text-primary" />
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

export default IconCard;
