import { ClipboardList, ShieldCheck, UserRoundCog, UsersRound } from 'lucide-react';

import { Button } from '@/components/ui/button';

const readinessItems = [
  {
    title: 'Модель данных',
    description: 'Prisma schema и справочники первого этапа подготовлены.',
    icon: UsersRound,
  },
  {
    title: 'Авторизация',
    description: 'Backend auth API готов: вход, refresh, logout, me и смена пароля.',
    icon: ShieldCheck,
  },
  {
    title: 'Права доступа',
    description: 'Permission map и проверка прав на backend подготовлены.',
    icon: ClipboardList,
  },
  {
    title: 'Users/Pilots/Profile API',
    description: 'API пользователей, пилотов и анкет первого этапа готово.',
    icon: UserRoundCog,
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
            Первый этап
          </Button>
        </div>
      </section>

      <section className="container py-8 md:py-12">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">Статус проекта</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-normal">ParaHive в разработке</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              Backend-фундамент готов: модель данных, авторизация, права доступа и Users/Pilots/Profile API. Следующий фокус - frontend foundation и первые рабочие экраны.
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
