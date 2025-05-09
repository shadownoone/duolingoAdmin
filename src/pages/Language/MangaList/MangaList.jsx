import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Avatar,
  IconButton,
  TablePagination,
  TextField,
  Grid
} from '@mui/material';
import { BookOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { getLanguage, deleteLanguage, updateLanguage } from '@/service/languageService';

import ReactCountryFlag from 'react-country-flag';
import UpdateLanguageForm from '../UpdateLanguageForm/UpdateLanguageForm';

export default function MangaList() {
  const [listLanguage, setListLanguage] = useState([]);
  const [filteredManga, setFilteredManga] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editingLang, setEditingLang] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);

  useEffect(() => {
    const fetchManga = async () => {
      const data = await getLanguage();
      setListLanguage(data.data.data);
      console.log('🚀 ~ fetchManga ~ data.data.data:', data.data.data);

      setFilteredManga(data.data.data);
    };
    fetchManga();
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = listLanguage.filter(
      (language) => language.language_name.toLowerCase().includes(term) || language.language_code.toLowerCase().includes(term)
    );
    setFilteredManga(filtered);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (lang) => {
    setEditingLang(lang);
    setOpenEdit(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedManga(null);
  };

  const handleSaveChanges = async (updatedLanguage) => {
    try {
      const response = await updateLanguage(updatedLanguage.language_id, updatedLanguage);
      const updatedData = response.data?.data || response.data;

      if (!updatedData || !updatedData.language_id) {
        console.error('Dữ liệu cập nhật không hợp lệ:', updatedData);
        return;
      }

      alert('Manga updated successfully!');

      const updatedListManga = listLanguage.map((language) => (language.language_id === updatedData.language_id ? updatedData : language));

      setListLanguage(updatedListManga);
      setFilteredManga(updatedListManga);
      setSelectedManga(updatedData);
      handleClose();
    } catch (error) {
      console.error('Error updating manga:', error);
    }
  };

  const handleDelete = async (language_id) => {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa manga này không?');
    if (confirmDelete) {
      try {
        await deleteLanguage(language_id);
        alert('Language đã được xóa thành công!');

        const updatedListManga = listLanguage.filter((language) => language.language_id !== language_id);
        setListLanguage(updatedListManga);
        setFilteredManga(updatedListManga);
      } catch (error) {
        console.error('Lỗi khi xóa manga:', error);
        alert('Đã xảy ra lỗi khi xóa manga.');
      }
    }
  };

  return (
    <div>
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={8}>
          <TextField variant="outlined" placeholder="Search Language" value={searchTerm} onChange={handleSearch} sx={{ width: '300px' }} />
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: '10%' }}>
                <b>No.</b>
              </TableCell>
              <TableCell style={{ width: '15%' }}>
                <b>Flag</b>
              </TableCell>
              <TableCell style={{ width: '35%' }}>
                <b>Language</b>
              </TableCell>

              <TableCell style={{ width: '20%' }}>
                <b>Actions</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredManga.length > 0 ? (
              filteredManga.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((language, index) => (
                <TableRow key={language.language_id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>
                    <ReactCountryFlag
                      countryCode={language.language_code.toUpperCase()}
                      svg
                      style={{
                        width: '5em',
                        height: '5em',
                        lineHeight: '5em'
                      }}
                      title={language.language_name}
                    />
                  </TableCell>
                  <TableCell>{language.language_name}</TableCell>

                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleEdit(language)}>
                        <EditOutlined />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => handleDelete(language.language_id)}>
                        <DeleteOutlined />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredManga.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <UpdateLanguageForm
        open={openEdit}
        language={editingLang}
        handleClose={() => setOpenEdit(false)}
        onLanguageUpdated={(updated) => {
          // cập nhật lại state listLanguage & filteredManga
          setListLanguage((prev) => prev.map((l) => (l.language_id === updated.language_id ? updated : l)));
          setFilteredManga((prev) => prev.map((l) => (l.language_id === updated.language_id ? updated : l)));
          setOpenEdit(false);
        }}
      />
    </div>
  );
}
