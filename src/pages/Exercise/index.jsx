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
import { toast } from 'react-toastify'; // <-- import toast

import { createExercise, deleteExercise, getExerciseByLesson, getExerciseType, updateExercise } from '@/service/exerciseService';
import { useNavigate, useParams } from 'react-router-dom';

export default function Exercise() {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const [exercises, setExercises] = useState([]);
  const [exerciseTypes, setExerciseTypes] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  // Dialog states & form fields
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [exerciseType, setExerciseType] = useState('');
  const [questionContent, setQuestionContent] = useState('');
  const [answer, setAnswer] = useState('');
  const [hints, setHints] = useState('');
  const [options, setOptions] = useState([{ option_text: '', is_correct: false }]);
  const [existingMediaUrl, setExistingMediaUrl] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);
  const [exerciseIdToEdit, setExerciseIdToEdit] = useState(null);

  // Constants for type IDs
  const LISTENING_TYPE_ID = 5;
  const MATCHING_TYPE_ID = 2;

  // Fetch all exercises of this lesson
  const fetchExercises = async () => {
    setLoading(true);
    try {
      const res = await getExerciseByLesson(lessonId);
      const data = Array.isArray(res.data.exercises) ? res.data.exercises : [];
      setExercises(data);
      setFilteredExercises(data);
    } catch (err) {
      console.error('Error fetching exercises:', err);
      toast.error('Có lỗi khi tải danh sách bài tập');
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount / whenever lessonId changes
  useEffect(() => {
    fetchExercises();
  }, [lessonId]);

  // Fetch exercise types once
  useEffect(() => {
    getExerciseType()
      .then((res) => {
        const types = Array.isArray(res.data?.data) ? res.data.data : [];
        setExerciseTypes(types);
      })
      .catch((err) => {
        console.error('Error fetching exercise types:', err);
        setExerciseTypes([]);
        toast.error('Có lỗi khi tải danh sách loại bài tập');
      });
  }, []);

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Search handler
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredExercises(exercises);
    } else {
      const filtered = exercises.filter((ex) => ex.question_content.toLowerCase().includes(term));
      setFilteredExercises(filtered);
    }
    setPage(0);
  };

  // Navigation placeholder
  const handleView = (exerciseId) => {
    navigate(`/exercise/${exerciseId}`);
  };

  // Delete exercise
  const handleDeleteExercise = async (exerciseId) => {
    const exToDelete = exercises.find((ex) => ex.exercise_id === exerciseId);
    if (!exToDelete) return;

    if (!window.confirm(`Bạn có chắc muốn xóa bài tập "${exToDelete.question_content}" không?`)) return;

    try {
      await deleteExercise(exerciseId);
      const newList = exercises.filter((ex) => ex.exercise_id !== exerciseId);
      setExercises(newList);
      setFilteredExercises((prev) => prev.filter((ex) => ex.exercise_id !== exerciseId));
      toast.success('Xóa bài tập thành công');
    } catch (err) {
      console.error('Failed to delete exercise', err);
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Đã có lỗi khi xóa bài tập');
      }
    }
  };

  // Open/Close Add Dialog
  const handleAddExerciseOpen = () => {
    setExerciseType('');
    setQuestionContent('');
    setAnswer('');
    setHints('');
    setOptions([{ option_text: '', is_correct: false }]);
    setExistingMediaUrl(null);
    setMediaFile(null);
    setOpenAddDialog(true);
  };

  const handleAddExerciseClose = () => {
    setOpenAddDialog(false);
    setExerciseType('');
    setQuestionContent('');
    setAnswer('');
    setHints('');
    setOptions([{ option_text: '', is_correct: false }]);
    setExistingMediaUrl(null);
    setMediaFile(null);
  };

  // Open/Close Edit Dialog
  const handleEditExerciseOpen = (exercise) => {
    setExerciseIdToEdit(exercise.exercise_id);
    setExerciseType(exercise.exercise_type_id);
    setQuestionContent(exercise.question_content || '');
    setAnswer(exercise.answer || '');
    setHints(exercise.hints || '');
    if (+exercise.exercise_type_id === MATCHING_TYPE_ID) {
      setOptions(
        exercise.options.map((o) => {
          const [left = '', right = ''] = (o.option_text || '').split('|');
          return { left, right };
        })
      );
    } else {
      setOptions(
        exercise.options.map((o) => ({
          option_text: o.option_text,
          is_correct: o.is_correct
        }))
      );
    }
    setExistingMediaUrl(exercise.audio_url || null);
    setMediaFile(null);
    setOpenEditDialog(true);
  };

  const handleEditExerciseClose = () => {
    setOpenEditDialog(false);
    setExerciseType('');
    setQuestionContent('');
    setAnswer('');
    setHints('');
    setOptions([{ option_text: '', is_correct: false }]);
    setExistingMediaUrl(null);
    setMediaFile(null);
    setExerciseIdToEdit(null);
  };

  // Add new exercise
  const handleAddExercise = async () => {
    // Validate
    if (!exerciseType || !questionContent.trim() || !answer.trim()) {
      toast.warning('Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }

    try {
      const form = new FormData();
      form.append('lesson_id', lessonId);
      form.append('exercise_type_id', exerciseType);
      form.append('question_content', questionContent);
      form.append('answer', answer);
      form.append('hints', hints);
      // Build options JSON
      const optsPayload = options.map((opt) =>
        +exerciseType === MATCHING_TYPE_ID
          ? { option_text: `${opt.left}|${opt.right}` }
          : { option_text: opt.option_text, is_correct: opt.is_correct }
      );
      form.append('options', JSON.stringify(optsPayload));
      if (mediaFile) form.append('media', mediaFile);

      const res = await createExercise(form);
      const created = res.data;
      const newList = [...exercises, created];
      setExercises(newList);
      setFilteredExercises(newList);

      toast.success('Tạo bài tập thành công');
      handleAddExerciseClose();
    } catch (err) {
      console.error('Error creating exercise:', err);
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Đã có lỗi khi tạo bài tập');
      }
    }
  };

  // Update existing exercise
  const handleUpdateExercise = async () => {
    if (!exerciseType || !questionContent.trim() || !answer.trim()) {
      toast.warning('Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }

    try {
      const form = new FormData();
      form.append('lesson_id', lessonId);
      form.append('exercise_type_id', exerciseType);
      form.append('question_content', questionContent);
      form.append('answer', answer);
      form.append('hints', hints);
      let optsPayload = options;
      if (+exerciseType === MATCHING_TYPE_ID) {
        optsPayload = options.map((o) => ({
          option_text: `${o.left || ''}|${o.right || ''}`
        }));
      }
      form.append('options', JSON.stringify(optsPayload));
      if (mediaFile) form.append('media', mediaFile);

      const res = await updateExercise(exerciseIdToEdit, form);
      const updated = res.data;
      const newList = exercises.map((ex) => (ex.exercise_id === exerciseIdToEdit ? updated : ex));
      setExercises(newList);
      setFilteredExercises(newList);

      toast.success('Cập nhật bài tập thành công');
      handleEditExerciseClose();
    } catch (err) {
      console.error('Failed to update exercise', err);
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Đã có lỗi khi cập nhật bài tập');
      }
    }
  };

  // Handle dynamic option changes
  const handleOptionChange = (idx, field, value) => {
    const newOpts = [...options];
    newOpts[idx][field] = value;
    setOptions(newOpts);
  };

  const handleAddOption = () => {
    if (+exerciseType === MATCHING_TYPE_ID) {
      setOptions((prev) => [...prev, { left: '', right: '' }]);
    } else {
      setOptions((prev) => [...prev, { option_text: '', is_correct: false }]);
    }
  };

  const handleRemoveOption = (idx) => {
    setOptions((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleAddExerciseOpen} sx={{ mb: 2 }}>
        Add New Exercise
      </Button>

      {/* Search bar */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={8}>
          <TextField variant="outlined" placeholder="Search Exercise" value={searchTerm} onChange={handleSearch} sx={{ width: '300px' }} />
        </Grid>
      </Grid>

      {/* Table of exercises */}
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
                <TableCell colSpan={4} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredExercises.length > 0 ? (
              filteredExercises.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((ex, idx) => (
                <TableRow key={ex.exercise_id}>
                  <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                  <TableCell>{ex.question_content}</TableCell>
                  <TableCell>{ex.exerciseType?.exercise_type_name || '-'}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleEditExerciseOpen(ex)}>
                        <EditOutlined />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => handleDeleteExercise(ex.exercise_id)}>
                        <DeleteOutlined />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No exercises found
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
        count={filteredExercises.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Add Exercise Dialog */}
      <Dialog open={openAddDialog} onClose={handleAddExerciseClose} fullWidth maxWidth="md">
        <DialogTitle>Add New Exercise</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {/* Type */}
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select value={exerciseType} label="Type" onChange={(e) => setExerciseType(e.target.value)}>
                  {exerciseTypes.map((t) => (
                    <MenuItem key={t.exercise_type_id} value={t.exercise_type_id}>
                      {t.exercise_type_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Question / Answer / Hints */}
            <Grid item xs={6}>
              <TextField fullWidth label="Question" value={questionContent} onChange={(e) => setQuestionContent(e.target.value)} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Answer" value={answer} onChange={(e) => setAnswer(e.target.value)} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Hints" value={hints} onChange={(e) => setHints(e.target.value)} />
            </Grid>

            {/* Listening upload */}
            {+exerciseType === LISTENING_TYPE_ID && (
              <Grid item xs={12}>
                <Button component="label" fullWidth>
                  {mediaFile?.name || 'Upload Audio/Video'}
                  <input type="file" accept="audio/*,video/*" hidden onChange={(e) => setMediaFile(e.target.files[0])} />
                </Button>
              </Grid>
            )}

            {/* Options Header */}
            <Grid item xs={12}>
              <Typography>Options</Typography>
            </Grid>

            {/* Dynamic Options */}
            {options.map((opt, idx) => (
              <React.Fragment key={idx}>
                {+exerciseType === MATCHING_TYPE_ID ? (
                  <>
                    <Grid item xs={5}>
                      <TextField
                        fullWidth
                        label={`Left ${idx + 1}`}
                        value={opt.left}
                        onChange={(e) => handleOptionChange(idx, 'left', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        fullWidth
                        label={`Right ${idx + 1}`}
                        value={opt.right}
                        onChange={(e) => handleOptionChange(idx, 'right', e.target.value)}
                      />
                    </Grid>
                  </>
                ) : (
                  <>
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
                  </>
                )}
                <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center' }}>
                  {options.length > 1 && (
                    <IconButton onClick={() => handleRemoveOption(idx)}>
                      <MinusCircleOutlined />
                    </IconButton>
                  )}
                </Grid>
              </React.Fragment>
            ))}

            {/* Add another option */}
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
            {/* Type */}
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

            {/* Question / Answer / Hints */}
            <Grid item xs={6}>
              <TextField fullWidth label="Question" value={questionContent} onChange={(e) => setQuestionContent(e.target.value)} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Answer" value={answer} onChange={(e) => setAnswer(e.target.value)} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Hints" value={hints} onChange={(e) => setHints(e.target.value)} />
            </Grid>

            {/* Listening upload */}
            {+exerciseType === LISTENING_TYPE_ID && (
              <>
                {existingMediaUrl && !mediaFile && (
                  <Grid item xs={12}>
                    <audio controls style={{ width: '100%' }} src={existingMediaUrl} />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Button variant="outlined" component="label" fullWidth>
                    {mediaFile?.name || 'Upload New Audio/Video'}
                    <input type="file" accept="audio/*,video/*" hidden onChange={(e) => setMediaFile(e.target.files[0])} />
                  </Button>
                </Grid>
              </>
            )}

            {/* Options Header */}
            <Grid item xs={12}>
              <Typography variant="subtitle1">Options</Typography>
            </Grid>

            {/* Dynamic Options */}
            {options.map((opt, idx) => (
              <React.Fragment key={idx}>
                {+exerciseType === MATCHING_TYPE_ID ? (
                  <>
                    <Grid item xs={5}>
                      <TextField
                        fullWidth
                        label={`Left ${idx + 1}`}
                        value={opt.left}
                        onChange={(e) => handleOptionChange(idx, 'left', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        fullWidth
                        label={`Right ${idx + 1}`}
                        value={opt.right}
                        onChange={(e) => handleOptionChange(idx, 'right', e.target.value)}
                      />
                    </Grid>
                  </>
                ) : (
                  <>
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
                  </>
                )}
                <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center' }}>
                  {options.length > 1 && (
                    <IconButton onClick={() => handleRemoveOption(idx)}>
                      <MinusCircleOutlined />
                    </IconButton>
                  )}
                </Grid>
              </React.Fragment>
            ))}

            {/* Add another option */}
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
    </Container>
  );
}
