import { axiosClients } from '@/api/axiosClients';

export const getLessonByCourse = async (courseId) => {
  try {
    const res = await axiosClients.get(`/lessons/les/${courseId}`);

    return res.data; // Đảm bảo trả về đúng dữ liệu lessons
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return { lessons: [] }; // Trả về một mảng rỗng nếu có lỗi
  }
};

export const createLesson = async (formData) => {
  try {
    const res = await axiosClients.post('/lessons/', formData); // Gửi dữ liệu tới API
    return res.data; // Trả về dữ liệu nhận được từ server
  } catch (error) {
    console.error('Error creating lesson:', error);
    throw error; // Ném lỗi để có thể bắt ở nơi gọi API
  }
};

export const updateLesson = async (lessonId, formData) => {
  try {
    const res = await axiosClients.put(`/lessons/${lessonId}/`, formData); // Gửi dữ liệu tới API
    return res.data; // Trả về dữ liệu nhận được từ server
  } catch (error) {
    console.error('Error updating lesson:', error);
    throw error; // Ném lỗi để có thể bắt ở nơi gọi API
  }
};

export const deleteLesson = async (lessonId) => {
  try {
    const res = await axiosClients.delete(`/lessons/${lessonId}/`); // Gửi yêu cầu xóa tới API
    return res.data; // Trả về dữ liệu nhận được từ server
  } catch (error) {
    console.error('Error deleting lesson:', error);
    throw error; // Ném lỗi để có thể bắt ở nơi gọi API
  }
};
