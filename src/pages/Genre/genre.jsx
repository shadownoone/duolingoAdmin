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
  TablePagination
} from '@mui/material';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getGenre, addGenre, updateGenre, deleteGenre } from '@/service/genreService/genre';

export default function GenreManager() {
  const [listGenres, setListGenres] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [genreName, setGenreName] = useState(''); // State for the genre name input
  const [page, setPage] = useState(0); // Current page state
  const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page

  // Open dialog for adding/editing genre
  const handleOpen = (genre) => {
    setSelectedGenre(genre);
    setGenreName(genre?.name || ''); // Set the input with the existing genre name or empty for new genre
    setOpen(true);
  };

  // Close dialog
  const handleClose = () => {
    setOpen(false);
    setSelectedGenre(null);
    setGenreName(''); // Clear the input when dialog is closed
  };

  // Add or edit genre
  const handleSaveGenre = async () => {
    try {
      if (selectedGenre) {
        // Update existing genre
        const response = await updateGenre(selectedGenre.genre_id, genreName);
        if (response && response.data) {
          // Update the list with the updated genre
          setListGenres((prevList) => prevList.map((genre) => (genre.genre_id === selectedGenre.genre_id ? response.data : genre)));
        }
      } else {
        // Add new genre
        const response = await addGenre(genreName);
        if (response && response.data) {
          // Append the new genre to the list
          setListGenres((prevList) => [...prevList, response.data]);
        }
      }
      handleClose(); // Close the dialog after saving
    } catch (error) {
      console.error('Error saving genre:', error);
    }
  };

  // Delete genre
  const handleDeleteGenre = async (genreId) => {
    try {
      await deleteGenre(genreId); // Call the delete API
      setListGenres((prevList) => prevList.filter((genre) => genre.genre_id !== genreId)); // Update state
    } catch (error) {
      console.error('Error deleting genre:', error);
    }
  };

  // Fetch genres on component mount
  useEffect(() => {
    const fetchGenre = async () => {
      const data = await getGenre();
      setListGenres(data.data.data);
    };
    fetchGenre();
  }, []);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <Container sx={{ mt: 4 }}>
        <Button variant="contained" startIcon={<PlusOutlined />} onClick={() => handleOpen(null)} sx={{ mb: 2 }}>
          Add New Genre
        </Button>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>No.</b>
                </TableCell>
                <TableCell>
                  <b>Genre Name</b>
                </TableCell>
                <TableCell>
                  <b>Actions</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listGenres.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((genre, index) => (
                <TableRow key={genre.genre_id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{genre.name}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleOpen(genre)}>
                        <EditOutlined />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => handleDeleteGenre(genre.genre_id)}>
                        <DeleteOutlined />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={listGenres.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        {/* Dialog for adding/editing genre */}
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
          <DialogTitle>{selectedGenre ? 'Edit Genre' : 'Add New Genre'}</DialogTitle>
          <DialogContent>
            <TextField fullWidth label="Genre Name" value={genreName} onChange={(e) => setGenreName(e.target.value)} variant="outlined" />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" onClick={handleSaveGenre}>
              {selectedGenre ? 'Save Changes' : 'Add Genre'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
}
