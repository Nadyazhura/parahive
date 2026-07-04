import { cn } from '@/lib/utils';

const inputClass =
  'h-9 w-full rounded-md border border-input bg-white px-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-ring focus:ring-2 focus:ring-ring/15 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400';
const textareaClass =
  'min-h-24 w-full rounded-md border border-input bg-white px-3 py-2 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-ring focus:ring-2 focus:ring-ring/15 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400';

export function Field({ children, label }) {
  return (
    <label className="grid gap-1.5 text-xs font-medium text-slate-500">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function TextInput(props) {
  return <input className={cn(inputClass, props.className)} {...props} />;
}

export function IconTextInput({ icon: Icon, className, ...props }) {
  return (
    <div className="relative">
      {Icon ? <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" /> : null}
      <input className={cn(inputClass, Icon && 'pl-9', className)} {...props} />
    </div>
  );
}

export function TextArea(props) {
  return <textarea className={cn(textareaClass, props.className)} {...props} />;
}

export function SelectInput({ children, ...props }) {
  return (
    <select className={cn(inputClass, props.className)} {...props}>
      {children}
    </select>
  );
}

export function ErrorMessage({ children }) {
  if (!children) {
    return null;
  }

  return <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{children}</p>;
}

export function EmptyState({ children, title }) {
  return (
    <div className="rounded-md border border-dashed bg-white p-8 text-center">
      <p className="font-medium">{title}</p>
      {children ? <p className="mt-2 text-sm text-muted-foreground">{children}</p> : null}
    </div>
  );
}
