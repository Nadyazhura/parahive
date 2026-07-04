import { PageShell, Surface } from './page-shell';

export function FlightOpsPage() {
  return (
    <PageShell eyebrow="Летная часть" title="Анкеты пилотов">
      <Surface>
        <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
          <div className="space-y-3">
            <div className="h-10 rounded-md border bg-background" />
            <div className="h-10 rounded-md border bg-background" />
            <div className="h-10 rounded-md border bg-background" />
          </div>
          <div className="space-y-3">
            <div className="h-28 rounded-md border bg-background" />
            <div className="h-28 rounded-md border bg-background" />
          </div>
        </div>
      </Surface>
    </PageShell>
  );
}
