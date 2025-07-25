import { BookOpen, BriefcaseBusiness, Calendar, Code } from 'lucide-react';
import Hero from '@/client/features/landing/components/molecules/hero/hero';
import IconCard from '@/client/features/landing/components/molecules/icon-card/icon-card';

const LandingFeature = () => {
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
              <h2 className="font-bold text-3xl md:text-4xl">Coming Soon</h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Exciting features and content are on the way
              </p>
            </div>

            <IconCard
              description="A detailed roadmap of upcoming features and improvements will be displayed here."
              icon={Calendar}
              title="Feature Timeline"
            />
          </section>
        </div>
      </div>
    </div>
  );
};

export default LandingFeature;
