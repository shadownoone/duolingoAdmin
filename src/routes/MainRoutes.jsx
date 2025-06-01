import { lazy } from 'react';

// project import
import Loadable from '@/components/Loadable';
import Dashboard from '@/layout/Dashboard';
import ExerciseType from '@/pages/ExerciseType';

const Color = Loadable(lazy(() => import('@/pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('@/pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('@/pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('@/pages/dashboard/index')));

const Language = Loadable(lazy(() => import('@/pages/Language/index')));
const Course = Loadable(lazy(() => import('@/pages/Course/index')));
const Profile = Loadable(lazy(() => import('@/pages/Profile/profile')));
const User = Loadable(lazy(() => import('@/pages/User/user')));
const Lesson = Loadable(lazy(() => import('@/pages/Lesson/index')));
const Exercise = Loadable(lazy(() => import('@/pages/Exercise/index')));
const Badge = Loadable(lazy(() => import('@/pages/Badge/index')));

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
      path: 'languages',
      element: <Language />
    },
    {
      path: 'course',
      element: <Course />,
      children: [
        {
          path: ':languageId',
          element: <Course />
        }
      ]
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
      path: 'lesson/:courseId',
      element: <Lesson />
    },
    {
      path: 'exercise/:lessonId',
      element: <Exercise />
    },
    {
      path: 'exercisetype',
      element: <ExerciseType />
    },

    {
      path: 'badge',
      element: <Badge />
    }
  ]
};

export default MainRoutes;
