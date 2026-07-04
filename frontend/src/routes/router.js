import { useEffect, useMemo, useState } from 'react';

import { PERMISSIONS } from '@/config/permissions';
import { AccessPage } from '@/views/access-page';
import { FlightOpsPage } from '@/views/flight-ops-page';
import { LoginPage } from '@/views/login-page';
import { OverviewPage } from '@/views/overview-page';
import { PilotsPage } from '@/views/pilots-page';
import { ProfilePage } from '@/views/profile-page';
import { ChangePasswordPage } from '@/views/change-password-page';

export const routeMap = {
  login: {
    component: LoginPage,
    public: true,
  },
  'change-password': {
    component: ChangePasswordPage,
    permission: PERMISSIONS.AUTH_CHANGE_OWN_PASSWORD,
  },
  overview: {
    component: OverviewPage,
  },
  pilots: {
    component: PilotsPage,
    permission: PERMISSIONS.PILOTS_READ_PUBLIC,
  },
  profile: {
    component: ProfilePage,
    permission: PERMISSIONS.PILOT_PROFILES_READ_OWN,
  },
  users: {
    component: AccessPage,
    permission: PERMISSIONS.USERS_READ_ALL,
  },
  ops: {
    component: FlightOpsPage,
    permission: PERMISSIONS.PILOT_PROFILES_READ_ALL,
  },
};

function getRouteFromHash() {
  return window.location.hash.replace(/^#\/?/, '') || 'overview';
}

export function setRoute(routeId) {
  window.location.hash = `/${routeId}`;
}

export function useHashRoute() {
  const [route, setRouteState] = useState(getRouteFromHash);

  useEffect(() => {
    const onHashChange = () => setRouteState(getRouteFromHash());

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return useMemo(() => (routeMap[route] ? route : 'overview'), [route]);
}
