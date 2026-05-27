import React from 'react';
import { Box } from '@mui/material';

/** Shared max-width + horizontal padding for student portal pages */
export const STUDENT_CONTENT_MAX_WIDTH = 1600;
export const STUDENT_CONTENT_PX = { xs: 2, md: 4 };

export const studentHeaderInnerSx = {
  maxWidth: STUDENT_CONTENT_MAX_WIDTH,
  mx: 'auto',
  width: '100%',
  px: STUDENT_CONTENT_PX,
  pt: 4,
  pb: 3,
};

export const studentContentWrapperSx = {
  maxWidth: STUDENT_CONTENT_MAX_WIDTH,
  mx: 'auto',
  width: '100%',
  px: STUDENT_CONTENT_PX,
};

/**
 * Full-bleed white page header (edge-to-edge in main area) + padded content below.
 */
const StudentPageLayout = ({ header, children, headerInnerSx = {} }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', pb: 8 }}>
    <Box
      component="header"
      sx={{
        width: '100%',
        bgcolor: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
        mb: 3,
        flexShrink: 0,
      }}
    >
      <Box sx={{ ...studentHeaderInnerSx, ...headerInnerSx }}>{header}</Box>
    </Box>
    <Box component="section" sx={studentContentWrapperSx}>
      {children}
    </Box>
  </Box>
);

export default StudentPageLayout;
