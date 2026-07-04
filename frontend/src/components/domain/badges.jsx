import { rankLabel, rankTone, roleLabel, statusLabel } from '@/config/dictionaries';
import { cn } from '@/lib/utils';

const baseBadge = 'inline-flex min-h-7 items-center rounded-md border px-2 py-1 text-xs font-medium';
const compactBadge = 'inline-flex min-h-5 items-center rounded px-1.5 py-0.5 text-[11px] font-semibold leading-none';

export function RankBadge({ rankCode }) {
  return <span className={cn(compactBadge, rankTone(rankCode))}>{rankLabel(rankCode)}</span>;
}

export function StatusBadge({ statusCode }) {
  const active = statusCode === 'active';
  const inactive = statusCode === 'inactive';

  return (
    <span
      className={cn(
        compactBadge,
        active && 'bg-emerald-50 text-emerald-700',
        inactive && 'bg-slate-100 text-slate-500',
        !active && !inactive && 'bg-blue-50 text-blue-700',
      )}
    >
      <span className={cn('mr-1 size-1.5 rounded-full', active && 'bg-emerald-500', inactive && 'bg-slate-400', !active && !inactive && 'bg-blue-500')} />
      {statusLabel(statusCode)}
    </span>
  );
}

export function RoleBadge({ roleCode }) {
  const roleClass =
    {
      SYSADMIN: 'bg-slate-950 text-white',
      CLUBHEAD: 'bg-blue-600 text-white',
      FLIGHTMANAGER: 'bg-teal-600 text-white',
      PILOT: 'bg-slate-100 text-slate-700',
    }[roleCode] ?? 'bg-slate-100 text-slate-700';

  return <span className={cn(compactBadge, roleClass)}>{roleLabel(roleCode)}</span>;
}
