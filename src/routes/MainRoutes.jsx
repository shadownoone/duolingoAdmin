import { lazy } from 'react';

// project import
import Loadable from '@/components/Loadable';
import Dashboard from '@/layout/Dashboard';

const Color = Loadable(lazy(() => import('@/pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('@/pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('@/pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('@/pages/dashboard/index')));

const Language = Loadable(lazy(() => import('@/pages/Language/index')));
const Genre = Loadable(lazy(() => import('@/pages/Genre/genre')));
const Profile = Loadable(lazy(() => import('@/pages/Profile/profile')));
const User = Loadable(lazy(() => import('@/pages/User/user')));
const Chapter = Loadable(lazy(() => import('@/pages/Chapter/chapter')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('@/pages/extra-pages/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <Dashboard />,

  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'color',
      element: <Color />
    },

    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'typography',
      element: <Typography />
    },
    {
      path: 'language',
      element: <Language />
    },
    {
      path: 'genre',
      element: <Genre />
    },
    {
      path: 'profile',
      element: <Profile />
    },
    {
      path: 'user',
      element: <User />
    },
    {
      path: 'chapter',
      element: <Chapter />
    }
  ]
};

export default MainRoutes;
