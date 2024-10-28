import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HistoryIcon from '@mui/icons-material/History';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Container>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Visitor Management System
          </Typography>
          <Button
            color="inherit"
            component={Link}
            to="/"
            startIcon={<PersonAddIcon />}
          >
            New Visitor
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/history"
            startIcon={<HistoryIcon />}
          >
            History
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;