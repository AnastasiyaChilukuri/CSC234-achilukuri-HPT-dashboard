import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MuiTabs from './MuiTabs';

export default function Appbar() {
  return (
    <Box sx={{ flexGrow: 1, borderColor: 'grey.500'}} width='800px' margin='auto' >
      <AppBar position="static" color='primary'>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} align='center'>
            Hornets Power Tools CO2 Tracker
          </Typography>
        </Toolbar>
      </AppBar>
    <MuiTabs/>
    </Box>
  );
}