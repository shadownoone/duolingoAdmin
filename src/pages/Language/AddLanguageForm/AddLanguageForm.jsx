import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Avatar,
  Autocomplete,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { createLanguage } from '@/service/languageService';
import { toast } from 'react-toastify';

export default function AddLanguageForm({ open, handleClose, onLanguageAdded }) {
  const [formData, setFormData] = useState({
    language_code: '',
    language_name: '',
    description: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const result = await createLanguage(formData);
      toast.success('Language created successfully!');
      onLanguageAdded(result.data);

      handleClose();
    } catch (error) {
      console.error('Error creating Language:', error);
      toast.error('Error creating Language!');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Language</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Language Code"
              name="language_code"
              value={formData.language_code}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Language Name"
              name="language_name"
              value={formData.language_name}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
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
          Add Language
        </Button>
      </DialogActions>
    </Dialog>
  );
}
