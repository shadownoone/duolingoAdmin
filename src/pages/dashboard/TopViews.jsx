import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Grid } from '@mui/material';
import { getAllUser } from '@/service/userService';

export default function TopVipUserList() {
  // Mình sẽ dùng state để lưu toàn bộ danh sách VIP user
  const [vipUsers, setVipUsers] = useState([]);

  useEffect(() => {
    const fetchAllUser = async () => {
      try {
        const response = await getAllUser();
        // Giả sử API trả về response.data.users là mảng user
        const allUsers = response.data.users || [];

        // Lọc ra chỉ những user có is_vip === true
        const onlyVip = allUsers.filter((user) => user.is_vip === true);

        // Cập nhật state vipUsers
        setVipUsers(onlyVip);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchAllUser();
  }, []);

  return (
    <Box sx={{ bgcolor: '#fff', borderRadius: '8px', p: 2, maxWidth: 400 }}>
      <Grid container spacing={2}>
        {vipUsers.length > 0 ? (
          vipUsers.slice(0, 5).map((user, index) => (
            <Grid item xs={12} key={user.user_id}>
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
                {/* Avatar (tạm thời dùng avatar trống hoặc đặt 1 ảnh cố định) */}
                <Avatar src={user.avatar && user.avatar.length > 0 ? user.avatar : undefined} sx={{ width: 60, height: 60 }}>
                  {(!user.avatar || user.avatar.length === 0) && user.username.charAt(0).toUpperCase()}
                </Avatar>
                {/* Thông tin user */}
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#333' }}>
                    {user.username}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#777' }}>
                    {user.email}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary" align="center">
              Hiện tại không có VIP user nào.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
