import React, { useEffect, useState } from 'react';
import { Box, Breadcrumbs, Link, Typography, Avatar, Button, Grid, Card, CardContent, Divider, TextField } from '@mui/material';
import { getCurrentUser, updateProfile, uploadSingleImage } from '@/service/userService';
import { toast } from 'react-toastify';
import assets from '@/assets/images/users/assets.gif'; // Ảnh loading

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [url, setUrl] = useState(''); // URL ảnh sau khi upload
  const [editMode, setEditMode] = useState(false); // Trạng thái chỉnh sửa
  const [isImageUploaded, setIsImageUploaded] = useState(false); // Trạng thái ảnh đã upload thành công
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    address: ''
  });

  // Chuyển file thành base64
  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (error) => reject(error);
    });
  };

  // Upload ảnh
  const uploadImage = async (event) => {
    const files = event.target.files;
    const base64 = await convertBase64(files[0]);

    try {
      setLoading(true); // Bắt đầu trạng thái loading
      const uploadedUrl = await uploadSingleImage(base64);
      setUrl(uploadedUrl); // Set URL của ảnh sau khi upload
      setIsImageUploaded(true); // Đánh dấu là ảnh đã được upload
      toast.success('Upload ảnh thành công');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image');
    } finally {
      setLoading(false); // Kết thúc trạng thái loading
    }
  };

  // Lấy dữ liệu người dùng
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser.data);
        setFormData({
          username: currentUser.data.username,
          email: currentUser.data.email,
          phone: currentUser.data.phone,
          address: currentUser.data.address
        });
        setUrl(currentUser.data.avatar); // Lấy avatar hiện tại của người dùng
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, []);

  // Xử lý thay đổi form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Lưu thông tin người dùng
  const handleSave = async () => {
    try {
      const updatedData = {
        ...formData,
        avatar: url || user.avatar // Lưu URL của ảnh đã upload
      };
      await updateProfile(updatedData); // Gửi yêu cầu cập nhật thông tin người dùng
      toast.success('Profile updated successfully');
      setUser((prevUser) => ({ ...prevUser, ...updatedData }));
      setEditMode(false); // Đặt về chế độ không chỉnh sửa sau khi lưu
    } catch (error) {
      toast.error('Error updating profile');
      console.error('Error updating profile:', error);
    }
  };

  // Lưu avatar sau khi upload
  const handleSaveAvatar = async () => {
    try {
      const updatedData = {
        avatar: url || user.avatar // Lưu URL của ảnh đã upload
      };
      await updateProfile(updatedData); // Gửi yêu cầu cập nhật chỉ ảnh avatar
      toast.success('Avatar updated successfully');
      setIsImageUploaded(false); // Đặt lại trạng thái sau khi save
    } catch (error) {
      toast.error('Error updating avatar');
      console.error('Error updating avatar:', error);
    }
  };

  // Hàm hiển thị trường thông tin người dùng
  const renderInfoField = (label, name, value, isEditable) => (
    <>
      <Grid item xs={4}>
        <Typography variant="body1" fontWeight="bold">
          {label}:
        </Typography>
      </Grid>
      <Grid item xs={8}>
        {isEditable ? (
          <TextField name={name} value={value} onChange={handleInputChange} fullWidth />
        ) : (
          <Typography variant="body1" color="textSecondary">
            {value}
          </Typography>
        )}
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
    </>
  );

  return (
    <Box sx={{ backgroundColor: '#eee', p: 5 }}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          {/* Breadcrumb */}
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" href="/">
              Home
            </Link>
            <Link underline="hover" color="inherit" href="/profile">
              Admin
            </Link>
            <Typography color="textPrimary">Admin Profile</Typography>
          </Breadcrumbs>
        </Grid>

        <Grid item xs={12} md={4}>
          {/* Profile Card */}
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              {/* Hiển thị ảnh loading hoặc avatar */}
              {loading ? (
                <img src={assets} alt="loading" style={{ width: 150, height: 150, marginBottom: '16px' }} />
              ) : (
                <Avatar
                  alt="Admin"
                  src={url || user?.avatar}
                  sx={{ width: 150, height: 150, mb: 2, margin: '0 auto', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)' }}
                />
              )}

              {/* Nút "Upload Avatar" hoặc "Save" */}
              {isImageUploaded ? (
                <Button variant="contained" onClick={handleSaveAvatar}>
                  Save
                </Button>
              ) : (
                <Button variant="contained" component="label">
                  Upload Avatar
                  <input type="file" hidden onChange={uploadImage} />
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          {/* User Information */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="body1" fontWeight="bold">
                INFORMATION
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                {/* Hiển thị các trường thông tin */}
                {renderInfoField('Username', 'username', formData.username, editMode)}
                {renderInfoField('Email', 'email', formData.email, editMode)}
                {renderInfoField('Phone', 'phone', formData.phone, editMode)}
                {renderInfoField('Address', 'address', formData.address, editMode)}
              </Grid>

              {/* Nút điều khiển */}
              <Box sx={{ mt: 2 }}>
                {editMode ? (
                  <>
                    <Button variant="contained" onClick={handleSave} sx={{ mr: 1 }}>
                      Save
                    </Button>
                    <Button variant="outlined" onClick={() => setEditMode(false)}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button variant="contained" onClick={() => setEditMode(true)}>
                    Edit
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
