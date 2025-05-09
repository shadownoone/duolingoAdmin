import React, { useState, useEffect } from 'react';
import {
  Typography,
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
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Tooltip,
  Avatar,
  TablePagination
} from '@mui/material';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAllUser } from '@/service/userService';

export default function User() {
  const [listUsers, setListUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedManga, setSelectedManga] = useState(null);
  const [image, setImage] = useState(null);
  const [page, setPage] = useState(0); // Trạng thái cho trang hiện tại
  const [rowsPerPage, setRowsPerPage] = useState(5); // Số lượng sản phẩm trên mỗi trang

  const handleOpen = (manga) => {
    setSelectedManga(manga);
    setImage(manga?.image || null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedManga(null);
    setImage(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result); // hiển thị hình ảnh tạm thời
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const fetchAllUser = async () => {
      const data = await getAllUser();

      setListUsers(data.data.data);
    };

    fetchAllUser();
  }, []);

  // Xử lý thay đổi trang
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Xử lý thay đổi số lượng hàng trên mỗi trang
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <Container sx={{ mt: 4 }}>
        <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => handleOpen(null)} sx={{ mb: 2 }}>
          Add New User
        </Button>

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
                  <b>Phone</b>
                </TableCell>
                <TableCell>
                  <b>Address</b>
                </TableCell>
                <TableCell>
                  <b>Actions</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Dữ liệu Manga */}
              {listUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => (
                <TableRow key={user.user_id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>

                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.address}</TableCell>
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

        {/* Thêm phân trang */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={listUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        {/* Dialog Form thêm/sửa */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{selectedManga ? 'Edit Manga' : 'Add New Manga'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth label="Title" defaultValue={selectedManga?.title || ''} variant="outlined" />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Genre" defaultValue={selectedManga?.genre || ''} variant="outlined" />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Author" defaultValue={selectedManga?.author || ''} variant="outlined" />
              </Grid>

              {/* Trường chọn hình ảnh */}
              <Grid item xs={12}>
                <Typography variant="body1" gutterBottom>
                  Select Manga Image:
                </Typography>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {image && <Avatar alt="Selected Manga" src={image} sx={{ width: 100, height: 100, mt: 2 }} />}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" onClick={handleClose}>
              {selectedManga ? 'Save Changes' : 'Add Manga'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
}
