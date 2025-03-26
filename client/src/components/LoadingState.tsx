import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Loading...' }) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px'
      }}
    >
      <CircularProgress />
      <Typography sx={{ mt: 2 }} variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingState; 