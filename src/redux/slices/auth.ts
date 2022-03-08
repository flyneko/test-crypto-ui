import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import { DEFAULT_CURRENCY } from '../../core/constants';

const authSlice = createSlice({
    name: 'auth',
    initialState: { 
        currency: localStorage.getItem('currency') || DEFAULT_CURRENCY,
        token: localStorage.getItem('auth_token') || '',
        justLogged: false 
    },
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload
            localStorage.setItem('auth_token', action.payload);
        },
        setCurrency: (state, action) => {
            state.currency = action.payload
            localStorage.setItem('currency', action.payload);
        },
        setJustLogged: (state) => {
            state.justLogged = true
        },
        clearToken: (state) => {
            state.token = '';
            localStorage.removeItem('auth_token');
        },
    },
})

export const { setToken, setCurrency, setJustLogged, clearToken } = authSlice.actions

export default authSlice.reducer

export const isLogged = (state: any) => !!state.auth.token;
export const isJustLogged = (state: any) => state.auth.justLogged;
export const getToken = (state: any) => state.auth.token;
export const getCurrency = (state: any) => state.auth.currency;