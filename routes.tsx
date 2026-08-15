import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CreateTimetablePage from './pages/CreateTimetablePage';
import ViewTimetablePage from './pages/ViewTimetablePage';
import AutoGeneratePage from './pages/AutoGeneratePage';
import SettingsPage from './pages/SettingsPage';
import AboutPage from './pages/AboutPage';
import AdminPage from './pages/AdminPage';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <HomePage />,
  },
  {
    name: 'Login',
    path: '/login',
    element: <LoginPage />,
    visible: false,
  },
  {
    name: 'Create Timetable',
    path: '/create',
    element: <CreateTimetablePage />,
  },
  {
    name: 'View Timetable',
    path: '/view',
    element: <ViewTimetablePage />,
  },
  {
    name: 'Auto-Generate',
    path: '/auto-generate',
    element: <AutoGeneratePage />,
  },
  {
    name: 'Settings',
    path: '/settings',
    element: <SettingsPage />,
  },
  {
    name: 'About',
    path: '/about',
    element: <AboutPage />,
  },
  {
    name: 'Admin',
    path: '/admin',
    element: <AdminPage />,
    visible: false,
  },
];

export default routes;
