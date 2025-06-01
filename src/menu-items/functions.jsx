// 1. Import trực tiếp các icon bạn muốn dùng từ Ant Design:
import {
  TranslationOutlined,
  BookOutlined,
  ReadOutlined,
  EditOutlined,
  AppstoreOutlined,
  UserOutlined,
  TrophyOutlined
} from '@ant-design/icons';

// 2. Tạo object chứa tất cả các icon (giúp dễ quản lý và thay đổi sau này)
const icons = {
  TranslationOutlined,
  BookOutlined,
  ReadOutlined,
  EditOutlined,
  AppstoreOutlined,
  UserOutlined,
  TrophyOutlined
};

// 3. Cấu hình menu “Functions” với từng icon phù hợp:
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
      icon: icons.TranslationOutlined, // icon cho “Language”
      target: false,
      breadcrumbs: true
    },
    {
      id: 'course',
      title: 'Course',
      type: 'item',
      url: '/course',
      icon: icons.BookOutlined, // icon cho “Course”
      target: false,
      breadcrumbs: true
    },
    {
      id: 'lesson',
      title: 'Lesson',
      type: 'item',
      url: '/lesson',
      icon: icons.ReadOutlined, // icon cho “Lesson”
      target: false,
      breadcrumbs: true
    },
    {
      id: 'exercise',
      title: 'Exercise',
      type: 'item',
      url: '/exercise',
      icon: icons.EditOutlined, // icon cho “Exercise”
      target: false,
      breadcrumbs: true
    },
    {
      id: 'exerciseType',
      title: 'ExerciseType',
      type: 'item',
      url: '/exerciseType',
      icon: icons.AppstoreOutlined, // icon cho “ExerciseType”
      target: false,
      breadcrumbs: true
    },
    {
      id: 'user',
      title: 'User',
      type: 'item',
      url: '/user',
      icon: icons.UserOutlined, // icon cho “User”
      target: false,
      breadcrumbs: true
    },
    {
      id: 'badge',
      title: 'Badge',
      type: 'item',
      url: '/badge',
      icon: icons.TrophyOutlined, // icon cho “Badge”
      target: false,
      breadcrumbs: true
    }
  ]
};

export default functions;
