import React, { useState, useEffect } from 'react';
import { TextField, Grid } from '@mui/material';

import { getManga, getMangaBySlug } from '@/service/languageService';

import { createChapter } from '@/service/chapterService/chapter';
import { toast } from 'react-toastify';

import MangaTable from './MangaTable/MangaTable';
import { Container } from '@mui/system';
import ChapterDialog from './ChapterDialog/ChapterDialog';
import ChapterFormDialog from './ChapterFormDialog/ChapterFormDialog';

export default function Chapter() {
  const [listManga, setListManga] = useState([]);
  const [filteredManga, setFilteredManga] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedManga, setSelectedManga] = useState(null);
  const [open, setOpen] = useState(false); // Dialog state for chapter list
  const [openChapterDialog, setOpenChapterDialog] = useState(false); // Dialog state for add/edit chapter
  const [currentChapter, setCurrentChapter] = useState(null); // For editing a chapter
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterNumber, setNewChapterNumber] = useState('');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [newChapterImage, setNewChapterImage] = useState('');

  // State for chapter pagination and search
  const [chapterPage, setChapterPage] = useState(0);
  const [chaptersPerPage, setChaptersPerPage] = useState(5);
  const [chapterSearchTerm, setChapterSearchTerm] = useState(''); // State for chapter search term
  const [filteredChapters, setFilteredChapters] = useState([]); // State for filtered chapters

  useEffect(() => {
    const fetchManga = async () => {
      const data = await getManga();
      setListManga(data.data.data);
      setFilteredManga(data.data.data);
    };
    fetchManga();
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = listManga.filter((manga) => manga.title.toLowerCase().includes(term));
    setFilteredManga(filtered);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewChapters = async (slug) => {
    const data = await getMangaBySlug(slug);
    setSelectedManga(data.data); // Contains chapters as well
    setFilteredChapters(data.data.chapters); // Initialize filtered chapters with all chapters
    setOpen(true); // Open the dialog to view chapters
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedManga(null);
  };

  const handleAddChapter = () => {
    setCurrentChapter(null); // Clear previous chapter data for adding a new one
    setNewChapterTitle('');
    setNewChapterNumber('');
    setOpenChapterDialog(true);
  };

  const handleEditChapter = (chapter) => {
    setCurrentChapter(chapter);
    setNewChapterTitle(chapter.title);
    setNewChapterNumber(chapter.chapter_number);
    setOpenChapterDialog(true);
  };

  const handleDeleteChapter = async (chapterId) => {
    await deleteChapter(chapterId); // Call delete API
    const updatedChapters = selectedManga.chapters.filter((ch) => ch.chapter_id !== chapterId);
    setSelectedManga({ ...selectedManga, chapters: updatedChapters });
    setFilteredChapters(updatedChapters); // Update filtered chapters
  };

  const handleSaveChapter = async () => {
    try {
      if (!newChapterTitle || !newChapterNumber || newChapterImage.length === 0) {
        toast.error('Please provide all required fields (title, number, and images)');
        return;
      }

      // Nếu là chapter mới
      if (currentChapter) {
        // Chỉnh sửa chapter hiện tại
        const updatedChapter = await updateChapter(currentChapter.chapter_id, {
          title: newChapterTitle,
          chapter_number: newChapterNumber,
          image_urls: newChapterImage // Gửi mảng các URL ảnh
        });

        // Cập nhật danh sách chapter
        const updatedChapters = selectedManga.chapters.map((ch) => (ch.chapter_id === updatedChapter.chapter_id ? updatedChapter : ch));

        setSelectedManga((prevManga) => ({
          ...prevManga,
          chapters: updatedChapters
        }));
        setFilteredChapters(updatedChapters);
      } else {
        // Thêm chapter mới
        const newChapterResponse = await createChapter(selectedManga.manga_id, newChapterNumber, newChapterTitle, newChapterImage); // Gửi mảng ảnh

        const newChapterData = newChapterResponse.data;

        setSelectedManga((prevManga) => ({
          ...prevManga,
          chapters: [...prevManga.chapters, newChapterData].sort((a, b) => a.chapter_number - b.chapter_number)
        }));
        setFilteredChapters((prevChapters) => [...prevChapters, newChapterData]);
      }

      setOpenChapterDialog(false);
      alert('Chapter saved successfully!');
    } catch (error) {
      console.error('Error saving chapter:', error);
      toast.error('Error saving chapter');
    }
  };

  const handleCloseChapterDialog = () => {
    setOpenChapterDialog(false);
  };

  // Handle chapter pagination changes
  const handleChapterPageChange = (event, newPage) => {
    setChapterPage(newPage);
  };

  const handleChaptersPerPageChange = (event) => {
    setChaptersPerPage(parseInt(event.target.value, 10));
    setChapterPage(0);
  };

  // Handle chapter search
  const handleChapterSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setChapterSearchTerm(term);
    const filtered = selectedManga.chapters.filter((chapter) => chapter.title.toLowerCase().includes(term));
    setFilteredChapters(filtered);
    setChapterPage(0); // Reset to first page after search
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={8}>
          <TextField variant="outlined" placeholder="Search Manga" value={searchTerm} onChange={handleSearch} sx={{ width: '300px' }} />
        </Grid>
      </Grid>
      {/* Table Manga */}
      <MangaTable
        filteredManga={filteredManga}
        page={page}
        rowsPerPage={rowsPerPage}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        handleViewChapters={handleViewChapters}
      />

      {/* Dialog to display list of chapters */}
      <ChapterDialog
        open={open}
        selectedManga={selectedManga}
        filteredChapters={filteredChapters}
        chapterPage={chapterPage}
        chaptersPerPage={chaptersPerPage}
        handleChapterSearch={handleChapterSearch}
        handleChapterPageChange={handleChapterPageChange}
        handleChaptersPerPageChange={handleChaptersPerPageChange}
        handleEditChapter={handleEditChapter}
        handleDeleteChapter={handleDeleteChapter}
        handleAddChapter={handleAddChapter}
        handleClose={handleClose}
        chapterSearchTerm={chapterSearchTerm}
      />

      {/* Dialog for adding/editing a chapter */}
      <ChapterFormDialog
        open={openChapterDialog}
        handleClose={handleCloseChapterDialog}
        handleSave={handleSaveChapter}
        currentChapter={currentChapter}
        newChapterTitle={newChapterTitle}
        setNewChapterTitle={setNewChapterTitle}
        newChapterNumber={newChapterNumber}
        setNewChapterNumber={setNewChapterNumber}
        newChapterImages={newChapterImage}
        setNewChapterImages={setNewChapterImage}
        loading={loading}
      />
    </Container>
  );
}
