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
import { DeleteOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify'; // <-- import toast

import { getExerciseType, addExerciseType, updateExerciseType, deleteExerciseType } from '@/service/exerciseService';

export default function ExerciseType() {
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  // Dialog states & form field
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [exerciseTypeName, setExerciseTypeName] = useState('');
  const [exerciseIdToEdit, setExerciseIdToEdit] = useState(null);

  // Fetch all exercise types
  const fetchExerciseTypes = async () => {
    setLoading(true);
    try {
      const res = await getExerciseType();
      const data = Array.isArray(res.data.data) ? res.data.data : [];
      setExercises(data);
      applyFilter(data, searchTerm);
    } catch (err) {
      console.error('Error fetching exercise types:', err);
      toast.error('Có lỗi khi tải danh sách loại bài tập');
    } finally {
      setLoading(false);
    }
  };

  // Apply filter on the original data
  const applyFilter = (data, term) => {
    if (!term.trim()) {
      setFilteredExercises(data);
    } else {
      const filtered = data.filter(
        (exercise) => exercise.exercise_type_name && exercise.exercise_type_name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredExercises(filtered);
    }
  };

  useEffect(() => {
    fetchExerciseTypes();
  }, []);

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Add Dialog open/close
  const handleAddExerciseOpen = () => {
    setExerciseTypeName('');
    setOpenAddDialog(true);
  };
  const handleAddExerciseClose = () => {
    setOpenAddDialog(false);
    setExerciseTypeName('');
  };

  // Edit Dialog open/close
  const handleEditExerciseOpen = (exercise) => {
    setExerciseIdToEdit(exercise.exercise_type_id);
    setExerciseTypeName(exercise.exercise_type_name);
    setOpenEditDialog(true);
  };
  const handleEditExerciseClose = () => {
    setOpenEditDialog(false);
    setExerciseTypeName('');
    setExerciseIdToEdit(null);
  };

  // Search handler
  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    applyFilter(exercises, term);
  };

  // Add new exercise type
  const handleAddExerciseType = async () => {
    if (!exerciseTypeName.trim()) {
      toast.warning('Tên loại bài tập không được để trống');
      return;
    }
    try {
      const newExercise = { exercise_type_name: exerciseTypeName };
      const res = await addExerciseType(newExercise);
      const addedExercise = res.data.data;
      toast.success('Thêm loại bài tập thành công');
      handleAddExerciseClose();
      fetchExerciseTypes();
    } catch (error) {
      console.error('Error adding exercise type:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Đã có lỗi khi thêm loại bài tập');
      }
    }
  };

  // Update existing exercise type
  const handleUpdateExercise = async () => {
    if (!exerciseTypeName.trim() || !exerciseIdToEdit) {
      toast.warning('Vui lòng điền tên loại bài tập');
      return;
    }
    try {
      const updated = { exercise_type_name: exerciseTypeName };
      await updateExerciseType(exerciseIdToEdit, updated);
      toast.success('Cập nhật loại bài tập thành công');
      handleEditExerciseClose();
      fetchExerciseTypes();
    } catch (error) {
      console.error('Error updating exercise type:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Đã có lỗi khi cập nhật loại bài tập');
      }
    }
  };

  // Delete exercise type
  const handleDeleteExercise = async (exercise) => {
    const exerciseId = exercise.exercise_type_id;
    if (!exerciseId) {
      toast.error('ID loại bài tập không hợp lệ');
      return;
    }
    if (!window.confirm(`Bạn có chắc muốn xóa "${exercise.exercise_type_name}" không?`)) {
      return;
    }
    try {
      await deleteExerciseType(exerciseId);
      toast.success('Xóa loại bài tập thành công');
      fetchExerciseTypes();
    } catch (error) {
      console.error('Error deleting exercise type:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Đã có lỗi khi xóa loại bài tập');
      }
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleAddExerciseOpen} sx={{ mb: 2 }}>
        Add New Exercise Type
      </Button>

      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={8}>
          <TextField
            variant="outlined"
            placeholder="Search Exercise Type"
            value={searchTerm}
            onChange={handleSearch}
            sx={{ width: '300px' }}
          />
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
                <b>Exercise Type Name</b>
              </TableCell>
              <TableCell>
                <b>Actions</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredExercises.length > 0 ? (
              filteredExercises.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((exercise, index) => (
                <TableRow key={exercise.exercise_type_id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{exercise.exercise_type_name}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleEditExerciseOpen(exercise)}>
                        <EditOutlined />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => handleDeleteExercise(exercise)}>
                        <DeleteOutlined />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No exercise types found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredExercises.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Add Exercise Type Dialog */}
      <Dialog open={openAddDialog} onClose={handleAddExerciseClose} fullWidth maxWidth="sm">
        <DialogTitle>Add New Exercise Type</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Exercise Type Name"
            value={exerciseTypeName}
            onChange={(e) => setExerciseTypeName(e.target.value)}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddExerciseClose}>Cancel</Button>
          <Button variant="contained" onClick={handleAddExerciseType}>
            Add Exercise Type
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Exercise Type Dialog */}
      <Dialog open={openEditDialog} onClose={handleEditExerciseClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit Exercise Type</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Exercise Type Name"
            value={exerciseTypeName}
            onChange={(e) => setExerciseTypeName(e.target.value)}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditExerciseClose}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateExercise}>
            Update Exercise Type
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
