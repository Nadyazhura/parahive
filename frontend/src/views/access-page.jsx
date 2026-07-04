import { LockKeyhole, MoreHorizontal, RefreshCw, Search, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useAuth } from '@/auth/auth-context';
import { RoleBadge, StatusBadge } from '@/components/domain/badges';
import { Button } from '@/components/ui/button';
import { EmptyState, ErrorMessage, Field, IconTextInput, SelectInput, TextInput } from '@/components/ui/form-controls';
import { ROLE_OPTIONS, STATUS_OPTIONS } from '@/config/dictionaries';
import { PERMISSIONS } from '@/config/permissions';
import { apiClient } from '@/lib/api-client';
import { buildQuery, displayValue } from '@/lib/format';
import { PageShell, Surface } from './page-shell';

const initialNewUser = {
  login: '',
  email: '',
  temporaryPassword: '',
  roleCode: 'PILOT',
  fullName: '',
  statusCode: 'active',
};

export function AccessPage() {
  const { accessToken, hasPermission } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [newUser, setNewUser] = useState(initialNewUser);
  const [resetPasswordById, setResetPasswordById] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const canCreate = hasPermission(PERMISSIONS.USERS_CREATE);
  const canAssignRole = hasPermission(PERMISSIONS.ROLES_ASSIGN);
  const canBlock = hasPermission(PERMISSIONS.USERS_BLOCK);
  const canResetPassword = hasPermission(PERMISSIONS.AUTH_RESET_USER_PASSWORD);

  async function loadUsers() {
    setLoading(true);
    setError(null);

    try {
      const result = await apiClient.users.list(accessToken, buildQuery({ search, limit: 50 }));
      setUsers(result.items ?? []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  async function perform(action) {
    setError(null);

    try {
      await action();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function createUser(event) {
    event.preventDefault();
    setError(null);

    try {
      await apiClient.users.create(accessToken, newUser);
      setNewUser(initialNewUser);
      await loadUsers();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function updateRole(user, roleCode) {
    await perform(async () => {
      await apiClient.users.updateRole(accessToken, user.id, { roleCode });
      await loadUsers();
    });
  }

  async function updateBlock(user) {
    await perform(async () => {
      await apiClient.users.updateBlock(accessToken, user.id, { blocked: !user.blocked });
      await loadUsers();
    });
  }

  async function resetPassword(user) {
    const temporaryPassword = resetPasswordById[user.id];

    if (!temporaryPassword) {
      setError('Введите временный пароль.');
      return;
    }

    await perform(async () => {
      await apiClient.users.resetPassword(accessToken, user.id, { temporaryPassword });
      setResetPasswordById((current) => ({ ...current, [user.id]: '' }));
      await loadUsers();
    });
  }

  return (
    <PageShell
      actions={
        <Button className="size-9 px-0" disabled={loading} type="button" variant="outline" onClick={loadUsers}>
          <RefreshCw className="size-4" aria-hidden="true" />
          <span className="sr-only">Обновить</span>
        </Button>
      }
      title="Управление доступом"
    >
      <ErrorMessage>{error}</ErrorMessage>

      {canCreate ? (
        <Surface>
          <form className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr_140px_1fr_140px_auto]" onSubmit={createUser}>
            <Field label="Логин">
              <TextInput value={newUser.login} onChange={(event) => setNewUser((current) => ({ ...current, login: event.target.value }))} />
            </Field>
            <Field label="Email">
              <TextInput value={newUser.email} onChange={(event) => setNewUser((current) => ({ ...current, email: event.target.value }))} />
            </Field>
            <Field label="Временный пароль">
              <TextInput
                type="password"
                value={newUser.temporaryPassword}
                onChange={(event) => setNewUser((current) => ({ ...current, temporaryPassword: event.target.value }))}
              />
            </Field>
            <Field label="Роль">
              <SelectInput value={newUser.roleCode} onChange={(event) => setNewUser((current) => ({ ...current, roleCode: event.target.value }))}>
                {ROLE_OPTIONS.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.label}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="ФИО">
              <TextInput value={newUser.fullName} onChange={(event) => setNewUser((current) => ({ ...current, fullName: event.target.value }))} />
            </Field>
            <Field label="Статус">
              <SelectInput value={newUser.statusCode} onChange={(event) => setNewUser((current) => ({ ...current, statusCode: event.target.value }))}>
                {STATUS_OPTIONS.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.label}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Button className="self-end bg-blue-600 hover:bg-blue-700" type="submit">
              <UserPlus className="mr-2 size-4" aria-hidden="true" />
              Создать
            </Button>
          </form>
        </Surface>
      ) : null}

      <Surface>
        <form
          className="mb-4 grid gap-3 md:grid-cols-[1fr_auto]"
          onSubmit={(event) => {
            event.preventDefault();
            loadUsers();
          }}
        >
          <IconTextInput icon={Search} placeholder="Поиск..." value={search} onChange={(event) => setSearch(event.target.value)} />
          <Button className="bg-blue-600 hover:bg-blue-700" type="submit">Найти</Button>
        </form>

        {users.length === 0 ? (
          <EmptyState title="Пользователи не найдены">Проверьте фильтр или доступность backend.</EmptyState>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] border-separate border-spacing-0 text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-xs text-slate-500">
                  <th className="border-y py-3 pl-3 pr-3 font-medium">Пользователь</th>
                  <th className="border-y py-3 pr-3 font-medium">Email</th>
                  <th className="border-y py-3 pr-3 font-medium">Роль</th>
                  <th className="border-y py-3 pr-3 font-medium">Статус</th>
                  <th className="border-y py-3 pr-3 font-medium">Заблокирован</th>
                  <th className="border-y py-3 pr-3 font-medium">Действия</th>
                  <th className="border-y py-3 pr-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="border-b py-3 pl-3 pr-3">
                      <div className="flex items-center gap-3">
                        <div className="grid size-8 place-items-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                          {(user.profile?.fullName ?? user.login ?? 'П').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{displayValue(user.profile?.fullName ?? user.login)}</div>
                          <div className="text-xs text-slate-400">{user.login}</div>
                        </div>
                      </div>
                    </td>
                    <td className="border-b py-3 pr-3 font-mono text-xs text-slate-500">{user.email}</td>
                    <td className="border-b py-3 pr-3">
                      <div className="max-w-40">
                        {canAssignRole ? (
                          <SelectInput value={user.roleCode} onChange={(event) => updateRole(user, event.target.value)}>
                            {ROLE_OPTIONS.map((item) => (
                              <option key={item.code} value={item.code}>
                                {item.label}
                              </option>
                            ))}
                          </SelectInput>
                        ) : (
                          <RoleBadge roleCode={user.roleCode} />
                        )}
                      </div>
                    </td>
                    <td className="border-b py-3 pr-3">
                      <StatusBadge statusCode={user.profile?.pilotStatusCode} />
                    </td>
                    <td className="border-b py-3 pr-3">
                      <button
                        className={`h-5 w-9 rounded-full p-0.5 transition-colors ${user.blocked ? 'bg-blue-600' : 'bg-slate-300'}`}
                        disabled={!canBlock}
                        type="button"
                        onClick={() => updateBlock(user)}
                      >
                        <span className={`block size-4 rounded-full bg-white transition-transform ${user.blocked ? 'translate-x-4' : ''}`} />
                      </button>
                    </td>
                    <td className="border-b py-3 pr-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {canResetPassword ? (
                          <>
                            <TextInput
                              className="w-40"
                              placeholder="Временный пароль"
                              type="password"
                              value={resetPasswordById[user.id] ?? ''}
                              onChange={(event) => setResetPasswordById((current) => ({ ...current, [user.id]: event.target.value }))}
                            />
                            <Button type="button" variant="outline" onClick={() => resetPassword(user)}>
                              <LockKeyhole className="mr-2 size-4" aria-hidden="true" />
                              Сбросить
                            </Button>
                          </>
                        ) : null}
                      </div>
                    </td>
                    <td className="border-b py-3 pr-3">
                      <MoreHorizontal className="size-4 text-slate-400" aria-hidden="true" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Surface>
    </PageShell>
  );
}
