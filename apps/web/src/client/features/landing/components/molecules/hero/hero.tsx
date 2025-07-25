interface HeroProps {
  title: string;
  description: React.ReactNode;
}

const Hero = ({ title, description }: HeroProps) => {
  return (
    <section className="space-y-6 pt-16 pb-8 text-center">
      <div className="space-y-4">
        <h1 className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text font-bold text-4xl text-transparent md:text-6xl">
          {title}
        </h1>
        <p className="mx-auto max-w-2xl text-muted-foreground text-xl leading-relaxed md:text-2xl">
          {description}
        </p>
      </div>
      <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-primary to-primary/60" />
    </section>
  );
};

export default Hero;
