import { BookOpen, BriefcaseBusiness, Code } from 'lucide-react';
import IconCard from '@/client/features/landing/components/molecules/icon-card/icon-card';

const Purpose = () => {
  return (
    <section className="space-y-8">
      <div className="space-y-4 text-center">
        <h2 className="font-bold text-3xl md:text-4xl">
          What This Site Is For
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          More than just a portfolio - it&apos;s a living showcase of
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
  );
};

export default Purpose;
