import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid } from '@mui/material';
import { toast } from 'react-toastify';
import { updateLanguage } from '@/service/languageService';

export default function UpdateLanguageForm({ open, language, handleClose, onLanguageUpdated }) {
  const [formData, setFormData] = useState({
    language_code: '',
    language_name: '',
    description: ''
  });

  // Khi dialog mở hoặc language thay đổi, set lại giá trị form
  useEffect(() => {
    if (language) {
      setFormData({
        language_code: language.language_code || '',
        language_name: language.language_name || '',
        description: language.description || ''
      });
    }
  }, [language]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const res = await updateLanguage(language.language_id, formData);
      toast.success('Language updated successfully!');
      // Gọi callback để parent cập nhật lại state
      onLanguageUpdated(res.data);
      handleClose();
    } catch (err) {
      console.error('Error updating language:', err);
      toast.error(err.response?.data?.message || 'Error updating language');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Update Language</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Language Code"
              name="language_code"
              value={formData.language_code}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Language Name"
              name="language_name"
              value={formData.language_name}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
