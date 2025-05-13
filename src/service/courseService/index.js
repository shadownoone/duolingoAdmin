import { axiosClients } from '@/api/axiosClients';

export const getGenre = async () => {
  return await axiosClients.get('/genres/all').then((res) => {
    return res.data;
  });
};

export const addCourse = async (courseData) => {
  return await axiosClients.post('/courses/create', courseData).then((res) => {
    return res.data;
  });
};

export const updateCourse = async (id, formData) => {
  return await axiosClients.put(`/courses/${id}`, formData).then((res) => {
    return res.data;
  });
};

export const deleteCourse = async (course_id) => {
  return await axiosClients.delete(`/courses/${course_id}`).then((res) => res.data);
};
