import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { ExitToApp } from '@mui/icons-material';
import { clearToken, isLogged } from '../redux/slices/auth';
import { useNavigate } from 'react-router-dom';
import { URLS } from '../core/router';

const theme = createTheme();

export function Main(props: any) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuth = useSelector(isLogged);
  const signOut = () => {
    dispatch(clearToken());
    navigate(URLS.Home, { replace: true });
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <AccountBalanceIcon sx={{ mr: 2 }} />
          <Typography variant="h6" color="inherit" sx={{ flexGrow: 1 }} noWrap>
            Crypto Backend Testing UI
          </Typography>

          {isAuth && (
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={signOut}
              color="inherit"
            >
              <ExitToApp />
            </IconButton>
          )}

        </Toolbar>
      </AppBar>
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 16,
            pb: 6,
          }}
        >
          <Container maxWidth="xl">
            {props.children}
          </Container>
        </Box>
      </main>
    </ThemeProvider>
  );
}