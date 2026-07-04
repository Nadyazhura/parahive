import { Lock, Save } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useAuth } from '@/auth/auth-context';
import { RankBadge, RoleBadge, StatusBadge } from '@/components/domain/badges';
import { Button } from '@/components/ui/button';
import { ErrorMessage, Field, TextInput } from '@/components/ui/form-controls';
import { apiClient } from '@/lib/api-client';
import { dateInputValue, displayValue } from '@/lib/format';
import { PageShell, Surface } from './page-shell';

function initials(value) {
  return (value ?? 'П').trim().slice(0, 2).toUpperCase();
}

function profileToForm(data) {
  return {
    fullName: data?.profile?.fullName ?? '',
    birthDate: dateInputValue(data?.profile?.birthDate),
    phone: data?.profile?.phone ?? '',
    email: data?.user?.email ?? '',
    telegram: data?.profile?.telegram ?? '',
    address: data?.profile?.address ?? '',
    emergencyContactName: data?.profile?.emergencyContactName ?? '',
    emergencyContactPhone: data?.profile?.emergencyContactPhone ?? '',
    rankCode: data?.profile?.rankCode,
    statusCode: data?.profile?.pilotStatusCode,
    roleCode: data?.user?.role?.code ?? data?.user?.roleCode,
  };
}

export function ProfilePage() {
  const { accessToken, loadCurrentUser, signOut } = useAuth();
  const [form, setForm] = useState(profileToForm(null));
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    apiClient.profile
      .me(accessToken)
      .then((data) => {
        if (active) setForm(profileToForm(data));
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      });

    return () => {
      active = false;
    };
  }, [accessToken]);

  async function onSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const data = await apiClient.profile.updateMe(accessToken, {
        fullName: form.fullName,
        birthDate: form.birthDate,
        phone: form.phone,
        telegram: form.telegram,
        address: form.address,
        emergencyContactName: form.emergencyContactName,
        emergencyContactPhone: form.emergencyContactPhone,
      });
      setForm(profileToForm(data));
      await loadCurrentUser();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <PageShell title="Мой профиль">
      <form className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]" onSubmit={onSubmit}>
        <div className="xl:col-span-2">
          <ErrorMessage>{error}</ErrorMessage>
        </div>
        <div className="space-y-4">
          <Surface>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="grid size-12 place-items-center rounded-full bg-blue-600 text-sm font-semibold text-white">{initials(form.fullName)}</div>
                <div>
                  <h3 className="font-semibold">{displayValue(form.fullName)}</h3>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    <RoleBadge roleCode={form.roleCode} />
                    <RankBadge rankCode={form.rankCode} />
                  </div>
                </div>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700" disabled={saving} type="submit">
                <Save className="mr-2 size-4" aria-hidden="true" />
                Сохранить
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="ФИО">
                <TextInput value={form.fullName} onChange={(event) => updateField('fullName', event.target.value)} />
              </Field>
              <Field label="Дата рождения">
                <TextInput type="date" value={form.birthDate} onChange={(event) => updateField('birthDate', event.target.value)} />
              </Field>
              <Field label="Телефон">
                <TextInput value={form.phone} onChange={(event) => updateField('phone', event.target.value)} />
              </Field>
              <Field label="Telegram">
                <TextInput value={form.telegram} onChange={(event) => updateField('telegram', event.target.value)} />
              </Field>
              <Field label="Email">
                <TextInput disabled value={form.email} onChange={(event) => updateField('email', event.target.value)} />
              </Field>
              <Field label="Адрес">
                <TextInput value={form.address} onChange={(event) => updateField('address', event.target.value)} />
              </Field>
              <Field label="Доверенное лицо">
                <TextInput value={form.emergencyContactName} onChange={(event) => updateField('emergencyContactName', event.target.value)} />
              </Field>
              <Field label="Телефон доверенного лица">
                <TextInput value={form.emergencyContactPhone} onChange={(event) => updateField('emergencyContactPhone', event.target.value)} />
              </Field>
            </div>
            <p className="mt-3 text-xs text-slate-400">Email, роль и летный статус изменяются только администратором клуба</p>
          </Surface>
          <Surface>
            <h3 className="font-semibold">Смена пароля</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <Field label="Текущий пароль">
                <TextInput type="password" placeholder="••••••••" />
              </Field>
              <Field label="Новый пароль">
                <TextInput type="password" placeholder="••••••••" />
              </Field>
              <Field label="Подтверждение">
                <TextInput type="password" placeholder="••••••••" />
              </Field>
            </div>
          </Surface>
        </div>
        <Surface>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Публичный профиль</p>
            <div className="mx-auto mt-8 grid size-16 place-items-center rounded-full bg-blue-600 text-xl font-semibold text-white">{initials(form.fullName)}</div>
            <h3 className="mt-3 font-semibold">{displayValue(form.fullName)}</h3>
            <p className="mt-1 text-sm text-slate-400">{displayValue(form.address)}</p>
            <div className="mt-3 flex justify-center gap-1.5">
              <RankBadge rankCode={form.rankCode} />
            </div>
          </div>
          <dl className="mt-8 grid gap-0 overflow-hidden border-t text-sm">
            <div className="flex items-center justify-between border-b py-3">
              <dt className="text-slate-400">Статус</dt>
              <dd>
                <StatusBadge statusCode={form.statusCode} />
              </dd>
            </div>
            <div className="flex items-center justify-between border-b py-3">
              <dt className="text-slate-400">Email</dt>
              <dd className="text-right">{displayValue(form.email)}</dd>
            </div>
            <div className="flex items-center justify-between border-b py-3">
              <dt className="text-slate-400">Телефон</dt>
              <dd>{displayValue(form.phone)}</dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-slate-400">Telegram</dt>
              <dd>{displayValue(form.telegram)}</dd>
            </div>
          </dl>
          <Button className="mt-6 w-full" type="button" variant="outline" onClick={signOut}>
            <Lock className="mr-2 size-4" aria-hidden="true" />
            Выйти из системы
          </Button>
        </Surface>
      </form>
    </PageShell>
  );
}
