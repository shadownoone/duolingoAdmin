import { axiosClients } from '@/api/axiosClients';

export const getPayments = async () => {
  return await axiosClients.get('/payments/total').then((res) => {
    return res.data;
  });
};
