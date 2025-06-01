import React, { useState, useEffect } from 'react';
import {
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
  Tooltip,
  TablePagination,
  Grid
} from '@mui/material';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify'; // <-- import toast

import { getCourseByLanguage } from '@/service/languageService';
import { useNavigate, useParams } from 'react-router-dom';
import { addCourse, deleteCourse, updateCourse } from '@/service/courseService';

export default function Course() {
  const navigate = useNavigate();
  const { languageId } = useParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Dialog & Form state
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [courseIdToEdit, setCourseIdToEdit] = useState(null);

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);

  // Lấy danh sách khóa học theo ngôn ngữ
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await getCourseByLanguage(languageId);
        const data = Array.isArray(res.data.courses) ? res.data.courses : [];
        setCourses(data);
        setFilteredCourses(data);
      } catch (err) {
        console.error('Error fetching courses:', err);
        toast.error('Có lỗi khi tải danh sách khóa học');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [languageId]);

  // Phân trang
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Mở/Đóng dialog thêm khóa học
  const handleAddCourseOpen = () => {
    setCourseName('');
    setCourseDescription('');
    setOpenAddDialog(true);
  };
  const handleAddCourseClose = () => {
    setOpenAddDialog(false);
    setCourseName('');
    setCourseDescription('');
  };

  // Mở/Đóng dialog sửa khóa học
  const handleEditCourseOpen = (course) => {
    setCourseIdToEdit(course.course_id);
    setCourseName(course.course_name);
    setCourseDescription(course.description);
    setOpenEditDialog(true);
  };
  const handleEditCourseClose = () => {
    setOpenEditDialog(false);
    setCourseIdToEdit(null);
    setCourseName('');
    setCourseDescription('');
  };

  // Xử lý thay đổi input
  const handleCourseNameChange = (event) => {
    setCourseName(event.target.value);
  };
  const handleCourseDescriptionChange = (event) => {
    setCourseDescription(event.target.value);
  };

  // Thêm khóa học mới
  const handleAddCourse = async () => {
    if (!courseName.trim()) {
      toast.warning('Tên khóa học không được để trống');
      return;
    }
    const courseData = {
      course_name: courseName,
      description: courseDescription,
      language_id: parseInt(languageId, 10)
    };
    try {
      const res = await addCourse(courseData);
      // Giả sử API trả về { course_id, course_name, description, ... }
      setCourses((prev) => [...prev, res.data]);
      setFilteredCourses((prev) => [...prev, res.data]);
      toast.success('Khóa học được tạo thành công');
      handleAddCourseClose();
    } catch (error) {
      console.error('Error adding course:', error);
      // Nếu backend trả về lỗi (ví dụ 400/500) kèm message
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Đã có lỗi khi tạo khóa học');
      }
    }
  };

  // Cập nhật khóa học
  const handleUpdateCourse = async () => {
    if (!courseName.trim()) {
      toast.warning('Tên khóa học không được để trống');
      return;
    }
    const updatedData = {
      course_name: courseName,
      description: courseDescription
    };
    try {
      const res = await updateCourse(courseIdToEdit, updatedData);
      // Backend trả về đối tượng course đã cập nhật ở res.data
      const updatedCourse = res.data;
      const newList = courses.map((c) => (c.course_id === updatedCourse.course_id ? updatedCourse : c));
      setCourses(newList);
      // Cập nhật list filtered (nếu có search)
      const newFiltered = filteredCourses.map((c) => (c.course_id === updatedCourse.course_id ? updatedCourse : c));
      setFilteredCourses(newFiltered);

      toast.success('Cập nhật khóa học thành công');
      handleEditCourseClose();
    } catch (error) {
      console.error('Error updating course:', error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Đã có lỗi khi cập nhật khóa học');
      }
    }
  };

  // Xóa khóa học
  const handleDeleteCourse = async (courseId) => {
    const courseToDelete = courses.find((c) => c.course_id === courseId);
    if (!courseToDelete) return;
    if (!window.confirm(`Bạn có chắc muốn xóa khóa học "${courseToDelete.course_name}" không?`)) {
      return;
    }
    try {
      await deleteCourse(courseId);
      const newList = courses.filter((c) => c.course_id !== courseId);
      setCourses(newList);
      const newFiltered = filteredCourses.filter((c) => c.course_id !== courseId);
      setFilteredCourses(newFiltered);
      toast.success('Xóa khóa học thành công');
    } catch (error) {
      console.error('Error deleting course:', error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Đã có lỗi khi xóa khóa học');
      }
    }
  };

  // Search khóa học theo tên
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter((course) => course.course_name.toLowerCase().includes(term));
      setFilteredCourses(filtered);
    }
    setPage(0);
  };

  // Điều hướng đến danh sách bài học
  const handleView = (course_id) => {
    navigate(`/lesson/${course_id}`);
  };

  return (
    <Container sx={{ mt: 4 }}>
      {/* Button thêm mới */}
      <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleAddCourseOpen} sx={{ mb: 2 }}>
        Add New Course
      </Button>

      {/* Search Bar */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={8}>
          <TextField variant="outlined" placeholder="Search Course" value={searchTerm} onChange={handleSearch} sx={{ width: '300px' }} />
        </Grid>
      </Grid>

      {/* Bảng danh sách khóa học */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>No.</b>
              </TableCell>
              <TableCell>
                <b>Course Name</b>
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
            ) : filteredCourses.length > 0 ? (
              filteredCourses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((course, index) => (
                <TableRow key={course.course_id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{course.course_name}</TableCell>
                  <TableCell>
                    <Tooltip title="View Lessons">
                      <IconButton onClick={() => handleView(course.course_id)}>
                        <EyeOutlined />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleEditCourseOpen(course)}>
                        <EditOutlined />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => handleDeleteCourse(course.course_id)}>
                        <DeleteOutlined />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No courses found
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
        count={filteredCourses.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Dialog Thêm Khóa học */}
      <Dialog open={openAddDialog} onClose={handleAddCourseClose} fullWidth maxWidth="md">
        <DialogTitle>Add New Course</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Course Name" value={courseName} onChange={handleCourseNameChange} variant="outlined" sx={{ mb: 2 }} />
          <TextField
            fullWidth
            label="Course Description"
            value={courseDescription}
            onChange={handleCourseDescriptionChange}
            variant="outlined"
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddCourseClose}>Cancel</Button>
          <Button variant="contained" onClick={handleAddCourse}>
            Add Course
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Chỉnh sửa Khóa học */}
      <Dialog open={openEditDialog} onClose={handleEditCourseClose} fullWidth maxWidth="md">
        <DialogTitle>Edit Course</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Course Name"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Course Description"
            value={courseDescription}
            onChange={(e) => setCourseDescription(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditCourseClose}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateCourse}>
            Update Course
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
