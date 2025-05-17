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
import { getExerciseType, addExerciseType, updateExerciseType, deleteExerciseType } from '@/service/exerciseService';

export default function ExerciseType() {
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  // Dialog states
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [exerciseTypeName, setExerciseTypeName] = useState('');

  const [exerciseIdToEdit, setExerciseIdToEdit] = useState(null);

  const fetchExerciseTypes = async () => {
    try {
      setLoading(true);
      const res = await getExerciseType();
      const data = res.data.data || [];
      console.log('Fetched exercise types:', data);
      setExercises(data); // Lưu dữ liệu gốc
      applyFilter(data, searchTerm); // Áp dụng bộ lọc hiện tại
    } catch (err) {
      console.error('Error fetching exercise types:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = (data, term) => {
    if (!term.trim()) {
      // Nếu không có từ khóa tìm kiếm, hiển thị tất cả
      setFilteredExercises(data);
    } else {
      // Nếu có từ khóa, lọc theo tên
      const filtered = data.filter(
        (exercise) => exercise.exercise_type_name && exercise.exercise_type_name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredExercises(filtered);
    }
  };

  useEffect(() => {
    fetchExerciseTypes();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddExerciseOpen = () => {
    setOpenAddDialog(true);
  };

  const handleAddExerciseClose = () => {
    setOpenAddDialog(false);
    setExerciseTypeName('');
  };

  const handleEditExerciseOpen = (exercise) => {
    setExerciseIdToEdit(exercise.exercise_type_id);
    setExerciseTypeName(exercise.exercise_type_name);
    setOpenEditDialog(true);
  };

  const handleEditExerciseClose = () => {
    setOpenEditDialog(false);
    setExerciseTypeName('');
  };

  const handleTypeNameChange = (event) => {
    setExerciseTypeName(event.target.value);
  };

  const handleAddExerciseType = async () => {
    if (!exerciseTypeName) return;

    const newExercise = { exercise_type_name: exerciseTypeName };

    try {
      const res = await addExerciseType(newExercise);
      const addedExercise = res.data.data;
      setExerciseTypeName((prev) => [...prev, addedExercise]);

      handleAddExerciseClose();
      fetchExerciseTypes();
    } catch (error) {
      console.error('Error adding exercise type:', error);
    }
  };

  const handleUpdateExercise = async () => {
    if (!exerciseTypeName || !exerciseIdToEdit) return;

    try {
      const updated = { exercise_type_name: exerciseTypeName };
      await updateExerciseType(exerciseIdToEdit, updated);

      handleEditExerciseClose();
      fetchExerciseTypes();
    } catch (error) {
      console.error('Error updating exercise type:', error);
    }
  };

  const handleDeleteExercise = async (exercise) => {
    try {
      const exerciseId = exercise.exercise_type_id;

      if (!exerciseId) {
        console.error('Exercise ID is undefined');
        return;
      }

      await deleteExerciseType(exerciseId);
      fetchExerciseTypes();
    } catch (error) {
      console.error('Error deleting exercise type:', error);
    }
  };

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    applyFilter(exercises, term); // Áp dụng bộ lọc trên dữ liệu gốc
  };

  return (
    <div>
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
                  <b>Exercise Type Name </b>
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
                  <TableRow key={exercise.id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{exercise?.exercise_type_name}</TableCell>

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
                    No exercises found
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
      </Container>

      {/* Add Exercise Dialog */}
      <Dialog open={openAddDialog} onClose={handleAddExerciseClose} fullWidth maxWidth="md">
        <DialogTitle>Add New Exercise</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Exercise Name" value={exerciseTypeName} onChange={handleTypeNameChange} sx={{ mb: 2 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddExerciseClose}>Cancel</Button>
          <Button variant="contained" onClick={handleAddExerciseType}>
            Add Exercise
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Exercise Dialog */}
      <Dialog open={openEditDialog} onClose={handleEditExerciseClose} fullWidth maxWidth="md">
        <DialogTitle>Edit Exercise</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Exercise Name"
            value={exerciseTypeName}
            onChange={(e) => setExerciseTypeName(e.target.value)}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditExerciseClose}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateExercise}>
            Update Exercise
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
