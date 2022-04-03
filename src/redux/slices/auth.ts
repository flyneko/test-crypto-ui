import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import { Api } from '../../core/api';
import { DEFAULT_CURRENCY } from '../../core/constants';

export const fetchUserInfo: any = createAsyncThunk('auth/fetchUserInfo', async () => {
    return await Api.getUserInfo()();
});


const authSlice = createSlice({
    name: 'auth',
    initialState: { 
        currency: localStorage.getItem('currency') || DEFAULT_CURRENCY,
        token: localStorage.getItem('auth_token') || '',
        info: {
            requestStatus: 'idle',
            data: {}
        },
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
            localStorage.removeItem('auth_token');

            state.token = '';
            state.info = {
                requestStatus: 'idle',
                data: {}
            };
        },
    },
    extraReducers: {
        [fetchUserInfo.pending]: (state, action) => {
            state.info.requestStatus = 'loading';
        },
        [fetchUserInfo.rejected]: (state, action) => {
            state.info.requestStatus = 'rejected';
        },
        [fetchUserInfo.fulfilled]: (state, action) => {
            state.info.requestStatus = 'succeeded';
            state.info.data = action.payload;
        },
    }
})

export const { setToken, setCurrency, setJustLogged, clearToken } = authSlice.actions

export default authSlice.reducer

export const isLogged = (state: any) => !!state.auth.token;
export const isJustLogged = (state: any) => state.auth.justLogged;
export const getToken = (state: any) => state.auth.token;
export const getCurrency = (state: any) => state.auth.currency;
export const getUserInfo = (state: any) => state.auth.info;