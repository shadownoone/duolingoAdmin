import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Avatar } from '@mui/material';
import ImageUploader from '../ImageUploader/ImageUploader';

export default function ChapterFormDialog({
  open,
  handleClose,
  handleSave,
  currentChapter,
  newChapterTitle,
  setNewChapterTitle,
  newChapterNumber,
  setNewChapterNumber,
  newChapterImages,
  setNewChapterImages,
  loading
}) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{currentChapter ? 'Edit Chapter' : 'Add Chapter'}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Chapter Title"
          value={newChapterTitle}
          onChange={(e) => setNewChapterTitle(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Chapter Number"
          value={newChapterNumber}
          onChange={(e) => setNewChapterNumber(e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Component ImageUploader */}
        <ImageUploader loading={loading} newChapterImages={newChapterImages} setNewChapterImages={setNewChapterImages} />

        {/* Hiển thị ảnh đã upload */}
        {newChapterImages.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '10px' }}>
            {newChapterImages.map((url, index) => (
              <Avatar key={index} src={url} alt={`Uploaded ${index}`} sx={{ width: 100, height: 100, marginRight: 1 }} />
            ))}
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          {currentChapter ? 'Save Changes' : 'Add Chapter'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
