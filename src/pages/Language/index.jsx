import React, { useState } from 'react';
import { Button, Container } from '@mui/material';
import { PlusOutlined } from '@ant-design/icons';
import LanguageList from './LanguageList/languageList';
import AddLanguageForm from './AddLanguageForm/AddLanguageForm';

export default function MangaAdmin() {
  const [open, setOpen] = useState(false); // Trạng thái mở form
  // eslint-disable-next-line no-unused-vars
  const [listManga, setListManga] = useState([]); // Danh sách Manga

  // Xử lý khi form được mở
  const handleOpen = () => {
    setOpen(true);
  };

  // Xử lý khi form đóng
  const handleClose = () => {
    setOpen(false);
  };

  // Xử lý khi thêm Manga mới
  const handleLanguageAdded = (newLang) => {
    setListManga((prevList) => [...prevList, newLang]);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleOpen} sx={{ mb: 2 }}>
        Add New Language
      </Button>

      {/* Hiển thị danh sách Manga */}
      <LanguageList />

      {/* Form thêm Manga */}
      <AddLanguageForm open={open} handleClose={handleClose} onLanguageAdded={handleLanguageAdded} />
    </Container>
  );
}
