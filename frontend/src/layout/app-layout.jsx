import { Bell, ChevronDown, LogOut, Menu, Wind } from 'lucide-react';
import { useMemo, useState } from 'react';

import { useAuth } from '@/auth/auth-context';
import { Button } from '@/components/ui/button';
import { navigationItems } from '@/config/navigation';
import { cn } from '@/lib/utils';
import { setRoute } from '@/routes/router';

function roleLabel(roleCode) {
  return (
    {
      SYSADMIN: 'Сисадмин',
      CLUBHEAD: 'РК',
      FLIGHTMANAGER: 'РП',
      PILOT: 'Пилот',
    }[roleCode] ?? 'Гость'
  );
}

export function AppLayout({ activeRoute, children }) {
  const { hasPermission, isAuthenticated, loadCurrentUser, signOut, status, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const visibleNavigation = useMemo(
    () => navigationItems.filter((item) => !item.permission || hasPermission(item.permission)),
    [hasPermission],
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 flex w-56 flex-col border-r border-slate-800 bg-slate-950 text-white transition-transform lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-4">
          <div className="grid size-8 place-items-center rounded-md bg-blue-600 shadow-sm shadow-blue-950/30">
            <Wind className="size-4" aria-hidden="true" />
          </div>
          <h1 className="text-base font-semibold">ParaHive</h1>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Основное</p>
          <div className="mt-3 space-y-1">
          {visibleNavigation.map((item) => {
            const Icon = item.icon;
            const active = activeRoute === item.id;

            return (
              <button
                className={cn(
                  'flex h-10 w-full items-center gap-3 rounded-md px-3 text-left text-sm font-medium transition-colors',
                  active ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white',
                )}
                key={item.id}
                type="button"
                onClick={() => {
                  setRoute(item.id);
                  setSidebarOpen(false);
                }}
              >
                <Icon className="size-4" aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            );
          })}
          </div>
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="grid size-8 place-items-center rounded-full bg-blue-600 text-xs font-semibold">
              {(user?.login ?? 'PH').slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user?.login ?? 'Нет сессии'}</p>
              <p className="mt-0.5 text-xs text-slate-400">{roleLabel(user?.role?.code)}</p>
            </div>
          </div>
        </div>
      </aside>

      {sidebarOpen ? (
        <button
          aria-label="Закрыть меню"
          className="fixed inset-0 z-20 bg-foreground/20 lg:hidden"
          type="button"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <div className="lg:pl-56">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <Button className="size-10 px-0 lg:hidden" type="button" variant="outline" onClick={() => setSidebarOpen(true)}>
              <Menu className="size-4" aria-hidden="true" />
              <span className="sr-only">Открыть меню</span>
            </Button>
            <div>
              <p className="text-xs font-medium text-slate-400">CRM/ERP клуба парапланеристов</p>
              <p className="text-sm font-semibold">{isAuthenticated ? user?.email : 'Сессия не активна'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button className="size-9 px-0" type="button" variant="ghost" onClick={loadCurrentUser}>
              <Bell className={cn('size-4', status === 'loading' && 'animate-pulse')} aria-hidden="true" />
              <span className="sr-only">Обновить сессию</span>
            </Button>
            <Button className="hidden items-center gap-2 px-2 text-sm sm:inline-flex" type="button" variant="ghost" onClick={signOut}>
              <span className="grid size-8 place-items-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                {(user?.login ?? 'PH').slice(0, 2).toUpperCase()}
              </span>
              <ChevronDown className="size-4 text-slate-400" aria-hidden="true" />
            </Button>
            <Button className="size-9 px-0 sm:hidden" type="button" variant="ghost" onClick={signOut}>
              <LogOut className="size-4" aria-hidden="true" />
              <span className="sr-only">Выйти</span>
            </Button>
          </div>
        </header>

        <main className="min-h-[calc(100vh-4rem)] p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
