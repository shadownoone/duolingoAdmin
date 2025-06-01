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
import { toast } from 'react-toastify'; // <-- import toast

import { getLessonByCourse, createLesson, deleteLesson, updateLesson } from '@/service/lessonService';
import { useNavigate, useParams } from 'react-router-dom';

export default function Lesson() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  // Trạng thái dialog và form
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [lessonName, setLessonName] = useState('');
  const [lessonDescription, setLessonDescription] = useState('');
  const [lessonType, setLessonType] = useState('book'); // mặc định "book"
  const [lessonIdToEdit, setLessonIdToEdit] = useState(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        const res = await getLessonByCourse(courseId);
        // Giả sử API trả về res.data.Lessons = [...]
        const data = Array.isArray(res.data.Lessons) ? res.data.Lessons : [];
        setLessons(data);
        setFilteredLessons(data);
      } catch (err) {
        console.error('Error fetching lessons:', err);
        toast.error('Có lỗi khi tải danh sách bài học');
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, [courseId]);

  // Phân trang
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Search
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredLessons(lessons);
    } else {
      const filtered = lessons.filter((lesson) => lesson.lesson_title.toLowerCase().includes(term));
      setFilteredLessons(filtered);
    }
    setPage(0);
  };

  // Điều hướng đến trang Exercise cho lesson
  const handleView = (lesson_id) => {
    navigate(`/exercise/${lesson_id}`);
  };

  // Xóa bài học
  const handleDeleteLesson = async (lessonId) => {
    const lessonToDelete = lessons.find((l) => l.lesson_id === lessonId);
    if (!lessonToDelete) return;

    if (!window.confirm(`Bạn có chắc muốn xóa bài học "${lessonToDelete.lesson_title}" không?`)) {
      return;
    }

    try {
      await deleteLesson(lessonId);
      // Giảm state lessons và filteredLessons
      const newList = lessons.filter((l) => l.lesson_id !== lessonId);
      setLessons(newList);
      setFilteredLessons((prev) => prev.filter((l) => l.lesson_id !== lessonId));

      toast.success('Xóa bài học thành công');
    } catch (error) {
      console.error('Error deleting lesson:', error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Đã có lỗi khi xóa bài học');
      }
    }
  };

  // Mở/Đóng dialog thêm bài học
  const handleAddLessonOpen = () => {
    setLessonName('');
    setLessonDescription('');
    setLessonType('book');
    setOpenAddDialog(true);
  };
  const handleAddLessonClose = () => {
    setOpenAddDialog(false);
    setLessonName('');
    setLessonDescription('');
    setLessonType('book');
  };

  // Mở/Đóng dialog chỉnh sửa bài học
  const handleEditLessonOpen = (lesson) => {
    setLessonIdToEdit(lesson.lesson_id);
    setLessonName(lesson.lesson_title);
    setLessonDescription(lesson.content); // Giả sử API field là `content`
    setLessonType(lesson.type);
    setOpenEditDialog(true);
  };
  const handleEditLessonClose = () => {
    setOpenEditDialog(false);
    setLessonIdToEdit(null);
    setLessonName('');
    setLessonDescription('');
    setLessonType('book');
  };

  // Thêm bài học mới
  const handleAddLesson = async () => {
    if (!lessonName.trim() || !lessonDescription.trim() || !lessonType.trim()) {
      toast.warning('Các trường bắt buộc không được để trống');
      return;
    }

    const newLesson = {
      lesson_title: lessonName,
      content: lessonDescription,
      type: lessonType,
      lesson_order: lessons.length + 1,
      course_id: parseInt(courseId, 10)
    };

    try {
      const res = await createLesson(newLesson);
      // Giả sử API trả về res.data = đối tượng lesson vừa tạo
      setLessons((prev) => [...prev, res.data]);
      setFilteredLessons((prev) => [...prev, res.data]);

      toast.success('Thêm bài học thành công');
      handleAddLessonClose();
    } catch (error) {
      console.error('Error creating lesson:', error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Đã có lỗi khi tạo bài học');
      }
    }
  };

  // Cập nhật bài học
  const handleUpdateLesson = async () => {
    if (!lessonName.trim() || !lessonDescription.trim() || !lessonType.trim()) {
      toast.warning('Các trường bắt buộc không được để trống');
      return;
    }

    const updatedLesson = {
      lesson_title: lessonName,
      content: lessonDescription,
      type: lessonType,
      lesson_order: lessons.length + 1,
      course_id: parseInt(courseId, 10)
    };

    try {
      const res = await updateLesson(lessonIdToEdit, updatedLesson);
      // Giả sử API trả về res.data = đối tượng lesson đã cập nhật
      const updated = res.data;
      setLessons((prev) => prev.map((l) => (l.lesson_id === lessonIdToEdit ? updated : l)));
      setFilteredLessons((prev) => prev.map((l) => (l.lesson_id === lessonIdToEdit ? updated : l)));

      toast.success('Cập nhật bài học thành công');
      handleEditLessonClose();
    } catch (error) {
      console.error('Error updating lesson:', error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Đã có lỗi khi cập nhật bài học');
      }
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleAddLessonOpen} sx={{ mb: 2 }}>
        Add New Lesson
      </Button>

      {/* Search bar */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={8}>
          <TextField variant="outlined" placeholder="Search Lesson" value={searchTerm} onChange={handleSearch} sx={{ width: '300px' }} />
        </Grid>
      </Grid>

      {/* Bảng danh sách bài học */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>No.</b>
              </TableCell>
              <TableCell>
                <b>Lesson Name</b>
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
            ) : filteredLessons.length > 0 ? (
              filteredLessons.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((lesson, index) => (
                <TableRow key={lesson.lesson_id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{lesson.lesson_title}</TableCell>
                  <TableCell>
                    <Tooltip title="View">
                      <IconButton onClick={() => handleView(lesson.lesson_id)}>
                        <EyeOutlined />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleEditLessonOpen(lesson)}>
                        <EditOutlined />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => handleDeleteLesson(lesson.lesson_id)}>
                        <DeleteOutlined />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No lessons found
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
        count={filteredLessons.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Dialog Thêm bài học */}
      <Dialog open={openAddDialog} onClose={handleAddLessonClose} fullWidth maxWidth="md">
        <DialogTitle>Add New Lesson</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Lesson Name"
            value={lessonName}
            onChange={(e) => setLessonName(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Lesson Description"
            value={lessonDescription}
            onChange={(e) => setLessonDescription(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Lesson Type"
            value={lessonType}
            onChange={(e) => setLessonType(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddLessonClose}>Cancel</Button>
          <Button variant="contained" onClick={handleAddLesson}>
            Add Lesson
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Chỉnh sửa bài học */}
      <Dialog open={openEditDialog} onClose={handleEditLessonClose} fullWidth maxWidth="md">
        <DialogTitle>Edit Lesson</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Lesson Name"
            value={lessonName}
            onChange={(e) => setLessonName(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Lesson Description"
            value={lessonDescription}
            onChange={(e) => setLessonDescription(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Lesson Type"
            value={lessonType}
            onChange={(e) => setLessonType(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditLessonClose}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateLesson}>
            Update Lesson
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
