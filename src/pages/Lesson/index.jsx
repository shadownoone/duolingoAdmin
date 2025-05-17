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
import { deleteLesson, getLessonByCourse, updateLesson } from '@/service/lessonService';
import { useNavigate, useParams } from 'react-router-dom';
import { createLesson } from '@/service/lessonService'; // Dịch vụ để gọi API tạo bài học

export default function Lesson() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  // Thêm trạng thái cho dialog
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [lessonName, setLessonName] = useState('');
  const [lessonDescription, setLessonDescription] = useState('');
  const [lessonType, setLessonType] = useState('book'); // Đặt mặc định là "book"

  const [lessonIdToEdit, setLessonIdToEdit] = useState(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await getLessonByCourse(courseId);
        setLessons(res.data.Lessons || []);
      } catch (err) {
        console.error('Error fetching lessons:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, [courseId]);

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

    const filteredLessons = lessons.filter((lesson) => lesson.lesson_title.toLowerCase().includes(term));

    setLessons(filteredLessons);
  };

  const handleView = (lesson_id) => {
    console.log('lesson_id', lesson_id);
    navigate(`/exercise/${lesson_id}`);
  };

  const handleDeleteLesson = async (lessonId) => {
    try {
      await deleteLesson(lessonId);
      setLessons(lessons.filter((lesson) => lesson.lesson_id !== lessonId));
    } catch (error) {
      console.error('Error deleting lesson:', error);
    }
  };

  // Mở Dialog để thêm bài học
  const handleAddLessonOpen = () => {
    setOpenAddDialog(true);
  };

  // Đóng Dialog
  const handleAddLessonClose = () => {
    setOpenAddDialog(false);
    setLessonName('');
    setLessonDescription('');
    setLessonType('book'); // Reset type khi đóng
  };

  const handleEditLessonOpen = (lesson) => {
    setLessonIdToEdit(lesson.lesson_id); // Lưu ID bài học cần sửa
    setLessonName(lesson.lesson_title); // Set giá trị ban đầu vào các trường
    setLessonDescription(lesson.description);
    setLessonType(lesson.type); // Đặt type nếu cần
    setOpenEditDialog(true); // Mở dialog
  };

  const handleEditLessonClose = () => {
    setOpenEditDialog(false);
    setLessonName('');
    setLessonDescription('');
    setLessonType('book');
  };

  const handleUpdateLesson = async () => {
    // Kiểm tra các trường cần thiết
    if (!lessonName || !lessonDescription || !lessonType) {
      console.error('Missing required fields');
      return;
    }

    const updatedLesson = {
      lesson_title: lessonName,
      content: lessonDescription,
      type: lessonType,
      lesson_order: lessons.length + 1, // Hoặc tính toán lại nếu cần
      course_id: parseInt(courseId) // Đảm bảo ID khóa học hợp lệ
    };

    try {
      // Gọi API để cập nhật bài học
      const res = await updateLesson(lessonIdToEdit, updatedLesson);
      // Cập nhật state với dữ liệu mới
      setLessons((prevLessons) => prevLessons.map((lesson) => (lesson.lesson_id === lessonIdToEdit ? res.data : lesson)));
      handleEditLessonClose(); // Đóng dialog sau khi cập nhật
    } catch (error) {
      console.error('Error updating lesson:', error);
    }
  };

  const handleAddLesson = async () => {
    // Kiểm tra xem các trường cần thiết đã được nhập đầy đủ chưa
    if (!lessonName || !lessonDescription || !lessonType) {
      console.error('Missing required fields');
      return; // Không gửi yêu cầu nếu thiếu trường bắt buộc
    }

    // Tạo đối tượng bài học mới
    const newLesson = {
      lesson_title: lessonName, // Thay lesson_name thành lesson_title
      content: lessonDescription,
      type: lessonType,
      lesson_order: lessons.length + 1, // Tạo lesson_order tự động
      course_id: parseInt(courseId) // Đảm bảo rằng courseId là số nguyên
    };

    console.log('newLesson', newLesson); // In ra để kiểm tra cấu trúc của đối tượng

    try {
      // Gọi API tạo bài học
      const res = await createLesson(newLesson);
      setLessons((prevLessons) => [...prevLessons, res.data]);
      handleAddLessonClose();
    } catch (error) {
      console.error('Error creating lesson:', error);
    }
  };

  return (
    <div>
      <Container sx={{ mt: 4 }}>
        <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleAddLessonOpen} sx={{ mb: 2 }}>
          Add New Course
        </Button>

        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={8}>
            <TextField variant="outlined" placeholder="Search Lesson" value={searchTerm} onChange={handleSearch} sx={{ width: '300px' }} />
          </Grid>
        </Grid>

        {/* Table for displaying lessons */}
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
              ) : lessons.length > 0 ? (
                lessons.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((lesson, index) => (
                  <TableRow key={lesson.lesson_id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{lesson.lesson_title}</TableCell>
                    <TableCell>
                      <Tooltip title="View">
                        <IconButton onClick={() => handleView(lesson.lesson_id)}>
                          <EyeOutlined fontSize="small" />
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

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={lessons.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Container>

      {/* Dialog for adding new lesson */}
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
    </div>
  );
}
