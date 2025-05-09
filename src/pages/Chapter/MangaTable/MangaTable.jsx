import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  TablePagination,
  Tooltip,
  IconButton
} from '@mui/material';
import { BookOutlined } from '@ant-design/icons';
import { formatDate } from '@/utils/formatNumber';

export default function MangaTable({ filteredManga, page, rowsPerPage, handleChangePage, handleChangeRowsPerPage, handleViewChapters }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ width: '10%' }}>
              <b>No.</b>
            </TableCell>
            <TableCell style={{ width: '15%' }}>
              <b>Image</b>
            </TableCell>
            <TableCell style={{ width: '35%' }}>
              <b>Title</b>
            </TableCell>
            <TableCell style={{ width: '20%' }}>
              <b>Updated</b>
            </TableCell>
            <TableCell style={{ width: '20%' }}>
              <b>Actions</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredManga.length > 0 ? (
            filteredManga.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((manga, index) => (
              <TableRow key={manga.manga_id}>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell>
                  <Avatar alt={manga.title} src={manga.cover_image} sx={{ width: 80, height: 80, borderRadius: '0' }} />
                </TableCell>
                <TableCell>{manga.title}</TableCell>
                <TableCell>{formatDate(manga.updatedAt)}</TableCell>
                <TableCell>
                  <Tooltip title="Chapters">
                    <IconButton onClick={() => handleViewChapters(manga.slug)}>
                      <BookOutlined />
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
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredManga.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
}
