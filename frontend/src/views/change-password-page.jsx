import { KeyRound } from 'lucide-react';
import { useState } from 'react';

import { useAuth } from '@/auth/auth-context';
import { Button } from '@/components/ui/button';
import { ErrorMessage, Field, TextInput } from '@/components/ui/form-controls';
import { apiClient } from '@/lib/api-client';
import { setRoute } from '@/routes/router';
import { PageShell, Surface } from './page-shell';

export function ChangePasswordPage() {
  const { accessToken, clearSession } = useAuth();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await apiClient.auth.changePassword(accessToken, form);
      clearSession();
      setRoute('login');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageShell eyebrow="Безопасность" title="Смена временного пароля">
      <Surface>
        <form className="max-w-md space-y-4" onSubmit={onSubmit}>
          <ErrorMessage>{error}</ErrorMessage>
          <Field label="Текущий пароль">
            <TextInput
              autoComplete="current-password"
              type="password"
              value={form.currentPassword}
              onChange={(event) => setForm((current) => ({ ...current, currentPassword: event.target.value }))}
            />
          </Field>
          <Field label="Новый пароль">
            <TextInput
              autoComplete="new-password"
              type="password"
              value={form.newPassword}
              onChange={(event) => setForm((current) => ({ ...current, newPassword: event.target.value }))}
            />
          </Field>
          <Button disabled={saving} type="submit">
            <KeyRound className="mr-2 size-4" aria-hidden="true" />
            Сменить пароль
          </Button>
        </form>
      </Surface>
    </PageShell>
  );
}
