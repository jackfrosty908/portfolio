import { BookOpen, BriefcaseBusiness, Calendar, Code } from 'lucide-react';
import Hero from '@/client/features/landing/components/molecules/hero/hero';
import IconCard from '@/client/features/landing/components/molecules/icon-card/icon-card';

export default function Home() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-background to-muted/20'>
      <div className='container mx-auto max-w-4xl px-4 py-8'>
        <div className='flex flex-col gap-16'>
          <Hero
            title="Jack's Portfolio"
            description={
              <>
                Jack is a full stack software developer who{' '}
                <span className='font-medium text-primary'>
                  builds innovative solutions
                </span>{' '}
                and loves exploring cutting-edge technologies.
              </>
            }
          />

          <section className='space-y-8'>
            <div className='space-y-4 text-center'>
              <h2 className='font-bold text-3xl md:text-4xl'>
                What This Site Is For
              </h2>
              <p className='mx-auto max-w-2xl text-lg text-muted-foreground'>
                More than just a portfolio - it's a living showcase of
                development and learning
              </p>
            </div>

            <div className='grid gap-6 md:grid-cols-3'>
              <IconCard
                title='Portfolio'
                description='Showcasing my projects, skills, and professional journey as a full stack developer.'
                icon={BriefcaseBusiness}
              />

              <IconCard
                title='Playground'
                description='A testing ground for new frameworks, patterns, and experimental features.'
                icon={Code}
              />

              <IconCard
                title='Knowledge Base'
                description='Eventually, a collection of insights, tutorials, and learnings from my development journey.'
                icon={BookOpen}
              />
            </div>
          </section>

          <section className='space-y-8 pb-16'>
            <div className='space-y-4 text-center'>
              <h2 className='font-bold text-3xl md:text-4xl'>Coming Soon</h2>
              <p className='mx-auto max-w-2xl text-lg text-muted-foreground'>
                Exciting features and content are on the way
              </p>
            </div>

            <IconCard
              title='Feature Timeline'
              description='A detailed roadmap of upcoming features and improvements will be displayed here.'
              icon={Calendar}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
