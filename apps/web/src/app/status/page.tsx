import HealthCheck from '@/client/features/layout/components/atoms/health-check/health-check';

export default function Status() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-2">
      <div className="grid gap-6">
        <section className="rounded-lg border p-4">
          <h2 className="mb-2 font-medium">API Status</h2>
          <HealthCheck />
        </section>
      </div>
    </div>
  );
}
