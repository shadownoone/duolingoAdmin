// assets
import { LoginOutlined, ProfileOutlined } from '@ant-design/icons';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined
};

// ==============================|| MENU ITEMS - EXTRA FUNCTIONS ||============================== //

const functions = {
  id: 'functions',
  title: 'Functions',
  type: 'group',
  children: [
    {
      id: 'language',
      title: 'Language',
      type: 'item',
      url: '/languages',
      icon: icons.LoginOutlined,
      target: false,
      breadcrumbs: true
    },
    {
      id: 'course',
      title: 'Course',
      type: 'item',
      url: '/course',
      icon: icons.ProfileOutlined,
      target: false,
      breadcrumbs: true
    },
    {
      id: 'lesson',
      title: 'Lesson',
      type: 'item',
      url: '/lesson',
      icon: icons.ProfileOutlined,
      target: false,
      breadcrumbs: true
    },
    {
      id: 'user',
      title: 'User',
      type: 'item',
      url: '/user',
      icon: icons.ProfileOutlined,
      target: false,
      breadcrumbs: true
    }
  ]
};

export default functions;
