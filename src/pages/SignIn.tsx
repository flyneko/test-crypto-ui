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
import { Alert, CircularProgress, Container } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { Navigate } from 'react-router-dom';
import { URLS } from '../core/router';

const schema = yup.object({
    username: yup.string().required(),
    password: yup.string().required()
  }).required();

export function SignIn() {
    const dispatch = useDispatch();
    const isAuth = useSelector(isLogged);
    const { register, handleSubmit, watch, formState: { errors }, control } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            username: '',
            password: ''
        }
    });
    const [error, setError] = useState('');

    const {data, request, isLoading} = useApi(Api.signIn);
    const onSubmit = (data: any) => {
        request(data).then((response: any) => {
            if (response.length > 30) {
                response && dispatch(setToken(response));
            } else {
                setError(response);
            }
        })
    };

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
                        Sign up
                    </Typography>
                    <Box width="100%" component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
                        <Controller
                            name="username"
                            control={control}
                            render={({ field }) => {
                                return (<TextField
                                    {...field}
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Username"
                                    autoFocus
                                    error={!!errors.username}
                                    helperText={errors.username?.message}
                                />)
                            }}
                        />
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => {
                                return (<TextField
                                    {...field}
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Password"
                                    type="password"
                                    error={!!errors.password}
                                    helperText={errors.password?.message}
                                />)
                            }}
                        />
                        {error && <Alert severity="error">{error}</Alert>}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {
                                isLoading ? <CircularProgress color="warning" size={25} /> : 'Create'
                            }
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Main>
    );
}