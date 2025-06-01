import React, { useState, useEffect } from 'react';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  IconButton,
  TablePagination,
  TextField,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button
} from '@mui/material';
import { EyeOutlined, DeleteOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify'; // <-- import toast từ react-toastify

import { getBadge, createBadge, updateBadge, deleteBadge } from '@/service/badgeService';

export default function BadgeManager() {
  const [badges, setBadges] = useState([]);
  const [filteredBadges, setFilteredBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const [badgeName, setBadgeName] = useState('');
  const [badgeDescription, setBadgeDescription] = useState('');
  const [badgeIconUrl, setBadgeIconUrl] = useState('');
  const [badgeXpThreshold, setBadgeXpThreshold] = useState('');

  const [badgeIdToEdit, setBadgeIdToEdit] = useState(null);

  const fetchBadges = async () => {
    try {
      setLoading(true);
      const res = await getBadge();
      const data = Array.isArray(res.data.data) ? res.data.data : [];
      setBadges(data);
      applyFilter(data, searchTerm);
    } catch (err) {
      console.error('Error fetching badges:', err);
      toast.error('Có lỗi khi tải danh sách badge');
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = (data, term) => {
    if (!term.trim()) {
      setFilteredBadges(data);
    } else {
      const filtered = data.filter((badge) => badge.badge_name.toLowerCase().includes(term.toLowerCase()));
      setFilteredBadges(filtered);
    }
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    applyFilter(badges, term);
    setPage(0);
  };

  // ---------- THÊM / HIỆN DIALOG THÊM BADGE ----------
  const handleAddBadgeOpen = () => {
    // Reset form
    setBadgeName('');
    setBadgeDescription('');
    setBadgeIconUrl('');
    setBadgeXpThreshold('');
    setOpenAddDialog(true);
  };

  const handleAddBadgeClose = () => {
    setOpenAddDialog(false);
    // Reset form nếu muốn
    setBadgeName('');
    setBadgeDescription('');
    setBadgeIconUrl('');
    setBadgeXpThreshold('');
  };

  const handleAddBadge = async () => {
    if (!badgeName.trim()) {
      toast.warning('Tên Badge không được để trống');
      return;
    }
    try {
      const newBadgePayload = {
        badge_name: badgeName,
        description: badgeDescription,
        icon_url: badgeIconUrl,
        xp_threshold: parseInt(badgeXpThreshold, 10) || 0
      };
      const res = await createBadge(newBadgePayload);

      // Giả sử API trả về { code: 0, data: {...} } khi thành công
      if (res.code === 0) {
        toast.success('Tạo badge thành công');
        fetchBadges();
        handleAddBadgeClose();
      } else {
        toast.error(res.message || 'Đã có lỗi khi tạo badge');
      }
    } catch (error) {
      console.error('Error adding badge:', error);
      toast.error('Đã xảy ra lỗi khi tạo badge');
    }
  };

  // ---------- DIALOG CHỈNH SỬA BADGE ----------
  const handleEditBadgeOpen = (badge) => {
    setBadgeIdToEdit(badge.badge_id);
    setBadgeName(badge.badge_name || '');
    setBadgeDescription(badge.description || '');
    setBadgeIconUrl(badge.icon_url || '');
    setBadgeXpThreshold(badge.xp_threshold?.toString() || '');
    setOpenEditDialog(true);
  };

  const handleEditBadgeClose = () => {
    setOpenEditDialog(false);
    setBadgeIdToEdit(null);
    setBadgeName('');
    setBadgeDescription('');
    setBadgeIconUrl('');
    setBadgeXpThreshold('');
  };

  const handleUpdateBadge = async () => {
    if (!badgeName.trim()) {
      toast.warning('Tên Badge không được để trống');
      return;
    }
    try {
      const updatedPayload = {
        badge_name: badgeName,
        description: badgeDescription,
        icon_url: badgeIconUrl,
        xp_threshold: parseInt(badgeXpThreshold, 10) || 0
      };
      const res = await updateBadge(badgeIdToEdit, updatedPayload);

      if (res.code === 0) {
        toast.success('Cập nhật badge thành công');
        fetchBadges();
        handleEditBadgeClose();
      } else {
        toast.error(res.message || 'Đã có lỗi khi cập nhật badge');
      }
    } catch (error) {
      console.error('Error updating badge:', error);
      toast.error('Đã xảy ra lỗi khi cập nhật badge');
    }
  };

  // ---------- XÓA BADGE ----------
  const handleDeleteBadge = async (badge) => {
    if (!window.confirm(`Bạn có chắc muốn xóa badge "${badge.badge_name}" không?`)) {
      return;
    }
    try {
      const res = await deleteBadge(badge.badge_id);

      // Một số API có thể trả đúng data hoặc trả { code: 0 } hoặc không có code
      if (res.code === 0 || res.code === undefined) {
        toast.success(`Xóa badge "${badge.badge_name}" thành công`);
        fetchBadges();
      } else {
        toast.error(res.message || 'Đã có lỗi khi xóa badge');
      }
    } catch (error) {
      console.error('Error deleting badge:', error);
      toast.error('Đã xảy ra lỗi khi xóa badge');
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      {/* Button thêm mới */}
      <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleAddBadgeOpen} sx={{ mb: 2 }}>
        Add New Badge
      </Button>

      {/* Search bar */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={8}>
          <TextField variant="outlined" placeholder="Search badge..." value={searchTerm} onChange={handleSearch} sx={{ width: '300px' }} />
        </Grid>
      </Grid>

      {/* Bảng danh sách badge */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>No.</b>
              </TableCell>
              <TableCell>
                <b>Badge Name</b>
              </TableCell>
              <TableCell>
                <b>Description</b>
              </TableCell>
              <TableCell>
                <b>XP Threshold</b>
              </TableCell>
              <TableCell>
                <b>Actions</b>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredBadges.length > 0 ? (
              filteredBadges.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((badge, index) => (
                <TableRow key={badge.badge_id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{badge.badge_name}</TableCell>
                  <TableCell>{badge.description}</TableCell>
                  <TableCell>{badge.xp_threshold}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleEditBadgeOpen(badge)}>
                        <EditOutlined />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => handleDeleteBadge(badge)}>
                        <DeleteOutlined />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No badges found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Phân trang */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredBadges.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Dialog: Thêm mới badge */}
      <Dialog open={openAddDialog} onClose={handleAddBadgeClose} fullWidth maxWidth="sm">
        <DialogTitle>Add New Badge</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Badge Name" value={badgeName} onChange={(e) => setBadgeName(e.target.value)} sx={{ mb: 2 }} />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={2}
            value={badgeDescription}
            onChange={(e) => setBadgeDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField fullWidth label="Icon URL" value={badgeIconUrl} onChange={(e) => setBadgeIconUrl(e.target.value)} sx={{ mb: 2 }} />
          <TextField
            fullWidth
            label="XP Threshold"
            type="number"
            value={badgeXpThreshold}
            onChange={(e) => setBadgeXpThreshold(e.target.value)}
            sx={{ mb: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddBadgeClose}>Cancel</Button>
          <Button variant="contained" onClick={handleAddBadge}>
            Add Badge
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: Chỉnh sửa badge */}
      <Dialog open={openEditDialog} onClose={handleEditBadgeClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit Badge</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Badge Name" value={badgeName} onChange={(e) => setBadgeName(e.target.value)} sx={{ mb: 2 }} />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={2}
            value={badgeDescription}
            onChange={(e) => setBadgeDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField fullWidth label="Icon URL" value={badgeIconUrl} onChange={(e) => setBadgeIconUrl(e.target.value)} sx={{ mb: 2 }} />
          <TextField
            fullWidth
            label="XP Threshold"
            type="number"
            value={badgeXpThreshold}
            onChange={(e) => setBadgeXpThreshold(e.target.value)}
            sx={{ mb: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditBadgeClose}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateBadge}>
            Update Badge
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
