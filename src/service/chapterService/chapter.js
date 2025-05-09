import { axiosClients } from '@/api/axiosClients';

export const createChapter = async (manga_id, chapter_number, title, images) => {
  try {
    const response = await axiosClients.post('/chapters/', {
      manga_id,
      chapter_number,
      title,
      images // Mảng URL hình ảnh
    });
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error('Error creating chapter:', error);
    throw error; // Nếu có lỗi, ném lỗi ra để xử lý bên ngoài
  }
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
