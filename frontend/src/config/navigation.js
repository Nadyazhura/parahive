import { ClipboardList, KeyRound, LayoutDashboard, UserRound, UsersRound } from 'lucide-react';

import { PERMISSIONS } from './permissions';

export const navigationItems = [
  {
    id: 'overview',
    label: 'Обзор',
    icon: LayoutDashboard,
  },
  {
    id: 'pilots',
    label: 'Пилоты',
    permission: PERMISSIONS.PILOTS_READ_PUBLIC,
    icon: UsersRound,
  },
  {
    id: 'profile',
    label: 'Моя анкета',
    permission: PERMISSIONS.PILOT_PROFILES_READ_OWN,
    icon: UserRound,
  },
  {
    id: 'users',
    label: 'Доступ',
    permission: PERMISSIONS.USERS_READ_ALL,
    icon: KeyRound,
  },
  {
    id: 'ops',
    label: 'Летная часть',
    permission: PERMISSIONS.PILOT_PROFILES_READ_ALL,
    icon: ClipboardList,
  },
];
