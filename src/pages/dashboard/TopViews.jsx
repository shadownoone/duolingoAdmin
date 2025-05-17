// import React, { useEffect, useState } from 'react';
// import { Box, Typography, Avatar, Grid } from '@mui/material';
// import { getMangaTop } from '@/service/languageService';

// const formatNumber = (number) => {
//   return number.toLocaleString('en-US');
// };

// export default function TopMangaList() {
//   const [topManga, setTopManga] = useState([]);

//   useEffect(() => {
//     const fetchTopMangas = async () => {
//       try {
//         const response = await getMangaTop();

//         // Kiểm tra nếu dữ liệu trả về có trường data và bên trong là mảng
//         if (response.data && Array.isArray(response.data.data.data)) {
//           setTopManga(response.data.data.data); // Truy cập đúng mảng trong data
//           console.log(response.data.data.data);
//         } else {
//           console.error('Dữ liệu trả về không phải là một mảng:', response);
//         }
//       } catch (error) {
//         console.error('Lỗi khi lấy danh sách top manga:', error);
//       }
//     };

//     fetchTopMangas();
//   }, []);

//   return (
//     <Box sx={{ bgcolor: '#fff', borderRadius: '8px', p: 2, maxWidth: 400 }}>
//       <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
//         Top Manga
//       </Typography>
//       <Grid container spacing={2}>
//         {topManga.slice(0, 5).map(
//           (
//             manga,
//             index // Chỉ lấy 5 phần tử đầu tiên
//           ) => (
//             <Grid item xs={12} key={manga.id}>
//               <Box
//                 sx={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: 2,
//                   bgcolor: index % 2 === 0 ? '#f9f9f9' : '#fff',
//                   p: 1,
//                   borderRadius: '8px'
//                 }}
//               >
//                 {/* Xếp hạng */}
//                 <Typography
//                   sx={{
//                     fontWeight: 'bold',
//                     color: index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : '#000',
//                     fontSize: '20px',
//                     width: '30px',
//                     textAlign: 'center'
//                   }}
//                 >
//                   {index + 1}
//                 </Typography>
//                 {/* Ảnh bìa */}
//                 <Avatar src={manga.cover_image} variant="square" sx={{ width: 60, height: 60 }} />
//                 {/* Tên và lượt xem */}
//                 <Box>
//                   <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#333' }}>
//                     {manga.title}
//                   </Typography>
//                   <Typography variant="body2" sx={{ color: '#777' }}>
//                     {formatNumber(manga.views)} lượt xem
//                   </Typography>
//                 </Box>
//               </Box>
//             </Grid>
//           )
//         )}
//       </Grid>
//     </Box>
//   );
// }
