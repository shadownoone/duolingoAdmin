import { axiosClients } from '@/api/axiosClients';

export const handleLogout = async () => {
  try {
    // Gọi API đăng xuất từ backend
    await axiosClients.get('/auth/logout');

    // Chuyển hướng người dùng về trang đăng nhập
    window.location.href = 'http://localhost:5173/login';
  } catch (error) {
    console.error('Error during logout:', error);
    alert('Logout failed, please try again.');
  }
};
