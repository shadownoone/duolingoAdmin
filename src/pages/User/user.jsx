import React, { useState, useEffect } from 'react';
import {
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  TextField,
  Grid,
  Tooltip,
  TablePagination
} from '@mui/material';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAllUser } from '@/service/userService';

export default function User() {
  // allUsers: giữ toàn bộ dữ liệu fetch về ban đầu
  const [allUsers, setAllUsers] = useState([]);
  // listUsers: dữ liệu đang hiển thị (có thể đã bị filter)
  const [listUsers, setListUsers] = useState([]);
  const [open, setOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Hàm lọc (filter) dựa trên mảng nguồn (data) và từ khóa (term)
  const applyFilter = (data, term) => {
    if (!term.trim()) {
      // Nếu chuỗi term rỗng hoặc toàn khoảng trắng, trả về toàn bộ
      setListUsers(data);
    } else {
      // Lọc ra những user có username chứa term
      const filtered = data.filter((user) => user.username.toLowerCase().includes(term.toLowerCase()));
      setListUsers(filtered);
    }
  };

  // Khi user gõ vào ô tìm kiếm
  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    // Lọc từ mảng allUsers, chứ không phải từ listUsers (đã filter trước đó)
    applyFilter(allUsers, term);
    setPage(0);
  };

  useEffect(() => {
    const fetchAllUser = async () => {
      try {
        const response = await getAllUser();
        // Giả sử API trả về: response.data.users = [ { user_id, username, email, is_vip, ... }, ... ]
        const users = response.data.users || [];
        // Lưu vào both allUsers và listUsers (ban đầu chưa filter)
        setAllUsers(users);
        setListUsers(users);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAllUser();
  }, []);

  // Xử lý thay đổi trang
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Xử lý thay đổi số dòng mỗi trang
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Tạm placeholder cho hàm mở dialog (thêm/sửa)
  const handleOpen = (user) => {
    // Nếu user = null => thêm mới, ngược lại: chỉnh sửa user
    setOpen(true);
    // ... có thể set lại một state editUser nếu muốn hiện thông tin lên form
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Container sx={{ mt: 4 }}>
        <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => handleOpen(null)} sx={{ mb: 2 }}>
          Add New User
        </Button>

        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={8}>
            <TextField variant="outlined" placeholder="Search user..." value={searchTerm} onChange={handleSearch} sx={{ width: '300px' }} />
          </Grid>
        </Grid>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>No.</b>
                </TableCell>
                <TableCell>
                  <b>User Name</b>
                </TableCell>
                <TableCell>
                  <b>Email</b>
                </TableCell>
                <TableCell>
                  <b>VIP</b>
                </TableCell>
                <TableCell>
                  <b>Actions</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => (
                <TableRow key={user.user_id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.is_vip ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleOpen(user)}>
                        <EditOutlined />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error">
                        <DeleteOutlined />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={listUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        <Dialog open={open} onClose={handleClose}>
          {/* Nội dung form thêm/sửa user đặt ở đây */}
        </Dialog>
      </Container>
    </div>
  );
}
