import { AuthProvider, useAuth } from '@/auth/auth-context';
import { ProtectedRoute } from '@/auth/protected-route';
import { AppLayout } from '@/layout/app-layout';
import { routeMap, useHashRoute } from '@/routes/router';

function AppRoutes() {
  const route = useHashRoute();
  const routeConfig = routeMap[route] ?? routeMap.overview;
  const { isAuthenticated, user } = useAuth();
  const effectiveRouteConfig =
    isAuthenticated && user?.mustChangePassword && route !== 'change-password'
      ? routeMap['change-password']
      : routeConfig;
  const effectiveRoute = effectiveRouteConfig === routeMap['change-password'] ? 'change-password' : route;
  const Page = effectiveRouteConfig.component;

  if (effectiveRouteConfig.public) {
    return <Page />;
  }

  return (
    <AppLayout activeRoute={effectiveRoute}>
      <ProtectedRoute permission={effectiveRouteConfig.permission}>
        <Page />
      </ProtectedRoute>
    </AppLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
