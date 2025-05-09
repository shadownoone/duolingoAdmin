import { axiosClients } from '@/api/axiosClients';

export const getAllUser = async () => {
  return await axiosClients.get('/users/all').then((res) => {
    return res.data;
  });
};

export const getCurrentUser = async () => {
  return await axiosClients.get('/auth/current-user').then((res) => {
    return res.data;
  });
};

export const updateProfile = async (updateData) => {
  try {
    const response = await axiosClients.put(`/users/update`, updateData);
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error; // Ném lỗi ra để xử lý bên ngoài nếu cần
  }
};

export const totalUser = async () => {
  return await axiosClients.get('/users/total').then((res) => {
    return res.data;
  });
};

export const uploadSingleImage = async (base64) => {
  try {
    const response = await axiosClients.post(`/users/uploadImage`, { image: base64 });
    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error; // Ném lỗi ra để xử lý bên ngoài nếu cần
  }
};

export const uploadMultipleImages = async (images) => {
  try {
    const response = await axiosClients.post(`/users/uploadMultipleImages`, { images });
    return response.data;
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw error; // Ném lỗi ra để xử lý bên ngoài nếu cần
  }
};
