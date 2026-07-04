import { Activity, ShieldCheck, UsersRound } from 'lucide-react';

import { useAuth } from '@/auth/auth-context';
import { PageShell, Surface } from './page-shell';

const overviewItems = [
  {
    label: 'Пилоты',
    value: 'Список',
    icon: UsersRound,
  },
  {
    label: 'Доступ',
    value: 'Роли',
    icon: ShieldCheck,
  },
  {
    label: 'Летная часть',
    value: 'Анкеты',
    icon: Activity,
  },
];

export function OverviewPage() {
  const { permissions } = useAuth();

  return (
    <PageShell eyebrow="Рабочая область" title="Обзор">
      <div className="grid gap-4 md:grid-cols-3">
        {overviewItems.map((item) => {
          const Icon = item.icon;

          return (
            <Surface key={item.label}>
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-md bg-muted text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="font-semibold">{item.value}</p>
                </div>
              </div>
            </Surface>
          );
        })}
      </div>

      <Surface>
        <p className="text-sm font-medium text-muted-foreground">Доступные действия</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {permissions.map((permission) => (
            <span className="rounded-md border bg-background px-2.5 py-1 text-xs font-medium" key={permission}>
              {permission}
            </span>
          ))}
        </div>
      </Surface>
    </PageShell>
  );
}
