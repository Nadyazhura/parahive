import { AlertCircle, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { setRoute } from '@/routes/router';
import { useAuth } from './auth-context';

export function ProtectedRoute({ permission, children }) {
  const { hasPermission, isAuthenticated, loadCurrentUser, status } = useAuth();

  if (status === 'loading') {
    return (
      <section className="flex min-h-[320px] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" aria-hidden="true" />
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <section className="mx-auto flex min-h-[360px] max-w-md flex-col items-center justify-center text-center">
        <AlertCircle className="size-9 text-secondary" aria-hidden="true" />
        <h1 className="mt-4 text-xl font-semibold">Требуется вход</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Активная сессия не найдена.</p>
        <div className="mt-5 flex gap-2">
          <Button type="button" onClick={() => setRoute('login')}>
            Войти
          </Button>
          <Button type="button" variant="outline" onClick={loadCurrentUser}>
            Проверить сессию
          </Button>
        </div>
      </section>
    );
  }

  if (!hasPermission(permission)) {
    return (
      <section className="mx-auto flex min-h-[360px] max-w-md flex-col items-center justify-center text-center">
        <AlertCircle className="size-9 text-destructive" aria-hidden="true" />
        <h1 className="mt-4 text-xl font-semibold">Недостаточно прав</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Доступ к разделу ограничен ролью пользователя.</p>
      </section>
    );
  }

  return children;
}
