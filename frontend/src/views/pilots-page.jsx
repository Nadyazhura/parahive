import { ChevronRight, MoreHorizontal, RefreshCw, Save, Search, SlidersHorizontal } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/auth/auth-context';
import { RankBadge, RoleBadge, StatusBadge } from '@/components/domain/badges';
import { Button } from '@/components/ui/button';
import { EmptyState, ErrorMessage, Field, IconTextInput, SelectInput, TextArea, TextInput } from '@/components/ui/form-controls';
import { RANK_OPTIONS, STATUS_OPTIONS } from '@/config/dictionaries';
import { PERMISSIONS } from '@/config/permissions';
import { apiClient } from '@/lib/api-client';
import { buildQuery, displayValue } from '@/lib/format';
import { cn } from '@/lib/utils';
import { PageShell, Surface } from './page-shell';

function initials(value) {
  return (value ?? 'П').trim().slice(0, 2).toUpperCase();
}

function managedFormFromPilot(pilot) {
  return {
    pilotStatusCode: pilot?.profile?.pilotStatusCode ?? pilot?.pilotStatusCode ?? 'active',
    rankCode: pilot?.profile?.rankCode ?? pilot?.rankCode ?? 'none',
    parapro: pilot?.profile?.parapro ?? '',
    serviceNotes: pilot?.profile?.serviceNotes ?? '',
  };
}

