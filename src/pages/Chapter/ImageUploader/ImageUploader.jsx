import React from 'react';
import { Button, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import { uploadMultipleImages } from '@/service/languageService';

export default function ImageUploader({ loading, newChapterImages, setNewChapterImages }) {
  const handleImageUpload = async (event) => {
    if (event.target.files.length === 0) {
      toast.error('No file selected');
      return;
    }

    const files = event.target.files;
    const base64Images = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => base64Images.push(reader.result);
        await new Promise((resolve) => (reader.onloadend = resolve));
      }

      const uploadedUrls = await uploadMultipleImages(base64Images);
      setNewChapterImages((prevImages) => [...prevImages, ...uploadedUrls]);
      toast.success('Images uploaded successfully');
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Error uploading images');
    }
  };

  return (
    <Button variant="contained" component="label" disabled={loading}>
      {loading ? <CircularProgress size={24} /> : 'Upload Chapter Images'}
      <input type="file" multiple hidden onChange={handleImageUpload} />
    </Button>
  );
}
