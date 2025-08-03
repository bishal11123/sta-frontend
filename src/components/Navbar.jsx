import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import moment from 'moment-timezone';
import { useNavigate } from 'react-router-dom';
import flag from '../assets/nepal-flag.gif';

const Navbar = () => {
  const [nepalTime, setNepalTime] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Replace with real auth check
  const [anchorEl, setAnchorEl] = useState(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate();

  useEffect(() => {
    const updateTime = () => {
      const time = moment().tz('Asia/Kathmandu').format('hh:mm:ss A');
      setNepalTime(time);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleMenuClose();
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#6D28D9', px: 2 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo and Flag */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img src={flag} alt="Nepal Flag" style={{ width: 30, height: 30 }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            NICE Consultancy
          </Typography>
        </Box>

        {/* Right Side: Time */}
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {nepalTime}
        </Typography>

        {/* Desktop Menu */}
        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button color="inherit" onClick={() => navigate('/')}>Home</Button>
            <Button color="inherit" onClick={() => navigate('/downloads')}>Downloads</Button>

            {isLoggedIn ? (
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            ) : (
              <>
                <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: '#fff', color: '#6D28D9' }}
                  onClick={() => navigate('/signup')}
                >
                  Signup
                </Button>
              </>
            )}
          </Box>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <>
            <IconButton edge="end" color="inherit" onClick={handleMenuOpen}>
              <MenuIcon />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              keepMounted
            >
              <MenuItem onClick={() => handleNavigate('/')}>Home</MenuItem>
              <MenuItem onClick={() => handleNavigate('/downloads')}>Downloads</MenuItem>
              {!isLoggedIn ? (
                <>
                  <MenuItem onClick={() => handleNavigate('/login')}>Login</MenuItem>
                  <MenuItem onClick={() => handleNavigate('/signup')}>Signup</MenuItem>
                </>
              ) : (
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              )}
            </Menu>
          </>
        )}

        
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
