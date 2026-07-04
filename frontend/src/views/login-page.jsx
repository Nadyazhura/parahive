import { Eye, EyeOff, Lock, LogIn, UserRound } from 'lucide-react';
import { useState } from 'react';

import { useAuth } from '@/auth/auth-context';
import { Button } from '@/components/ui/button';
import { ErrorMessage, Field, IconTextInput } from '@/components/ui/form-controls';
import { setRoute } from '@/routes/router';

function ParagliderIcon() {
  return (
    <svg className="size-7" fill="none" viewBox="0 0 32 32" aria-hidden="true">
      <path d="M5 10c6-5 16-5 22 0" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
      <path d="M7 11c5 2.4 13 2.4 18 0" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
      <path d="M11 13l4 7M21 13l-4 7" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <path d="M14 21h4l2 4h-8l2-4Z" fill="currentColor" />
    </svg>
  );
}

function loginErrorMessage(message) {
  const knownMessages = {
    'Invalid login or password.': 'Неверный логин или пароль.',
    'loginOrEmail and password are required.': 'Введите логин и пароль.',
    'User is blocked.': 'Пользователь заблокирован.',
    'Too many failed login attempts. Try again later.': 'Слишком много попыток входа. Попробуйте позже.',
    'API request failed.': 'Не удалось выполнить запрос.',
    'Failed to fetch': 'Не удалось подключиться к серверу.',
  };

  return knownMessages[message] ?? 'Не удалось войти. Проверьте данные и попробуйте еще раз.';
}

export function LoginPage() {
  const { signIn, status } = useAuth();
  const [form, setForm] = useState({ loginOrEmail: '', password: '' });
  const [error, setError] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setError(null);

    try {
      const result = await signIn(form);
      setRoute(result.user?.mustChangePassword ? 'change-password' : 'pilots');
    } catch (requestError) {
      setError(loginErrorMessage(requestError.message));
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <section className="w-full max-w-[440px] rounded-md border border-slate-200 bg-white px-8 py-9 shadow-sm">
        <div className="text-center">
          <div className="mx-auto grid size-12 place-items-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <ParagliderIcon />
          </div>
          <h1 className="mt-4 text-xl font-semibold text-slate-950">ParaHive</h1>
          <p className="mt-1 text-sm text-slate-400">Внутренний портал клуба</p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={onSubmit}>
          <h2 className="text-sm font-semibold text-slate-950">Вход в систему</h2>
          <div className="min-h-10">
            <ErrorMessage>{error}</ErrorMessage>
          </div>
          <Field label="Email или логин">
            <IconTextInput
              autoComplete="username"
              icon={UserRound}
              value={form.loginOrEmail}
              onChange={(event) => setForm((current) => ({ ...current, loginOrEmail: event.target.value }))}
            />
          </Field>
          <Field label="Пароль">
            <div className="relative">
              <IconTextInput
                autoComplete="current-password"
                className="pr-10"
                icon={Lock}
                type={passwordVisible ? 'text' : 'password'}
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              />
              <button
                aria-label={passwordVisible ? 'Скрыть пароль' : 'Показать пароль'}
                className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                type="button"
                onClick={() => setPasswordVisible((current) => !current)}
              >
                {passwordVisible ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
              </button>
            </div>
          </Field>
          <Button className="h-11 w-full bg-blue-600 shadow-sm shadow-blue-600/20 hover:bg-blue-700" disabled={status === 'loading'} type="submit">
            <LogIn className="mr-2 size-4" aria-hidden="true" />
            Войти
          </Button>
        </form>
      </section>
    </main>
  );
}
