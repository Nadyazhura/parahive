import { ClipboardList, ShieldCheck, UsersRound } from 'lucide-react';

import { Button } from '@/components/ui/button';

const readinessItems = [
  {
    title: 'Пилоты',
    description: 'Будущий список пользователей-пилотов клуба.',
    icon: UsersRound,
  },
  {
    title: 'Роли',
    description: 'SYSADMIN, РК, РП и пилот без бизнес-логики на этом шаге.',
    icon: ShieldCheck,
  },
  {
    title: 'Анкеты',
    description: 'Основа под карточку пилота и редактирование профиля.',
    icon: ClipboardList,
  },
];

export default function App() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b bg-card">
        <div className="container flex min-h-[72px] items-center justify-between gap-4 py-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">CRM/ERP клуба парапланеристов</p>
            <h1 className="text-2xl font-semibold tracking-normal">ParaHive</h1>
          </div>
          <Button type="button" variant="outline">
            Scaffold ready
          </Button>
        </div>
      </section>

      <section className="container py-8 md:py-12">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">Шаг 1</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-normal">Базовый каркас проекта создан</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              Здесь будет рабочий интерфейс первого этапа: вход, список пилотов, анкеты и управление доступом.
            </p>
          </div>

          <div className="grid gap-3">
            {readinessItems.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.title} className="rounded-lg border bg-card p-5 shadow-sm">
                  <div className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-semibold tracking-normal">{item.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
