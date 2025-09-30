import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  
  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      width: '100%',
      maxWidth: '100%',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <CssBaseline />
      <Header />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: { xs: 1, sm: 2, md: 3 },
          width: { xs: '100%', sm: 'calc(100% - 240px)' },
          maxWidth: { xs: '100%', sm: 'calc(100% - 240px)' },
          overflow: 'auto',
          minHeight: '100vh',
          maxHeight: '100vh',
          position: 'relative',
          boxSizing: 'border-box',
          paddingTop: { xs: '64px', sm: '72px' },
          marginLeft: { xs: 0, sm: '240px' }
        }}
      >
        <Box sx={{ 
          width: '100%',
          maxWidth: '100%',
          overflow: 'auto',
          boxSizing: 'border-box',
          padding: { xs: '12px', sm: '16px', md: '24px' },
          '& .MuiGrid-container': {
            width: '100%',
            maxWidth: '100%',
            margin: 0,
            '& .MuiGrid-item': {
              paddingLeft: { xs: '4px', sm: '8px' },
              paddingTop: { xs: '4px', sm: '8px' },
              maxWidth: '100%',
              flexBasis: { xs: '100%', sm: 'auto' }
            }
          },
          '& .MuiCard-root': {
            maxWidth: '100%',
            overflow: 'hidden',
            boxSizing: 'border-box',
            margin: { xs: '4px 0', sm: '8px 0' },
            '& .MuiCardContent-root': {
              padding: { xs: '8px', sm: '16px' },
              '&:last-child': {
                paddingBottom: { xs: '8px', sm: '16px' }
              }
            }
          },
          '& .MuiDialog-paper': {
            maxWidth: { xs: '95vw', sm: '90vw', md: '80vw' },
            maxHeight: { xs: '85vh', sm: '85vh' },
            margin: { xs: '8px', sm: '16px' },
            overflow: 'auto',
            position: 'relative',
            boxSizing: 'border-box',
            borderRadius: { xs: '12px', sm: '16px' }
          },
          '& .MuiDialog-container': {
            alignItems: { xs: 'center', sm: 'center' },
            padding: { xs: '8px', sm: '16px' }
          },
          '& .MuiDialogContent-root': {
            padding: { xs: '8px', sm: '16px', md: '24px' },
            overflow: 'auto',
            maxHeight: { xs: '70vh', sm: '60vh' }
          },
          '& .MuiDialogActions-root': {
            padding: { xs: '8px', sm: '16px', md: '24px' },
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            gap: { xs: '8px', sm: '16px' },
            '& .MuiButton-root': {
              minWidth: { xs: '80px', sm: '100px' },
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }
          },
          '& .MuiFormControl-root': {
            width: '100%',
            margin: { xs: '4px 0', sm: '8px 0' },
            '& .MuiInputLabel-root': {
              fontSize: { xs: '0.875rem', sm: '1rem' }
            },
            '& .MuiInputBase-root': {
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }
          },
          '& .MuiTextField-root': {
            width: '100%',
            margin: { xs: '4px 0', sm: '8px 0' }
          },
          '& .MuiButton-root': {
            fontSize: { xs: '0.875rem', sm: '1rem' },
            padding: { xs: '6px 12px', sm: '8px 16px' },
            minHeight: { xs: '36px', sm: '40px' }
          },
          '& .MuiChip-root': {
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            height: { xs: '24px', sm: '32px' }
          },
          '& .MuiTypography-h4': {
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
          },
          '& .MuiTypography-h5': {
            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.5rem' }
          },
          '& .MuiTypography-h6': {
            fontSize: { xs: '1rem', sm: '1.25rem', md: '1.25rem' }
          },
          '& .MuiBox-root': {
            maxWidth: '100%',
            boxSizing: 'border-box'
          }
        }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