export function PilotsPage() {
  const { accessToken, hasPermission } = useAuth();
  const [query, setQuery] = useState({ search: '', statusCode: '', rankCode: '' });
  const [pilots, setPilots] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedPilot, setSelectedPilot] = useState(null);
  const [managedForm, setManagedForm] = useState(managedFormFromPilot(null));
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const canReadAll = hasPermission(PERMISSIONS.PILOTS_READ_ALL);
  const canUpdateAll = hasPermission(PERMISSIONS.PILOT_PROFILES_UPDATE_ALL);
  const selectedListItem = useMemo(() => pilots.find((pilot) => pilot.id === selectedId), [pilots, selectedId]);

  async function loadPilots() {
    setLoading(true);
    setError(null);

    try {
      const result = await apiClient.pilots.list(accessToken, buildQuery({ ...query, limit: 50 }));
      setPilots(result.items ?? []);
      setSelectedId((current) => current ?? result.items?.[0]?.id ?? null);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPilots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  useEffect(() => {
    if (!selectedId) {
      setSelectedPilot(null);
      return;
    }

    let active = true;

    apiClient.pilots
      .get(accessToken, selectedId)
      .then((result) => {
        if (!active) return;
        setSelectedPilot(result.pilot);
        setManagedForm(managedFormFromPilot(result.pilot));
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      });

    return () => {
      active = false;
    };
  }, [accessToken, selectedId]);

  async function saveManagedProfile(event) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const result = await apiClient.pilots.updateProfile(accessToken, selectedId, managedForm);
      setSelectedPilot(result.pilot);
      setManagedForm(managedFormFromPilot(result.pilot));
      await loadPilots();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  const detail = selectedPilot ?? selectedListItem;

  return (
    <PageShell
      actions={
        <div className="flex items-center gap-2">
          <Button className="size-9 px-0" disabled={loading} type="button" variant="outline" onClick={loadPilots}>
            <RefreshCw className={cn('size-4', loading && 'animate-spin')} aria-hidden="true" />
            <span className="sr-only">Обновить</span>
          </Button>
        </div>
      }
      title="Пилоты"
    >
      <ErrorMessage>{error}</ErrorMessage>
      <Surface>
        <form
          className="grid gap-3 lg:grid-cols-[minmax(240px,1fr)_320px_150px_auto_auto]"
          onSubmit={(event) => {
            event.preventDefault();
            loadPilots();
          }}
        >
          <IconTextInput
            icon={Search}
            placeholder="Поиск по ФИО, email..."
            value={query.search}
            onChange={(event) => setQuery((current) => ({ ...current, search: event.target.value }))}
          />
          <div className="flex rounded-md border border-slate-200 bg-slate-50 p-0.5">
            {[
              ['all', 'Все'],
              ['active', 'Активные'],
              ['inactive', 'Неактивные'],
            ].map(([code, label]) => (
              <button
                className={cn(
                  'h-8 flex-1 rounded px-3 text-sm font-medium transition-colors',
                  (query.statusCode || 'all') === code ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-white',
                )}
                key={code}
                type="button"
                onClick={() => setQuery((current) => ({ ...current, statusCode: code === 'all' ? '' : code }))}
              >
                {label}
              </button>
            ))}
          </div>
          <Field label="Разряд">
            <SelectInput value={query.rankCode} onChange={(event) => setQuery((current) => ({ ...current, rankCode: event.target.value }))}>
              <option value="">Все</option>
              {RANK_OPTIONS.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.label}
                </option>
              ))}
            </SelectInput>
          </Field>
          <Button className="self-end" type="button" variant="outline">
            <SlidersHorizontal className="mr-2 size-4" aria-hidden="true" />
            Фильтр
          </Button>
          <Button className="self-end bg-blue-600 hover:bg-blue-700" type="submit">
            Найти
          </Button>
        </form>
      </Surface>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Surface>
          {pilots.length === 0 ? (
            <EmptyState title="Пилоты не найдены">Проверьте фильтры или доступность backend.</EmptyState>
          ) : (
            <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[780px] border-separate border-spacing-0 text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left text-xs text-slate-500">
                    <th className="border-y py-3 pl-3 pr-3 font-medium">ФИО</th>
                    {canReadAll ? <th className="border-y py-3 pr-3 font-medium">Роль</th> : null}
                    <th className="border-y py-3 pr-3 font-medium">Статус пилота</th>
                    <th className="border-y py-3 pr-3 font-medium">Разряд</th>
                    {canReadAll ? <th className="border-y py-3 pr-3 font-medium">Email</th> : null}
                    {canReadAll ? <th className="border-y py-3 pr-3 font-medium">Телефон</th> : null}
                    <th className="border-y py-3 pr-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {pilots.map((pilot) => (
                    <tr
                      className={cn('cursor-pointer transition-colors hover:bg-slate-50', selectedId === pilot.id && 'bg-blue-50/50')}
                      key={pilot.id}
                      onClick={() => setSelectedId(pilot.id)}
                    >
                      <td className="border-b py-3 pl-3 pr-3">
                        <div className="flex items-center gap-3">
                          <div className="grid size-8 place-items-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                            {initials(pilot.fullName ?? pilot.login)}
                          </div>
                          <span className="font-medium">{displayValue(pilot.fullName)}</span>
                        </div>
                      </td>
                      {canReadAll ? (
                        <td className="border-b py-3 pr-3">
                          <RoleBadge roleCode={pilot.roleCode} />
                        </td>
                      ) : null}
                      <td className="border-b py-3 pr-3">
                        <StatusBadge statusCode={pilot.pilotStatusCode} />
                      </td>
                      <td className="border-b py-3 pr-3">
                        <RankBadge rankCode={pilot.rankCode} />
                      </td>
                      {canReadAll ? <td className="border-b py-3 pr-3 font-mono text-xs text-slate-500">{displayValue(pilot.email)}</td> : null}
                      {canReadAll ? <td className="border-b py-3 pr-3 text-slate-500">{displayValue(pilot.phone)}</td> : null}
                      <td className="border-b py-3 pr-3 text-right">
                        <MoreHorizontal className="ml-auto size-4 text-slate-400" aria-hidden="true" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="space-y-3 md:hidden">
              {pilots.map((pilot) => (
                <button
                  className={cn(
                    'flex w-full items-center gap-3 rounded-md border border-slate-200 bg-white p-3 text-left shadow-sm',
                    selectedId === pilot.id && 'border-blue-200 bg-blue-50',
                  )}
                  key={pilot.id}
                  type="button"
                  onClick={() => setSelectedId(pilot.id)}
                >
                  <div className="grid size-11 shrink-0 place-items-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                    {initials(pilot.fullName ?? pilot.login)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{displayValue(pilot.fullName)}</p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      <RankBadge rankCode={pilot.rankCode} />
                      <StatusBadge statusCode={pilot.pilotStatusCode} />
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-slate-300" aria-hidden="true" />
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-400">Показано {pilots.length} пилотов</p>
            </>
          )}
        </Surface>
        <Surface>
          {!detail ? (
            <EmptyState title="Карточка пилота">Выберите пилота в списке.</EmptyState>
          ) : (
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="grid size-14 place-items-center rounded-full bg-blue-600 text-base font-semibold text-white">
                  {initials(detail.profile?.fullName ?? detail.fullName)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">Карточка пилота</p>
                  <h3 className="mt-1 text-lg font-semibold leading-tight">{displayValue(detail.profile?.fullName ?? detail.fullName)}</h3>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <StatusBadge statusCode={detail.profile?.pilotStatusCode ?? detail.pilotStatusCode} />
                    <RankBadge rankCode={detail.profile?.rankCode ?? detail.rankCode} />
                  </div>
                </div>
              </div>
              {selectedPilot?.profile ? (
                <dl className="grid gap-0 overflow-hidden rounded-md border text-sm">
                  <div className="grid grid-cols-[110px_1fr] border-b px-3 py-2">
                    <dt className="text-slate-400">Телефон</dt>
                    <dd className="font-medium">{displayValue(selectedPilot.profile.phone)}</dd>
                  </div>
                  <div className="grid grid-cols-[110px_1fr] border-b px-3 py-2">
                    <dt className="text-slate-400">Telegram</dt>
                    <dd className="font-medium">{displayValue(selectedPilot.profile.telegram)}</dd>
                  </div>
                  <div className="grid grid-cols-[110px_1fr] px-3 py-2">
                    <dt className="text-slate-400">ParaPro</dt>
                    <dd className="font-medium">{displayValue(selectedPilot.profile.parapro)}</dd>
                  </div>
                </dl>
              ) : null}
              {canUpdateAll && selectedPilot?.profile ? (
                <form className="space-y-3 border-t pt-4" onSubmit={saveManagedProfile}>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Статус">
                      <SelectInput
                        value={managedForm.pilotStatusCode}
                        onChange={(event) => setManagedForm((current) => ({ ...current, pilotStatusCode: event.target.value }))}
                      >
                        {STATUS_OPTIONS.map((item) => (
                          <option key={item.code} value={item.code}>
                            {item.label}
                          </option>
                        ))}
                      </SelectInput>
                    </Field>
                    <Field label="Разряд">
                      <SelectInput value={managedForm.rankCode} onChange={(event) => setManagedForm((current) => ({ ...current, rankCode: event.target.value }))}>
                        {RANK_OPTIONS.map((item) => (
                          <option key={item.code} value={item.code}>
                            {item.label}
                          </option>
                        ))}
                      </SelectInput>
                    </Field>
                  </div>
                  <Field label="ParaPro">
                    <TextInput value={managedForm.parapro} onChange={(event) => setManagedForm((current) => ({ ...current, parapro: event.target.value }))} />
                  </Field>
                  <Field label="Служебные заметки">
                    <TextArea value={managedForm.serviceNotes} onChange={(event) => setManagedForm((current) => ({ ...current, serviceNotes: event.target.value }))} />
                  </Field>
                  <Button className="bg-blue-600 hover:bg-blue-700" disabled={saving} type="submit">
                    <Save className="mr-2 size-4" aria-hidden="true" />
                    Сохранить
                  </Button>
                </form>
              ) : null}
            </div>
          )}
        </Surface>
      </div>
    </PageShell>
  );
}
