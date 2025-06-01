import { axiosClients } from '@/api/axiosClients';

export const getBadge = async () => {
  return await axiosClients.get('/badges').then((res) => {
    return res.data;
  });
};

export const createBadge = async (data) => {
  return await axiosClients.post(`/badges`, data).then((res) => {
    return res.data;
  });
};

export const updateBadge = async (badge_id, data) => {
  return await axiosClients.put(`/badges/${badge_id}`, data).then((res) => {
    return res.data;
  });
};

export const deleteBadge = async (badge_id) => {
  return await axiosClients.delete(`/badges/${badge_id}`).then((res) => {
    return res.data;
  });
};
