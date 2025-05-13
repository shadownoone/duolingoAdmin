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
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [courseIdToEdit, setCourseIdToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await getCourseByLanguage(languageId);

        setCourses(res.data.courses);
      } catch (err) {
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [languageId]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to page 0 when rows per page changes
  };

  // Handle Add New Course dialog open
  const handleAddCourseOpen = () => {
    setOpenAddDialog(true);
  };

  // Handle Add New Course dialog close
  const handleAddCourseClose = () => {
    setOpenAddDialog(false);
    setCourseName('');
    setCourseDescription('');
    setCourseCode('');
  };

  const handleEditCourseOpen = (course) => {
    setCourseIdToEdit(course.course_id);
    setCourseName(course.course_name);
    setCourseDescription(course.description);
    setOpenEditDialog(true);
  };

  const handleEditCourseClose = () => {
    setOpenEditDialog(false);
    setCourseName('');
    setCourseDescription('');
  };

  const handleCourseNameChange = (event) => {
    setCourseName(event.target.value);
  };

  const handleCourseDescriptionChange = (event) => {
    setCourseDescription(event.target.value);
  };

  const handleAddCourse = async () => {
    const courseData = {
      course_name: courseName,
      description: courseDescription,
      language_id: parseInt(languageId)
    };

    try {
      const res = await addCourse(courseData);
      setCourses((prevCourses) => [...prevCourses, res.data]);
      handleAddCourseClose();
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const handleUpdateCourse = async () => {
    const updatedData = {
      course_name: courseName,
      description: courseDescription
    };

    try {
      const res = await updateCourse(courseIdToEdit, updatedData);
      const updatedCourses = courses.filter((course) => course.course_id !== res.data.course_id);
      updatedCourses.push(res.data);
      setCourses(updatedCourses);

      handleEditCourseClose();
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await deleteCourse(courseId);
      setCourses(courses.filter((course) => course.course_id !== courseId));
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const filteredCourses = courses.filter((course) => {
      return course.course_name.toLowerCase().includes(term);
    });

    setCourses(filteredCourses);
  };

  const handleView = async (course_id) => {
    console.log('course_id', course_id);

    navigate(`/lesson/${course_id}`);
  };

  return (
    <div>
      <Container sx={{ mt: 4 }}>
        <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleAddCourseOpen} sx={{ mb: 2 }}>
          Add New Course
        </Button>

        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={8}>
            <TextField variant="outlined" placeholder="Search Course" value={searchTerm} onChange={handleSearch} sx={{ width: '300px' }} />
          </Grid>
        </Grid>

        {/* Table for displaying courses */}
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
              ) : courses.length > 0 ? (
                courses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((course, index) => (
                  <TableRow key={course.course_id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{course.course_name}</TableCell>
                    <TableCell>
                      <Tooltip title="View">
                        <IconButton onClick={() => handleView(course.course_id)}>
                          <EyeOutlined fontSize="small" />
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

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={courses.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Container>

      {/* Dialog for adding new course */}
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
    </div>
  );
}
