import { axiosClients } from '@/api/axiosClients';

export const getExerciseByLesson = async (lessonId) => {
  try {
    const res = await axiosClients.get(`/exercises/${lessonId}`);

    return res.data;
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return { lessons: [] };
  }
};

export const getExerciseType = async () => {
  try {
    const res = await axiosClients.get('/exerciseTypes/all');

    return res.data;
  } catch (error) {
    console.error('Error fetching exercise types:', error);
    return { exerciseTypes: [] };
  }
};

export const addExerciseType = async (exerciseType) => {
  try {
    const res = await axiosClients.post('/exerciseTypes/add', exerciseType);
    return res.data;
  } catch (error) {
    console.error('Error adding exercise type:', error);
    throw error;
  }
};

export const updateExerciseType = async (exerciseId, exerciseType) => {
  try {
    const res = await axiosClients.put(`/exerciseTypes/${exerciseId}`, exerciseType);
    return res.data;
  } catch (error) {
    console.error('Error updating exercise type:', error);
    throw error;
  }
};
export const deleteExerciseType = async (exerciseId) => {
  try {
    const res = await axiosClients.delete(`/exerciseTypes/${exerciseId}`);
    return res.data;
  } catch (error) {
    console.error('Error deleting exercise type:', error);
    throw error;
  }
};
