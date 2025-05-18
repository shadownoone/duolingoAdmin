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
  Button,
  Typography,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { EyeOutlined, DeleteOutlined, PlusOutlined, EditOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { createExercise, deleteExercise, getExerciseByLesson, getExerciseType, updateExercise } from '@/service/exerciseService';

export default function Exercise() {
  const { lessonId } = useParams();

  const [exercises, setExercises] = useState([]);
  const [exerciseTypes, setExerciseTypes] = useState([]);
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

  const [questionContent, setQuestionContent] = useState('');
  const [answer, setAnswer] = useState('');
  const [hints, setHints] = useState('');
  const [options, setOptions] = useState([{ option_text: '', is_correct: false }]);

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const res = await getExerciseByLesson(lessonId);
      setExercises(res.data.exercises || []);
      console.log(res.data.exercises);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, [lessonId]);

  useEffect(() => {
    getExerciseType()
      .then((res) => setExerciseTypes(res.data?.data || []))
      .catch(() => setExerciseTypes([]));
  }, []);

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

  const handleDeleteExercise = async (exerciseId) => {
    if (!window.confirm('Are you sure you want to delete this exercise?')) return;

    try {
      await deleteExercise(exerciseId);

      setExercises((prev) => prev.filter((ex) => ex.exercise_id !== exerciseId));
    } catch (err) {
      console.error('Failed to delete exercise', err.response?.data || err);
    }
  };

  const handleAddExerciseOpen = () => {
    setOpenAddDialog(true);
  };

  const handleAddExerciseClose = () => {
    setOpenAddDialog(false);
    // reset form
    setExerciseType('');
    setQuestionContent('');
    setAnswer('');
    setHints('');
    setOptions([{ option_text: '', is_correct: false }]);
  };
  const handleEditExerciseOpen = (exercise) => {
    setExerciseIdToEdit(exercise.exercise_id);
    setExerciseType(exercise.exercise_type_id);
    setQuestionContent(exercise.question_content);
    setAnswer(exercise.answer);
    setHints(exercise.hints || '');
    setOptions(
      exercise.options.map((o) => ({
        option_text: o.option_text,
        is_correct: o.is_correct
      }))
    );
    setOpenEditDialog(true);
  };

  const handleEditExerciseClose = () => {
    setOpenEditDialog(false);
    setExerciseName('');
    setExerciseDescription('');
    setExerciseType('');
  };

  const handleAddExercise = async () => {
    try {
      const payload = {
        lesson_id: Number(lessonId),
        exercise_type_id: Number(exerciseType),
        question_content: questionContent,
        answer,
        hints,
        options
      };
      await createExercise(payload);
      await fetchExercises();
      handleAddExerciseClose();
    } catch (err) {
      console.error('Failed to create exercise', err);
    }
  };

  const handleUpdateExercise = async () => {
    try {
      const payload = {
        lesson_id: Number(lessonId),
        exercise_type_id: Number(exerciseType),
        question_content: questionContent,
        answer,
        hints,
        options
      };
      const res = await updateExercise(exerciseIdToEdit, payload);
      const updated = res.data;

      // Update ngay trong local state
      setExercises((prev) => prev.map((ex) => (ex.exercise_id === exerciseIdToEdit ? updated : ex)));
      handleEditExerciseClose();
    } catch (err) {
      console.error('Failed to update exercise', err.response?.data || err);
    }
  };

  const handleOptionChange = (idx, field, value) => {
    const newOpts = [...options];
    newOpts[idx][field] = value;
    setOptions(newOpts);
  };

  const handleAddOption = () => {
    setOptions((o) => [...o, { option_text: '', is_correct: false }]);
  };

  const handleRemoveOption = (idx) => {
    setOptions((o) => o.filter((_, i) => i !== idx));
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
                  <TableRow key={exercise.exercise_id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{exercise.question_content}</TableCell>
                    <TableCell>{exercise.exerciseType?.exercise_type_name || '-'}</TableCell>
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleEditExerciseOpen(exercise)}>
                          <EditOutlined />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton color="error" onClick={() => handleDeleteExercise(exercise.exercise_id)}>
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
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="select-type-label">Exercise Type</InputLabel>
                <Select
                  labelId="select-type-label"
                  value={exerciseType}
                  label="Exercise Type"
                  onChange={(e) => setExerciseType(e.target.value)}
                >
                  {exerciseTypes.map((type) => (
                    <MenuItem key={type.exercise_type_id} value={type.exercise_type_id}>
                      {type.exercise_type_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Question" value={questionContent} onChange={(e) => setQuestionContent(e.target.value)} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Answer" value={answer} onChange={(e) => setAnswer(e.target.value)} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Hints" value={hints} onChange={(e) => setHints(e.target.value)} />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1">Options</Typography>
            </Grid>
            {options.map((opt, idx) => (
              <React.Fragment key={idx}>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    label={`Option ${idx + 1}`}
                    value={opt.option_text}
                    onChange={(e) => handleOptionChange(idx, 'option_text', e.target.value)}
                  />
                </Grid>
                <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Checkbox checked={opt.is_correct} onChange={(e) => handleOptionChange(idx, 'is_correct', e.target.checked)} />
                  <Typography>Correct</Typography>
                </Grid>
                <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center' }}>
                  {options.length > 1 && (
                    <IconButton onClick={() => handleRemoveOption(idx)}>
                      <MinusCircleOutlined />
                    </IconButton>
                  )}
                </Grid>
              </React.Fragment>
            ))}

            <Grid item xs={12}>
              <Button startIcon={<PlusOutlined />} onClick={handleAddOption}>
                Add Option
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddExerciseClose}>Cancel</Button>
          <Button variant="contained" onClick={handleAddExercise}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Exercise Dialog */}
      <Dialog open={openEditDialog} onClose={handleEditExerciseClose} fullWidth maxWidth="md">
        <DialogTitle>Edit Exercise</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {/* Dropdown chọn Type */}
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="edit-type-label">Exercise Type</InputLabel>
                <Select
                  labelId="edit-type-label"
                  value={exerciseType}
                  label="Exercise Type"
                  onChange={(e) => setExerciseType(e.target.value)}
                >
                  {exerciseTypes.map((type) => (
                    <MenuItem key={type.exercise_type_id} value={type.exercise_type_id}>
                      {type.exercise_type_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {/* Question */}
            <Grid item xs={6}>
              <TextField fullWidth label="Question" value={questionContent} onChange={(e) => setQuestionContent(e.target.value)} />
            </Grid>
            {/* Answer */}
            <Grid item xs={6}>
              <TextField fullWidth label="Answer" value={answer} onChange={(e) => setAnswer(e.target.value)} />
            </Grid>
            {/* Hints */}
            <Grid item xs={6}>
              <TextField fullWidth label="Hints" value={hints} onChange={(e) => setHints(e.target.value)} />
            </Grid>
            {/* Options */}
            <Grid item xs={12}>
              <Typography variant="subtitle1">Options</Typography>
            </Grid>
            {options.map((opt, idx) => (
              <React.Fragment key={idx}>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    label={`Option ${idx + 1}`}
                    value={opt.option_text}
                    onChange={(e) => handleOptionChange(idx, 'option_text', e.target.value)}
                  />
                </Grid>
                <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Checkbox checked={opt.is_correct} onChange={(e) => handleOptionChange(idx, 'is_correct', e.target.checked)} />
                  <Typography>Correct</Typography>
                </Grid>
                <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center' }}>
                  {options.length > 1 && (
                    <IconButton onClick={() => handleRemoveOption(idx)}>
                      <MinusCircleOutlined />
                    </IconButton>
                  )}
                </Grid>
              </React.Fragment>
            ))}
            <Grid item xs={12}>
              <Button startIcon={<PlusOutlined />} onClick={handleAddOption}>
                Add Option
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditExerciseClose}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateExercise}>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
