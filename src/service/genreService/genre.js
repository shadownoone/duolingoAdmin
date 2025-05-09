import { axiosClients } from '@/api/axiosClients';

export const getGenre = async () => {
  return await axiosClients.get('/genres/all').then((res) => {
    return res.data;
  });
};
// Hàm API để thêm một thể loại mới
export const addGenre = async (genreName) => {
  return await axiosClients.post('/genres/add', { genreName }).then((res) => {
    return res.data;
  });
};

export const updateGenre = async (id, genreName) => {
  return await axiosClients.put(`/genres/${id}`, { genreName }).then((res) => {
    return res.data;
  });
};

export const deleteGenre = async (id) => {
  return await axiosClients.delete(`/genres/${id}`).then((res) => res.data);
};
