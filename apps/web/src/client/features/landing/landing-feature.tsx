import Hero from '@/client/features/landing/components/molecules/hero/hero';
import Purpose from '@/client/features/landing/components/organisms/purpose/purpose';
import Timeline from '@/client/features/landing/components/organisms/timeline/timeline';

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

          <Purpose />

          <Timeline />
        </div>
      </div>
    </div>
  );
};

export default LandingFeature;
