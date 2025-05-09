import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Grid, Chip } from '@mui/material';
import { getVipUsersWithPayments } from '@/service/languageService';

const formatNumber = (number) => {
  return number.toLocaleString('en-US');
};

export default function TopRechargeList() {
  const [topRecharge, setTopRecharge] = useState([]);

  useEffect(() => {
    const fetchTopUser = async () => {
      try {
        const response = await getVipUsersWithPayments();

        setTopRecharge(response.data); // Truy cập đúng mảng trong data
        console.log(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách top user:', error);
      }
    };

    fetchTopUser();
  }, []);

  return (
    <Box sx={{ bgcolor: '#fff', borderRadius: '8px', p: 2, maxWidth: 400 }}>
      <Grid container spacing={2}>
        {topRecharge.map((user, index) => (
          <Grid item xs={12} key={user.id}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                bgcolor: index % 2 === 0 ? '#f9f9f9' : '#fff',
                p: 1,
                borderRadius: '8px'
              }}
            >
              {/* Xếp hạng */}
              <Typography
                sx={{
                  fontWeight: 'bold',
                  color: index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : '#000',
                  fontSize: '20px',
                  width: '30px',
                  textAlign: 'center'
                }}
              >
                {index + 1}
              </Typography>
              {/* Avatar */}
              <Avatar src={user.avatar} variant="circle" sx={{ width: 50, height: 50 }} />
              {/* Tên, cấp độ, số tiền */}
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#333' }}>
                  {user.username}
                </Typography>
                <Chip label={`Cấp ${user.level || 1}`} color="warning" size="small" sx={{ mr: 1 }} />
                <Typography variant="body2" sx={{ color: '#777' }}>
                  {formatNumber(user.total_amount)} VNĐ
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
