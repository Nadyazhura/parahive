export function PageShell({ actions, children, eyebrow, title }) {
  return (
    <section className="space-y-4">
      <div className="flex min-h-11 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {eyebrow ? <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">{eyebrow}</p> : null}
          <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}

export function Surface({ children }) {
  return <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">{children}</div>;
}
