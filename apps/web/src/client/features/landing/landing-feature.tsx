import {
  BookOpen,
  BriefcaseBusiness,
  CheckCircle,
  Code,
  Database,
  Palette,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/client/features/common/components/ui/card';
import Hero from '@/client/features/landing/components/molecules/hero/hero';
import IconCard from '@/client/features/landing/components/molecules/icon-card/icon-card';

const LandingFeature = () => {
  const timelineItems = [
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

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          dot: 'bg-green-100 border-green-500 dark:bg-green-900/20 dark:border-green-400',
          icon: 'text-green-600 dark:text-green-400',
        };
      case 'in-progress':
        return {
          dot: 'bg-blue-100 border-blue-500 dark:bg-blue-900/20 dark:border-blue-400',
          icon: 'text-blue-600 dark:text-blue-400',
        };
      case 'planned':
        return {
          dot: 'bg-yellow-100 border-yellow-500 dark:bg-yellow-900/20 dark:border-yellow-400',
          icon: 'text-yellow-600 dark:text-yellow-400',
        };
      default:
        return {
          dot: 'bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-600',
          icon: 'text-gray-600 dark:text-gray-400',
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="flex flex-col gap-16">
          <Hero
            description={
              <>
                Jack is a full stack software developer who{' '}
                <span className="font-medium text-primary">
                  builds innovative solutions
                </span>{' '}
                and loves exploring cutting-edge technologies.
              </>
            }
            title="Jack's Portfolio"
          />

          <section className="space-y-8">
            <div className="space-y-4 text-center">
              <h2 className="font-bold text-3xl md:text-4xl">
                What This Site Is For
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                More than just a portfolio - it's a living showcase of
                development and learning
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <IconCard
                description="Showcasing my projects, skills, and professional journey as a full stack developer."
                icon={BriefcaseBusiness}
                title="Portfolio"
              />

              <IconCard
                description="A testing ground for new frameworks, patterns, and experimental features."
                icon={Code}
                title="Playground"
              />

              <IconCard
                description="Eventually, a collection of insights, tutorials, and learnings from my development journey."
                icon={BookOpen}
                title="Knowledge Base"
              />
            </div>
          </section>

          <section className="space-y-8 pb-16">
            <div className="space-y-4 text-center">
              <h2 className="font-bold text-3xl md:text-4xl">
                Development Roadmap
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Track the progress of site development and upcoming features
              </p>
            </div>

            <div className="relative mx-auto max-w-3xl">
              {/* Timeline line */}
              <div className="absolute top-8 bottom-8 left-8 w-0.5 bg-border" />

              {timelineItems.map((item, index) => {
                const styles = getStatusStyles(item.status);
                const isLast = index === timelineItems.length - 1;

                return (
                  <div
                    className={`relative flex items-start gap-8 ${
                      isLast ? '' : 'pb-8'
                    }`}
                    key={item.title}
                  >
                    {/* Timeline dot */}
                    <div
                      className={`z-10 flex h-16 w-16 items-center justify-center rounded-full border-4 bg-background ${styles.dot}`}
                    >
                      <item.icon className={`h-6 w-6 ${styles.icon}`} />
                    </div>

                    {/* Content */}
                    <Card className="flex-1 transition-shadow hover:shadow-md">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xl">
                            {item.title}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">
                          {item.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LandingFeature;
