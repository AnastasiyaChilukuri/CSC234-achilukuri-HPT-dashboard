import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MuiTabs from './MuiTabs';
import {useState, MouseEvent} from 'react';
import {UserContext} from './UserContext';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { List, ListItem, ListItemText } from '@mui/material'

export default function Appbar() {
  const [userToken, setUserToken] = useState({
    status: false,
    email:"",
    role:"",
    apiKey:""
  });
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleLogoutClick = () => {
    setUserToken({
      status: false,
      email:"",
      role:"",
      apiKey:"" 
    });
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function showLogout () {
    return (
      <div>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          
          open={open}
          onClose={() => setAnchorEl(null)}
        >
           <List>
                <ListItem>
                  <ListItemText primary={`User: ${userToken.email.split("@")[0]}`}/>
                </ListItem>
                <ListItem>
                  <ListItemText primary={`Role: ${userToken.role}`}/>
                </ListItem>
            </List>          
          <MenuItem onClick={() => handleLogoutClick()}>Logout</MenuItem>
        </Menu>
      </div>
    )
  }


  return (
    <Box sx={{ flexGrow: 1, borderColor: 'grey.500'}} width='800px' margin='auto' >
      <UserContext.Provider value={{userToken, setUserToken}}>
      <AppBar position="static" color='primary'>
      <Toolbar>
          {(userToken.status != false) && showLogout()}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} align='center'>
            Hornets Power Tools CO2 Tracker
          </Typography>
        </Toolbar>
      </AppBar>
    <MuiTabs/>
    </UserContext.Provider>
    </Box>
  );
}