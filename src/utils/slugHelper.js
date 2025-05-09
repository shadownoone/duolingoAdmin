// src/utils/slugHelper.js

export const generateSlug = (title) => {
  return title
    .toLowerCase() // Chuyển tất cả ký tự thành chữ thường
    .replace(/[^\w\s-]/g, '') // Loại bỏ tất cả ký tự đặc biệt
    .trim() // Loại bỏ khoảng trắng ở đầu và cuối
    .replace(/\s+/g, '-') // Thay thế khoảng trắng bằng dấu gạch ngang
    .replace(/-+/g, '-'); // Thay thế nhiều dấu gạch ngang bằng một dấu gạch ngang
};
