import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, List, ListItem, Paper, Chip, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';

import { getUserTotalPayments } from '@/service/paymentService';

// Hàm định dạng số (thêm dấu phân cách hàng nghìn)
const formatNumber = (number) => {
  if (typeof number === 'string') {
    number = parseFloat(number);
  }
  return number.toLocaleString('en-US');
};

// Avatar nhỏ dùng để hiển thị vị trí (thứ hạng)
const RankAvatar = styled(Avatar)(({ theme, rank }) => {
  let bg;
  if (rank === 0)
    bg = '#FFD700'; // vàng cho hạng 1
  else if (rank === 1)
    bg = '#C0C0C0'; // bạc cho hạng 2
  else if (rank === 2)
    bg = '#CD7F32'; // đồng cho hạng 3
  else bg = theme.palette.grey[300]; // xám nhạt cho các thứ hạng còn lại

  return {
    width: thirty,
    height: thirty,
    fontSize: '1rem',
    backgroundColor: bg,
    color: theme.palette.common.white
  };
});
const thirty = 30;

export default function TopRechargeList() {
  const [topRecharge, setTopRecharge] = useState([]);

  useEffect(() => {
    const fetchTopUser = async () => {
      try {
        const response = await getUserTotalPayments();
        // Giả sử API trả về mảng dạng: [{ user_id, username, avatar, totalAmount }, ...]
        setTopRecharge(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách top user:', error);
      }
    };

    fetchTopUser();
  }, []);

  return (
    <Box sx={{ maxWidth: 480, margin: '0 auto', p: 2 }}>
      <List>
        {topRecharge.map((user, index) => (
          <React.Fragment key={user.user_id}>
            <Paper
              elevation={2}
              sx={{
                p: 1,
                mb: 1,
                borderRadius: 2
              }}
            >
              <ListItem
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                {/* Phần thông tin thứ hạng + avatar + tên + chip cấp độ */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {/* 1. Vòng tròn hiển thị thứ hạng */}
                  <RankAvatar rank={index}>{index + 1}</RankAvatar>

                  {/* 2. Avatar của người dùng */}
                  <Avatar src={user.avatar} alt={user.username} sx={{ width: fifty, height: fifty }} />
                  <Box>
                    {/* 3. Tên user */}
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#333' }}>
                      {user.username}
                    </Typography>
                    {/* 4. Chip hiển thị cấp độ (nếu không có, mặc định là 1) */}
                    <Chip label={`Cấp ${user.level || 1}`} color="warning" size="small" sx={{ mt: 0.5 }} />
                  </Box>
                </Box>

                {/* Phần hiển thị tổng tiền nạp */}
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  {formatNumber(user.totalAmount)} VNĐ
                </Typography>
              </ListItem>
            </Paper>
            {index < topRecharge.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
}

// Kích thước cố định cho avatar người dùng
const fifty = 50;
