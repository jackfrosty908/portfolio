import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/client/features/common/components/ui/card';
import timelineItems from '@/client/features/landing/components/organisms/timeline/timeline-items';

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

const Timeline = () => {
  return (
    <section className="space-y-8 pb-16">
      <div className="space-y-4 text-center">
        <h2 className="font-bold text-3xl md:text-4xl">Development Roadmap</h2>
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
                    <CardTitle className="text-xl">{item.title}</CardTitle>
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
  );
};

export default Timeline;
