import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Tooltip,
  IconButton,
  Button,
  TextField
} from '@mui/material';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { formatDate } from '@/utils/formatNumber';

export default function ChapterDialog({
  open,
  selectedManga,
  filteredChapters,
  chapterPage,
  chaptersPerPage,
  handleChapterSearch,
  handleChapterPageChange,
  handleChaptersPerPageChange,
  handleEditChapter,
  handleDeleteChapter,
  handleAddChapter,
  handleClose,
  chapterSearchTerm
}) {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Chapter List for {selectedManga?.title}</DialogTitle>
      <DialogContent>
        <TextField placeholder="Search Chapter" value={chapterSearchTerm} onChange={handleChapterSearch} fullWidth sx={{ mb: 2 }} />
        <Button startIcon={<PlusOutlined />} onClick={handleAddChapter} sx={{ mb: 2 }}>
          Add Chapter
        </Button>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Chapter Title</TableCell>
              <TableCell>Updated</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredChapters
              .slice(chapterPage * chaptersPerPage, chapterPage * chaptersPerPage + chaptersPerPage)
              .map((chapter, index) => (
                <TableRow key={chapter.chapter_id}>
                  <TableCell>{chapterPage * chaptersPerPage + index + 1}</TableCell>
                  <TableCell>{chapter.title}</TableCell>
                  <TableCell>{formatDate(chapter.createdAt)}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleEditChapter(chapter)}>
                        <EditOutlined />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="error" onClick={() => handleDeleteChapter(chapter.chapter_id)}>
                        <DeleteOutlined />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          count={filteredChapters.length}
          rowsPerPage={chaptersPerPage}
          page={chapterPage}
          onPageChange={handleChapterPageChange}
          onRowsPerPageChange={handleChaptersPerPageChange}
        />
      </DialogContent>
    </Dialog>
  );
}
