import { axiosClients } from '@/api/axiosClients';

export const getPayments = async () => {
  return await axiosClients.get('/payments/total').then((res) => {
    return res.data;
  });
};

export const getUserTotalPayments = async () => {
  return await axiosClients.get('/payments/userPay').then((res) => {
    return res.data;
  });
};
