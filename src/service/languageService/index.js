import { axiosClients } from '@/api/axiosClients';

export const getLanguage = async () => {
  return await axiosClients.get('/languages/all').then((res) => {
    return res.data;
  });
};

export const getMangaBySlug = async (slug) => {
  return await axiosClients.get('/mangas/' + slug).then((res) => {
    return res.data;
  });
};

export const createLanguage = async (languageData) => {
  try {
    const response = await axiosClients.post('/languages/create', languageData);
    return response.data;
  } catch (error) {
    console.error('Error creating manga:', error);
    throw error;
  }
};

export const updateLanguage = async (id, formData) => {
  return await axiosClients.put(`/languages/${id}`, formData).then((res) => {
    return res.data;
  });
};

export const getMangaTop = async () => {
  return await axiosClients.get('mangas/top').then((res) => {
    return res.data;
  });
};

export const getVipUsersWithPayments = async () => {
  return await axiosClients.get('mangas/vip').then((res) => {
    return res.data;
  });
};

export const deleteLanguage = async (id) => {
  return await axiosClients.delete(`/languages/${id}`).then((res) => {
    return res.data;
  });
};

export const getStatistical = async () => {
  return await axiosClients.get('/mangas/statistical').then((res) => {
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
