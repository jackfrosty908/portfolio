import { CheckCircle, Database, Palette } from 'lucide-react';

type TimelineItem = {
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'planned';
  icon: React.ElementType;
};

const timelineItems: TimelineItem[] = [
  {
    title: 'Initial Site Setup',
    description:
      'Next.js setup with TypeScript, Tailwind CSS, and shadcn/ui components.',
    status: 'completed',
    icon: CheckCircle,
  },
  {
    title: 'Initial Auth Setup',
    description:
      'Supabase authentication with login, signup, password reset, and protected routes.',
    status: 'completed',
    icon: CheckCircle,
  },
  {
    title: 'Telemetry',
    description: 'Sentry for error tracking and logging.',
    status: 'completed',
    icon: CheckCircle,
  },
  {
    title: 'Basic CMS Functionality',
    description:
      'Content management system for blog posts, projects, and dynamic content.',
    status: 'in-progress',
    icon: Database,
  },
  {
    title: 'Site Redesign and Theming',
    description:
      'Enhanced visual design with improved theming, animations, and user experience.',
    status: 'planned',
    icon: Palette,
  },
];

export default timelineItems;
export type { TimelineItem };
