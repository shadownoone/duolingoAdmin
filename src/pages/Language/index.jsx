import React, { useState, useEffect } from 'react';
import {
  Container,
  Button,
  Grid,
  TextField,
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import ReactCountryFlag from 'react-country-flag';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getLanguage, createLanguage, updateLanguage, deleteLanguage } from '@/service/languageService';

export default function LanguageAdmin() {
  // State for language list and filtering
  const [languages, setLanguages] = useState([]);
  const [filteredLanguages, setFilteredLanguages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Add-language dialog state
  const [openAddDialog, setOpenAddDialog] = useState(false);

  // Edit-language dialog state
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState(null);

  // Form data for adding/updating
  const [formData, setFormData] = useState({
    language_code: '',
    language_name: '',
    description: ''
  });

  // Fetch all languages on mount
  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    setLoading(true);
    try {
      const res = await getLanguage();
      const data = Array.isArray(res.data.data) ? res.data.data : [];
      setLanguages(data);
      setFilteredLanguages(data);
    } catch (err) {
      console.error('Error fetching languages:', err);
      toast.error('Có lỗi khi tải danh sách ngôn ngữ');
    } finally {
      setLoading(false);
    }
  };

  // Filter languages by search term
  const applyFilter = (list, term) => {
    if (!term.trim()) {
      setFilteredLanguages(list);
    } else {
      const filtered = list.filter(
        (lang) =>
          (lang.language_name || '').toLowerCase().includes(term.toLowerCase()) ||
          (lang.language_code || '').toLowerCase().includes(term.toLowerCase())
      );
      setFilteredLanguages(filtered);
    }
  };

  // Search handler
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    applyFilter(languages, term);
    setPage(0);
  };

  // Pagination handlers
  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  // Open Add dialog
  const handleOpenAdd = () => {
    setFormData({ language_code: '', language_name: '', description: '' });
    setOpenAddDialog(true);
  };
  const handleCloseAdd = () => {
    setOpenAddDialog(false);
    setFormData({ language_code: '', language_name: '', description: '' });
  };

  // Open Edit dialog
  const handleOpenEdit = (lang) => {
    setEditingLanguage(lang);
    setFormData({
      language_code: lang.language_code || '',
      language_name: lang.language_name || '',
      description: lang.description || ''
    });
    setOpenEditDialog(true);
  };
  const handleCloseEdit = () => {
    setOpenEditDialog(false);
    setEditingLanguage(null);
    setFormData({ language_code: '', language_name: '', description: '' });
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit Add-Language
  const handleSubmitAdd = async () => {
    if (!formData.language_code.trim() || !formData.language_name.trim()) {
      toast.warning('Mã và tên ngôn ngữ không được để trống');
      return;
    }
    try {
      const res = await createLanguage(formData);
      const newLang = res.data;
      toast.success('Ngôn ngữ đã được tạo thành công!');
      handleCloseAdd();
      fetchLanguages();
    } catch (err) {
      console.error('Error creating language:', err);
      toast.error(err.response?.data?.message || 'Đã xảy ra lỗi khi tạo ngôn ngữ');
    }
  };

  // Submit Update-Language
  const handleSubmitEdit = async () => {
    if (!editingLanguage || !formData.language_code.trim() || !formData.language_name.trim()) {
      toast.warning('Mã và tên ngôn ngữ không được để trống');
      return;
    }
    try {
      const res = await updateLanguage(editingLanguage.language_id, formData);
      toast.success('Ngôn ngữ đã được cập nhật thành công!');
      handleCloseEdit();
      fetchLanguages();
    } catch (err) {
      console.error('Error updating language:', err);
      toast.error(err.response?.data?.message || 'Đã xảy ra lỗi khi cập nhật ngôn ngữ');
    }
  };

  // Delete language
  const handleDelete = async (lang) => {
    if (!window.confirm(`Bạn có chắc muốn xóa ngôn ngữ "${lang.language_name}" không?`)) return;
    try {
      await deleteLanguage(lang.language_id);
      toast.success('Ngôn ngữ đã được xóa thành công!');
      fetchLanguages();
    } catch (err) {
      console.error('Error deleting language:', err);
      toast.error(err.response?.data?.message || 'Đã xảy ra lỗi khi xóa ngôn ngữ');
    }
  };

  // Navigate to courses of a language
  const handleViewCourses = (language_id) => {
    // Replace with your routing logic, e.g.:
    // navigate(`/course/${language_id}`);
  };

  return (
    <Container sx={{ mt: 4 }}>
      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Add button */}
      <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleOpenAdd} sx={{ mb: 2 }}>
        Add New Language
      </Button>

      {/* Search bar */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={8}>
          <TextField variant="outlined" placeholder="Search Language" value={searchTerm} onChange={handleSearch} sx={{ width: '300px' }} />
        </Grid>
      </Grid>

      {/* Language table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>No.</b>
              </TableCell>
              <TableCell>
                <b>Flag</b>
              </TableCell>
              <TableCell>
                <b>Language Name</b>
              </TableCell>
              <TableCell>
                <b>Code</b>
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
            ) : filteredLanguages.length > 0 ? (
              filteredLanguages.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((lang, index) => (
                <TableRow key={lang.language_id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>
                    <ReactCountryFlag
                      countryCode={lang.language_code.toUpperCase()}
                      svg
                      style={{ width: '2em', height: '2em' }}
                      title={lang.language_name}
                    />
                  </TableCell>
                  <TableCell>{lang.language_name}</TableCell>
                  <TableCell>{lang.language_code}</TableCell>
                  <TableCell>
                    <Tooltip title="View Courses">
                      <IconButton onClick={() => handleViewCourses(lang.language_id)}>
                        <EyeOutlined />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleOpenEdit(lang)}>
                        <EditOutlined />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => handleDelete(lang)}>
                        <DeleteOutlined />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No languages found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredLanguages.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Add Language Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAdd} fullWidth maxWidth="sm">
        <DialogTitle>Add New Language</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Language Code"
                name="language_code"
                value={formData.language_code}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Language Name"
                name="language_name"
                value={formData.language_name}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmitAdd}>
            Add Language
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Language Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEdit} fullWidth maxWidth="sm">
        <DialogTitle>Update Language</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Language Code"
                name="language_code"
                value={formData.language_code}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Language Name"
                name="language_name"
                value={formData.language_name}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmitEdit}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
