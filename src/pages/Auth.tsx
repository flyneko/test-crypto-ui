import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { Main } from '../layouts/Main';
import { useForm, Controller } from "react-hook-form";
import useApi from '../hooks/useApi';
import { Api } from '../core/api';
import {isLogged, setToken} from "../redux/slices/auth";
import { useDispatch, useSelector } from 'react-redux';
import { Alert, CircularProgress, Container, Grid } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Navigate } from 'react-router-dom';
import { URLS } from '../core/router';

const schema = yup.object({
    username: yup.string().required(),
    password: yup.string().required()
  }).required();

export function Auth() {
    const dispatch = useDispatch();
    const isAuth = useSelector(isLogged);
    const { handleSubmit, formState: { errors }, control } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            username: '',
            password: ''
        }
    });
    const [error, setError] = useState('');

    const { request: signInRequest, isLoading: isSignInLoading } = useApi(Api.signIn);
    const { request: signUpRequest, isLoading: isSignUpLoading } = useApi(Api.signUp);

    const onSubmit = (data: any, request) => {
        request(data).then((response: any) => {
            if (response.includes('Error'))
                setError(response);
            else
                response && dispatch(setToken(response));
        })
    };

    const handleClickSubmitButton = (request) => {

        handleSubmit((data) => onSubmit(data, request))();
    }

    return isAuth ? <Navigate to={URLS.Home} /> : (
        <Main>
            <Container maxWidth="sm">
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Auth
                    </Typography>
                    <Box width="100%" component="form" sx={{ mt: 1 }}>
                        <Controller
                            name="username"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Username"
                                    autoFocus
                                    error={!!errors.username}
                                    helperText={errors.username?.message}
                                />
                            )}
                        />
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Password"
                                    type="password"
                                    error={!!errors.password}
                                    helperText={errors.password?.message}
                                />
                            )}
                        />
                        {error && <Alert severity="error">{error}</Alert>}
                        
                        <Grid container spacing={5} sx={{ pt: 3 }}>
                            <Grid item xs={6}>
                                <Button
                                    onClick={() => handleClickSubmitButton(signInRequest)}
                                    type="button"
                                    fullWidth
                                    variant="outlined"
                                >
                                    {
                                        isSignInLoading ? <CircularProgress color="warning" size={25} /> : 'Sign in'
                                    }
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    onClick={() => handleClickSubmitButton(signUpRequest)}
                                    type="button"
                                    fullWidth
                                    variant="contained"
                                >
                                    {
                                        isSignUpLoading ? <CircularProgress color="warning" size={25} /> : 'Create'
                                    }
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </Main>
    );
}