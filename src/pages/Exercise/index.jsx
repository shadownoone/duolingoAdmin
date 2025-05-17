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
import { useNavigate, useParams } from 'react-router-dom';
import { getExerciseByLesson } from '@/service/exerciseService';

export default function Exercise() {
  const navigate = useNavigate();
  const { lessonId } = useParams();

  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  // Dialog states
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseDescription, setExerciseDescription] = useState('');
  const [exerciseType, setExerciseType] = useState('');
  const [exerciseIdToEdit, setExerciseIdToEdit] = useState(null);

  useEffect(() => {
    const fetchExe = async () => {
      try {
        const res = await getExerciseByLesson(lessonId);
        setExercises(res.data.exercises || []);
        console.log(res.data.exercises);
      } catch (err) {
        console.error('Error fetching lessons:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExe();
    setLoading(false);
  }, [lessonId]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    // Filter exercises here if needed
    // Example: setExercises(originalList.filter(e => e.name.toLowerCase().includes(term)));
  };

  const handleView = (exerciseId) => {
    // TODO: navigate to exercise detail page
    // navigate(`/exercise/${exerciseId}`);
  };

  const handleDeleteExercise = (exerciseId) => {
    // TODO: call delete API and update state
    // deleteExercise(exerciseId).then(() => setExercises(prev => prev.filter(e => e.id !== exerciseId)));
  };

  const handleAddExerciseOpen = () => {
    setOpenAddDialog(true);
  };

  const handleAddExerciseClose = () => {
    setOpenAddDialog(false);
    setExerciseName('');
    setExerciseDescription('');
    setExerciseType('');
  };

  const handleEditExerciseOpen = (exercise) => {
    setExerciseIdToEdit(exercise.id);
    setExerciseName(exercise.name);
    setExerciseDescription(exercise.description);
    setExerciseType(exercise.type);
    setOpenEditDialog(true);
  };

  const handleEditExerciseClose = () => {
    setOpenEditDialog(false);
    setExerciseName('');
    setExerciseDescription('');
    setExerciseType('');
  };

  const handleAddExercise = () => {
    if (!exerciseName || !exerciseDescription || !exerciseType) return;
    const newExercise = { name: exerciseName, description: exerciseDescription, type: exerciseType, courseId };
    // TODO: call createExercise API
    // createExercise(newExercise).then(res => setExercises(prev => [...prev, res.data]));
    handleAddExerciseClose();
  };

  const handleUpdateExercise = () => {
    if (!exerciseName || !exerciseDescription || !exerciseType) return;
    const updated = { name: exerciseName, description: exerciseDescription, type: exerciseType };
    // TODO: call update API
    // updateExercise(exerciseIdToEdit, updated).then(res => {
    //   setExercises(prev => prev.map(e => (e.id === exerciseIdToEdit ? res.data : e)));
    // });
    handleEditExerciseClose();
  };

  return (
    <div>
      <Container sx={{ mt: 4 }}>
        <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleAddExerciseOpen} sx={{ mb: 2 }}>
          Add New Exercise
        </Button>

        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={8}>
            <TextField
              variant="outlined"
              placeholder="Search Exercise"
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
                  <b>Exercise Name</b>
                </TableCell>
                <TableCell>
                  <b>Exercise Type</b>
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
              ) : exercises.length > 0 ? (
                exercises.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((exercise, index) => (
                  <TableRow key={exercise.id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{exercise.question_content}</TableCell>
                    <TableCell>{exercise.exerciseType?.exercise_type_name || '-'}</TableCell>
                    <TableCell>
                      <Tooltip title="View">
                        <IconButton onClick={() => handleView(exercise.id)}>
                          <EyeOutlined />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleEditExerciseOpen(exercise)}>
                          <EditOutlined />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton color="error" onClick={() => handleDeleteExercise(exercise.id)}>
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
          count={exercises.length}
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
          <TextField
            fullWidth
            label="Exercise Name"
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            value={exerciseDescription}
            onChange={(e) => setExerciseDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField fullWidth label="Type" value={exerciseType} onChange={(e) => setExerciseType(e.target.value)} sx={{ mb: 2 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddExerciseClose}>Cancel</Button>
          <Button variant="contained" onClick={handleAddExercise}>
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
            value={exerciseName}
            onChange={(e) => setExerciseName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            value={exerciseDescription}
            onChange={(e) => setExerciseDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField fullWidth label="Type" value={exerciseType} onChange={(e) => setExerciseType(e.target.value)} sx={{ mb: 2 }} />
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
